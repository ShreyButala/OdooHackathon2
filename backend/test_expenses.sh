npm run dev &
sleep 5

echo "--- Setup ---"
FM_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"manager_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Finance","email":"finance@example.com","password":"Password123","role":"FINANCIAL_ANALYST"}' http://localhost:3000/api/auth/register > /dev/null
FA_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"finance@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

V1=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FM_TOKEN" -d '{"registrationNumber": "EXP-V1","vehicleName": "V1","vehicleType": "Truck","maxLoadCapacity": 10000,"odometer": 1000,"acquisitionCost": 50000}' http://localhost:3000/api/vehicles | jq -r .id)

echo "\n--- 1. Create each expense type ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"MAINTENANCE\",\"amount\":100,\"description\":\"Brakes\"}" http://localhost:3000/api/expenses
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"TOLL\",\"amount\":15,\"description\":\"Bridge toll\"}" http://localhost:3000/api/expenses
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"REPAIR\",\"amount\":500,\"description\":\"Engine fix\"}" http://localhost:3000/api/expenses
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"PARKING\",\"amount\":20,\"description\":\"Overnight\"}" http://localhost:3000/api/expenses
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"OTHER\",\"amount\":50,\"description\":\"Supplies\"}" http://localhost:3000/api/expenses

echo "\n--- 2. Attempt invalid type ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"FOOD\",\"amount\":15,\"description\":\"Lunch\"}" http://localhost:3000/api/expenses

echo "\n--- 3. Attempt negative amount ---"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FA_TOKEN" -d "{\"vehicleId\":\"$V1\",\"type\":\"TOLL\",\"amount\":-10,\"description\":\"Refund?\"}" http://localhost:3000/api/expenses

echo "\n--- 4. List Queries (Filter by TOLL) ---"
curl -s -X GET -H "Authorization: Bearer $FA_TOKEN" "http://localhost:3000/api/expenses?vehicleId=$V1&type=TOLL"

kill %1
