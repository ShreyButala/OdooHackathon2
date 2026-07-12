npm run dev &
sleep 5

echo "--- Register Tokens ---"
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"dispatch2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)
FM_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"manager_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)
SO_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"safety_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

echo "--- Create Vehicle ---"
V1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "TRP-V1-A","vehicleName": "V1","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000}' http://localhost:3000/api/vehicles | jq -r .id)

echo "--- Create Driver ---"
D1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $SO_TOKEN" -d '{"name": "D1","licenseNumber": "TRP-D1-A","licenseCategory": "CDL-A","licenseExpiry": "2030-01-01T00:00:00.000Z","phone": "+15551111111", "safetyScore": 100}' http://localhost:3000/api/drivers | jq -r .id)

echo "\n--- (a) Create valid trip, dispatch, complete ---"
T1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"source\":\"NY\",\"destination\":\"LA\",\"vehicleId\":\"$V1\",\"driverId\":\"$D1\",\"cargoWeight\":5000,\"plannedDistance\":3000}" http://localhost:3000/api/trips | jq -r .id)
echo "Trip Created: $T1"

curl -s -X PATCH -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/trips/$T1/dispatch
echo "Check V1 Status (expect ON_TRIP):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/vehicles/$V1 | jq -r .status)
echo "Check D1 Status (expect ON_TRIP):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/drivers/$D1 | jq -r .status)

curl -s -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"actualOdometer":4000,"fuelUsed":200}' http://localhost:3000/api/trips/$T1/complete
echo "Check V1 Status (expect AVAILABLE):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/vehicles/$V1 | jq -r .status)
echo "Check V1 Odometer (expect 4000):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/vehicles/$V1 | jq -r .odometer)
echo "Check D1 Status (expect AVAILABLE):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/drivers/$D1 | jq -r .status)

echo "\n--- (b) Attempt to dispatch trip with RETIRED vehicle ---"
V2=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "TRP-V2-A","vehicleName": "V2","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000,"status":"RETIRED"}' http://localhost:3000/api/vehicles | jq -r .id)
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"source\":\"NY\",\"destination\":\"LA\",\"vehicleId\":\"$V2\",\"driverId\":\"$D1\",\"cargoWeight\":5000,\"plannedDistance\":3000}" http://localhost:3000/api/trips

echo "\n--- (c) Attempt to complete a DRAFT trip ---"
T3=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"source\":\"NY\",\"destination\":\"LA\",\"vehicleId\":\"$V1\",\"driverId\":\"$D1\",\"cargoWeight\":5000,\"plannedDistance\":3000}" http://localhost:3000/api/trips | jq -r .id)
curl -s -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"actualOdometer":4000,"fuelUsed":200}' http://localhost:3000/api/trips/$T3/complete

echo "\n--- (d) Cancel a DISPATCHED trip ---"
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/trips/$T3/dispatch
echo "Pre-Cancel V1 Status (expect ON_TRIP):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/vehicles/$V1 | jq -r .status)
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/trips/$T3/cancel
echo "Post-Cancel V1 Status (expect AVAILABLE):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/vehicles/$V1 | jq -r .status)
echo "Post-Cancel D1 Status (expect AVAILABLE):" $(curl -s -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/drivers/$D1 | jq -r .status)

kill %1
