#!/bin/bash

echo "🛑 Stopping PromptQL Docs Development Environment"
echo "================================================="

echo "📦 Stopping authentication services..."
docker compose -f auth/compose.yml down

echo "✅ Development environment stopped."
echo ""
echo "💡 To start again, run: yarn dev"
