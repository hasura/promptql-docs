#!/bin/bash

echo "🚀 Starting PromptQL Docs Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "📦 Starting authentication services..."

# Start Hydra and Login/Consent services
cd auth
docker compose -f compose.yml up -d
cd ..

echo "⏳ Waiting for services to start..."
sleep 15

echo "🔧 Setting up OAuth2 client..."
./auth/setup-client.sh

echo ""
echo "✅ Authentication services are ready!"
echo ""
echo "🌐 Service URLs:"
echo "   - Hydra Admin API: http://localhost:4445"
echo "   - Hydra Public API: http://localhost:4444"
echo "   - Login/Consent UI: http://localhost:3000"
echo ""

echo "🚀 Starting Docusaurus development server..."
echo ""

# Start Docusaurus in the foreground so we can see logs and stop with Ctrl+C
npx docusaurus start --port 3001 --host 0.0.0.0

echo ""
echo "🛑 Shutting down services..."
docker compose -f auth/compose.yml down

echo "✅ Development environment stopped."
