#!/bin/bash
echo "🧪 Testing runtime environment variable detection using Docker (mimicking GCP deployment)..."

# Set the release mode to test
RELEASE_MODE=${1:-staging}
echo "Testing with RELEASE_MODE=$RELEASE_MODE"

# Build Docker image with build argument (mimicking GCP CloudBuild)
echo "Building Docker image with --build-arg RELEASE_MODE=$RELEASE_MODE..."
docker build --build-arg RELEASE_MODE=$RELEASE_MODE -t promptql-docs-test:$RELEASE_MODE .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "✅ Docker build completed successfully"

# Run the container
echo "Starting Docker container..."
docker run -d -p 3001:8080 --name promptql-test-$RELEASE_MODE promptql-docs-test:$RELEASE_MODE

# Wait for container to start
echo "Waiting for container to start..."
sleep 5

# Check if container is running
if ! docker ps | grep -q promptql-test-$RELEASE_MODE; then
    echo "❌ Container failed to start"
    docker logs promptql-test-$RELEASE_MODE
    exit 1
fi

echo "✅ Container started successfully"

# Test the deployment
echo "Testing the deployment..."

# Check if the releaseMode value is embedded in the JavaScript bundles by copying them from container
echo "Extracting JavaScript bundles from container..."
docker cp promptql-test-$RELEASE_MODE:/graphql-engine/docs/build ./test-build

# Check JavaScript bundles for releaseMode
echo "Checking JavaScript bundles for releaseMode..."
RELEASE_MODE_VALUE=$(find test-build -name "*.js" -exec grep -o 'releaseMode:"[^"]*"' {} \; | head -1)

echo "Found in JS bundles: $RELEASE_MODE_VALUE"

# Also try to fetch from the running container
echo "Checking live endpoint..."
ENDPOINT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/docs/index/ 2>/dev/null || echo "000")
echo "Endpoint status: $ENDPOINT_STATUS"

if [ "$ENDPOINT_STATUS" = "200" ]; then
    echo "✅ Container is serving content successfully"
else
    echo "⚠️  Container endpoint returned status: $ENDPOINT_STATUS"
fi

# Cleanup
echo "Cleaning up..."
docker stop promptql-test-$RELEASE_MODE > /dev/null 2>&1
docker rm promptql-test-$RELEASE_MODE > /dev/null 2>&1
rm -rf test-build

echo "Raw releaseMode value extracted: '$RELEASE_MODE_VALUE'"

# Verify the value
if [[ "$RELEASE_MODE_VALUE" == *"$RELEASE_MODE"* ]]; then
    echo "✅ SUCCESS: releaseMode contains '$RELEASE_MODE'"
    echo "🎉 Docker deployment test passed! The build argument is working correctly."
else
    echo "❌ FAILED: releaseMode does not contain '$RELEASE_MODE'"
    echo "Expected: releaseMode:\"$RELEASE_MODE\""
    echo "Got: $RELEASE_MODE_VALUE"
fi

echo ""
echo "To test different environments:"
echo "  ./scripts/env-test.sh staging"
echo "  ./scripts/env-test.sh production"
echo "  ./scripts/env-test.sh development"