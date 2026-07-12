npm run dev &
sleep 5

echo "--- Setup Tokens ---"
FA_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"finance@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)
FM_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"manager_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)
SO_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"safety_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)
DISP_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"dispatcher_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

echo "--- Create Isolated Test Vehicle/Driver/Trip ---"
V1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "RPT-V1","vehicleName": "V1","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000}' http://localhost:3000/api/vehicles | jq -r .id)
D1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $SO_TOKEN" -d '{"name": "RPT-D1","licenseNumber": "RPT-D1","licenseCategory": "CDL-A","licenseExpiry": "2030-01-01T00:00:00.000Z","phone": "+15551111111", "safetyScore": 100}' http://localhost:3000/api/drivers | jq -r .id)

T1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $DISP_TOKEN" -d "{\"source\":\"NY\",\"destination\":\"LA\",\"vehicleId\":\"$V1\",\"driverId\":\"$D1\",\"cargoWeight\":5000,\"plannedDistance\":3000}" http://localhost:3000/api/trips | jq -r .id)
curl -s -X PATCH -H "Authorization: Bearer $DISP_TOKEN" http://localhost:3000/api/trips/$T1/dispatch > /dev/null
curl -s -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $DISP_TOKEN" -d "{\"actualOdometer\":3000,\"fuelConsumed\":200}" http://localhost:3000/api/trips/$T1/complete > /dev/null

curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $DISP_TOKEN" -d "{\"vehicleId\":\"$V1\",\"liters\":100,\"cost\":300.00}" http://localhost:3000/api/fuel > /dev/null

M1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d "{\"vehicleId\":\"$V1\",\"description\":\"Oil change\",\"cost\":500}" http://localhost:3000/api/maintenance | jq -r .id)
curl -s -X PATCH -H "Authorization: Bearer $FM_TOKEN" http://localhost:3000/api/maintenance/$M1/close > /dev/null

curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"TOLL\",\"amount\":200,\"description\":\"Tolls\"}" http://localhost:3000/api/expenses > /dev/null

echo "\n--- Verify Metrics for RPT-V1 ---"
echo "Expected:"
echo "Actual Distance: 2000"
echo "Fuel Liters: 100"
echo "Fuel Efficiency: 2000 / 100 = 20"
echo "Operational Cost: 300 (fuel) + 500 (maint) + 200 (exp) = 1000"
echo "Acquisition Cost: 50000"
echo "Revenue Provided: 10000"
echo "ROI: (10000 - 1000) / 50000 = 0.18"

echo "\nCalling API..."
curl -s -X GET -H "Authorization: Bearer $FA_TOKEN" "http://localhost:3000/api/reports?vehicleId=$V1&revenue=10000" | jq '.vehicleBreakdowns[0]'

kill %1
