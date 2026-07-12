npm run dev &
sleep 5

echo "--- Setup ---"
FM_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"manager_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

V1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "MAINT-V1","vehicleName": "V1","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000}' http://localhost:3000/api/vehicles | jq -r .id)
V2=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "MAINT-V2","vehicleName": "V2","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000, "status": "ON_TRIP"}' http://localhost:3000/api/vehicles | jq -r .id)

echo "\n--- 1. Create maintenance on an AVAILABLE vehicle ---"
M1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"vehicleId\":\"$V1\",\"description\":\"Oil change\",\"cost\":150.50}" http://localhost:3000/api/maintenance | jq -r .id)
echo "Maintenance Created: $M1"
echo "Check V1 Status (expect IN_SHOP):" $(curl -s -X GET -H "Authorization: Bearer $FM_TOKEN" http://localhost:3000/api/vehicles/$V1 | jq -r .status)

echo "\n--- 2. Attempt to create maintenance on an ON_TRIP vehicle ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"vehicleId\":\"$V2\",\"description\":\"Tire rotation\",\"cost\":200}" http://localhost:3000/api/maintenance

echo "\n--- 3. Attempt a second concurrent ACTIVE maintenance on V1 ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"vehicleId\":\"$V1\",\"description\":\"Engine check\",\"cost\":500}" http://localhost:3000/api/maintenance

echo "\n--- 4. Close maintenance ---"
curl -s -X PATCH -H "Authorization: Bearer $FM_TOKEN" http://localhost:3000/api/maintenance/$M1/close
echo "Check V1 Status (expect AVAILABLE):" $(curl -s -X GET -H "Authorization: Bearer $FM_TOKEN" http://localhost:3000/api/vehicles/$V1 | jq -r .status)

kill %1
