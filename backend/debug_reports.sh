echo "--- Check complete ---"
FA_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"finance@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)
DISP_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"dispatcher_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

V2=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "RPT-V2","vehicleName": "V2","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000}' http://localhost:3000/api/vehicles | jq -r .id)

echo "Fuel create:"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $DISP_TOKEN" -d "{\"vehicleId\":\"$V2\",\"liters\":100,\"cost\":300.00}" http://localhost:3000/api/fuel
