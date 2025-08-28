#!/bin/bash

# Function to cleanup services on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    docker compose -f auth/compose.yml down
    echo "✅ Local testing environment stopped."
    exit 0
}

# Set up trap to catch Ctrl+C and other exit signals
trap cleanup SIGINT SIGTERM EXIT

echo "🏗️  Building PromptQL Docs for Local Testing"
echo "============================================="

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

echo "🏗️  Building Docusaurus for local testing..."
DOCUSAURUS_BUILD_TYPE=local npx docusaurus build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🌐 Service URLs:"
echo "   - Hydra Admin API: http://localhost:4445"
echo "   - Hydra Public API: http://localhost:4444"
echo "   - Login/Consent UI: http://localhost:3000"
echo ""

echo "🚀 Starting production server with authentication..."
echo ""
echo "📝 The production build will be served at http://localhost:3001"
echo "   Press Ctrl+C to stop the server and clean up services"
echo ""

# Start the production server in the foreground
npx docusaurus serve --port 3001

# The cleanup function will be called automatically when the script exits
