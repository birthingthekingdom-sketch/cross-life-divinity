#!/bin/bash

API_URL="https://3000-i9nxlz0y9rbipwws2kmnd-df6539f8.us2.manus.computer/api/trpc"

# First, get all courses to find GED course IDs
echo "Fetching courses..."
COURSES=$(curl -s "${API_URL}/courses.list" | jq '.result.data[] | select(.code | startswith("GED")) | {code, id}')

echo "Found GED courses:"
echo "$COURSES" | jq .

# Extract course IDs
GED_MATH_ID=$(echo "$COURSES" | jq -r 'select(.code == "GED-MATH") | .id' | head -1)
GED_RLA_ID=$(echo "$COURSES" | jq -r 'select(.code == "GED-RLA") | .id' | head -1)
GED_SCI_ID=$(echo "$COURSES" | jq -r 'select(.code == "GED-SCI") | .id' | head -1)
GED_SS_ID=$(echo "$COURSES" | jq -r 'select(.code == "GED-SS") | .id' | head -1)

echo "GED-MATH ID: $GED_MATH_ID"
echo "GED-RLA ID: $GED_RLA_ID"
echo "GED-SCI ID: $GED_SCI_ID"
echo "GED-SS ID: $GED_SS_ID"
