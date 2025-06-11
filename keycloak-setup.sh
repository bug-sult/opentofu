#!/bin/bash

# Keycloak Setup Script
# This script configures Keycloak with the movie-realm and creates a test user

KEYCLOAK_URL="http://localhost:30082"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin123"
REALM_NAME="movie-realm"
CLIENT_ID="movie-app"
TEST_USER="testuser"
TEST_PASSWORD="test123"

echo "Setting up Keycloak configuration..."

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
until curl -f $KEYCLOAK_URL/realms/master > /dev/null 2>&1; do
    echo "Waiting for Keycloak..."
    sleep 5
done

echo "Keycloak is ready!"

# Get admin token
echo "Getting admin token..."
ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$ADMIN_USER" \
  -d "password=$ADMIN_PASSWORD" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
    echo "Failed to get admin token. Please check Keycloak credentials."
    exit 1
fi

echo "Admin token obtained successfully!"

# Create realm
echo "Creating realm: $REALM_NAME"
curl -s -X POST "$KEYCLOAK_URL/admin/realms" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "'$REALM_NAME'",
    "enabled": true,
    "displayName": "Movie Library Realm",
    "registrationAllowed": true,
    "loginWithEmailAllowed": true,
    "duplicateEmailsAllowed": false
  }'

# Create client
echo "Creating client: $CLIENT_ID"
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "'$CLIENT_ID'",
    "enabled": true,
    "publicClient": true,
    "directAccessGrantsEnabled": true,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "serviceAccountsEnabled": false,
    "redirectUris": ["http://localhost:30083/*", "http://localhost:3000/*"],
    "webOrigins": ["http://localhost:30083", "http://localhost:3000"],
    "protocol": "openid-connect"
  }'

# Create test user
echo "Creating test user: $TEST_USER"
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'$TEST_USER'",
    "enabled": true,
    "emailVerified": true,
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "credentials": [{
      "type": "password",
      "value": "'$TEST_PASSWORD'",
      "temporary": false
    }]
  }'

echo "Keycloak setup completed successfully!"
echo ""
echo "=== Keycloak Configuration ==="
echo "Keycloak URL: $KEYCLOAK_URL"
echo "Admin Console: $KEYCLOAK_URL/admin"
echo "Admin User: $ADMIN_USER"
echo "Admin Password: $ADMIN_PASSWORD"
echo ""
echo "=== Movie Library Configuration ==="
echo "Realm: $REALM_NAME"
echo "Client ID: $CLIENT_ID"
echo "Test User: $TEST_USER"
echo "Test Password: $TEST_PASSWORD"
echo ""
echo "You can now access the Movie Library at: http://localhost:30083"
