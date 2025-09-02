#!/bin/bash

echo "🚀 Starting PromptQL Docs Authentication Development Environment"
echo "=============================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "📦 Starting Hydra and Login/Consent services..."

# Start the services in the background
cd "$(dirname "$0")"
docker compose -f compose.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "🔧 Setting up OAuth2 client..."
./setup-client.sh

echo ""
echo "✅ Authentication services are ready!"
echo ""
echo "🌐 Service URLs:"
echo "   - Hydra Admin API: http://localhost:4445"
echo "   - Hydra Public API: http://localhost:4444"
echo "   - Login/Consent UI: http://localhost:3000"
echo ""
echo "📝 Next steps:"
echo "   1. Start your Docusaurus dev server: npm start"
echo "   2. Visit http://localhost:3001"
echo "   3. Try accessing any documentation page to test authentication"
echo ""
echo "🔍 To view logs:"
echo "   docker compose -f auth/compose.yml logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker compose -f auth/compose.yml down"
