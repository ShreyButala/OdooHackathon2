npm run dev &
sleep 5

echo "--- Setup ---"
FM_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"manager_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)
SO_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"safety_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

V1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "FUEL-V1","vehicleName": "V1","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000}' http://localhost:3000/api/vehicles | jq -r .id)
V2=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "FUEL-V2","vehicleName": "V2","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000}' http://localhost:3000/api/vehicles | jq -r .id)
D1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $SO_TOKEN" -d '{"name": "D1","licenseNumber": "FUEL-D1","licenseCategory": "CDL-A","licenseExpiry": "2030-01-01T00:00:00.000Z","phone": "+15551111111", "safetyScore": 100}' http://localhost:3000/api/drivers | jq -r .id)
T1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"source\":\"NY\",\"destination\":\"LA\",\"vehicleId\":\"$V1\",\"driverId\":\"$D1\",\"cargoWeight\":5000,\"plannedDistance\":3000}" http://localhost:3000/api/trips | jq -r .id)

echo "\n--- 1. Create Fuel without TripId ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"vehicleId\":\"$V1\",\"liters\":50,\"cost\":150.50}" http://localhost:3000/api/fuel

echo "\n--- 2. Create Fuel with valid TripId ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"vehicleId\":\"$V1\",\"tripId\":\"$T1\",\"liters\":100,\"cost\":300.00}" http://localhost:3000/api/fuel

echo "\n--- 3. Attempt to Create Fuel with TripId belonging to different vehicle ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"vehicleId\":\"$V2\",\"tripId\":\"$T1\",\"liters\":50,\"cost\":150.50}" http://localhost:3000/api/fuel

echo "\n--- 4. List Queries (Filter by Vehicle 1) ---"
curl -s -X GET -H "Authorization: Bearer $FM_TOKEN" "http://localhost:3000/api/fuel?vehicleId=$V1"

kill %1
