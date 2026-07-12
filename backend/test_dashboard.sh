npm run dev &
sleep 5

echo "--- Setup Tokens ---"
FM_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"manager_trips2@example.com","password":"Password123"}' http://localhost:3000/api/auth/login | jq -r .token)

echo "\n--- Call Dashboard ---"
curl -s -X GET -H "Authorization: Bearer $FM_TOKEN" http://localhost:3000/api/dashboard | jq .

kill %1
