#!/bin/bash

echo "Waiting for Hydra to start..."
sleep 10

# Create OAuth2 client for Docusaurus
curl -X POST \
  http://localhost:4445/admin/clients \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "docusaurus-client",
    "client_name": "Docusaurus Documentation",
    "redirect_uris": ["http://localhost:3001/docs/callback"],
    "grant_types": ["authorization_code"],
    "response_types": ["code"],
    "scope": "openid email",
    "token_endpoint_auth_method": "none"
  }'

echo "Client created successfully!"
echo "Client ID: docusaurus-client"
echo "Client Type: Public (no client secret)"
echo "Redirect URI: http://localhost:3001/docs/callback"