#!/bin/bash

# Deploy script for selective Netlify deployments
# Usage: ./scripts/deploy.sh [app-name]
# Example: ./scripts/deploy.sh guess-who

set -e

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
    echo "Error: Please specify an app name"
    echo "Usage: ./scripts/deploy.sh [app-name]"
    echo "Available apps: main-site, guess-who"
    exit 1
fi

case $APP_NAME in
    "main-site")
        echo "🚀 Deploying main-site to games.yosept.me..."
        bunx nx build main-site
        netlify deploy --prod --dir=dist/apps/main-site --config=netlify-main-site.toml
        ;;
    "guess-who")
        echo "🚀 Deploying guess-who to guesswho.yosept.me..."
        bunx nx build guess-who
        netlify deploy --prod --dir=dist/apps/guess-who --config=netlify-guess-who.toml
        ;;
    *)
        echo "Error: Unknown app '$APP_NAME'"
        echo "Available apps: main-site, guess-who"
        exit 1
        ;;
esac

echo "✅ Deployment complete!"