#!/bin/bash

# Deploy script for selective Cloudflare Pages deployments
# Usage: ./scripts/deploy.sh [app-name]
# Example: ./scripts/deploy.sh guess-who
#
# Prerequisites:
# - CLOUDFLARE_API_TOKEN environment variable set
# - CLOUDFLARE_ACCOUNT_ID environment variable set
# - wrangler CLI installed: npm install -g wrangler

set -e

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
    echo "Error: Please specify an app name"
    echo "Usage: ./scripts/deploy.sh [app-name]"
    echo "Available apps: main-site, guess-who"
    exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "Error: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables must be set"
    exit 1
fi

case $APP_NAME in
    "main-site")
        echo "🚀 Deploying main-site to games.yosept.me..."
        bunx nx build main-site
        npx wrangler pages deploy dist/apps/main-site --project-name=main-site-games --branch=main
        ;;
    "guess-who")
        echo "🚀 Deploying guess-who to guesswho.yosept.me..."
        bunx nx build guess-who
        npx wrangler pages deploy dist/apps/guess-who --project-name=guess-who-game --branch=main
        ;;
    *)
        echo "Error: Unknown app '$APP_NAME'"
        echo "Available apps: main-site, guess-who"
        exit 1
        ;;
esac

echo "✅ Deployment complete!"