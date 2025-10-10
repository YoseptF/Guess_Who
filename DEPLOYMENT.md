# Cloudflare Pages Deployment Guide

This guide walks through setting up automated deployments for the Guess Who monorepo on Cloudflare Pages.

## Overview

This monorepo contains two applications that deploy to separate Cloudflare Pages projects:

- **Main Site**: `games.yosept.me` (main-site app)
- **Guess Who Game**: `guesswho.yosept.me` (guess-who app)

Both projects connect to the same GitHub repository but deploy selectively based on which files changed, using Cloudflare Pages' **Build Watch Paths** feature.

## Setup Instructions

### 1. Create Cloudflare Pages Projects

#### Project 1: Main Site

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Click **Create application** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure the project:
   - **Project name**: `main-site-games`
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: `bunx nx build main-site`
   - **Build output directory**: `dist/apps/main-site`
5. Click **Save and Deploy**

#### Project 2: Guess Who Game

1. Repeat the above steps with:
   - **Project name**: `guess-who-game`
   - **Build command**: `bunx nx build guess-who`
   - **Build output directory**: `dist/apps/guess-who`

### 2. Configure Build Watch Paths

This is the key feature that enables selective deployments in the monorepo.

#### For Main Site Project:

1. Go to **main-site-games** project → **Settings** → **Build & deployments**
2. Scroll to **Build watch paths**
3. Configure:
   - **Include paths**: `apps/main-site/*, libs/*`
   - **Exclude paths**: Leave empty (`[]`)
4. Click **Save**

#### For Guess Who Project:

1. Go to **guess-who-game** project → **Settings** → **Build & deployments**
2. Scroll to **Build watch paths**
3. Configure:
   - **Include paths**: `apps/guess-who/*, libs/*`
   - **Exclude paths**: Leave empty (`[]`)
4. Click **Save**

### 3. Configure Custom Domains

#### Main Site:

1. Go to **main-site-games** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `games.yosept.me`
4. Follow DNS configuration instructions

#### Guess Who:

1. Go to **guess-who-game** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `guesswho.yosept.me`
4. Follow DNS configuration instructions

### 4. Environment Variables (if needed)

If your apps require environment variables:

1. Go to project → **Settings** → **Environment variables**
2. Add variables for **Production** and **Preview** environments
3. Click **Save**

## How It Works

### Automatic Deployment Logic

Cloudflare Pages monitors the `main` branch for changes. When you push commits:

1. **Change only `apps/guess-who/**`**
   - ✅ `guess-who-game` project rebuilds and deploys
   - ⏭️ `main-site-games` project skips build

2. **Change only `apps/main-site/**`**
   - ⏭️ `guess-who-game` project skips build
   - ✅ `main-site-games` project rebuilds and deploys

3. **Change `libs/**` (shared code)**
   - ✅ Both projects rebuild and deploy
   - This ensures both apps stay in sync when shared code changes

4. **Change both `apps/guess-who/**` and `apps/main-site/**`**
   - ✅ Both projects rebuild and deploy

### Build Watch Path Rules

- **Exclude paths** are evaluated first
- Remaining paths are checked against **include paths**
- Build triggers if any matching path is found
- Wildcards: `*` matches zero or more characters

## Manual Deployment

For manual deployments (bypassing automatic triggers):

### Prerequisites

1. Install Wrangler globally:
   ```bash
   npm install -g wrangler
   ```

2. Set environment variables:
   ```bash
   export CLOUDFLARE_API_TOKEN="your-api-token"
   export CLOUDFLARE_ACCOUNT_ID="your-account-id"
   ```

   To get these values:
   - **API Token**: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - **Account ID**: Cloudflare Dashboard → Workers & Pages → Account ID (right sidebar)

### Deploy Commands

```bash
# Deploy main-site
./scripts/deploy.sh main-site

# Deploy guess-who
./scripts/deploy.sh guess-who
```

## Troubleshooting

### Both projects deploy when only one should

**Check Build Watch Paths**:
- Ensure include paths are specific to each app
- Verify no overlapping patterns

### Deployments not triggering

**Common causes**:
- Build watch paths too restrictive
- Changes in excluded paths
- Branch not set to `main`

**Debug steps**:
1. Check **Deployments** tab for skip reasons
2. Review **Build watch paths** configuration
3. Verify branch settings in project settings

### Build failures

**Check**:
- Node version (should be 22, set via `.node-version`)
- Build command matches local development
- All dependencies in `package.json`
- Build output directory is correct

## Monitoring Deployments

1. Go to project → **Deployments** tab
2. View build logs for each deployment
3. Check deployment status (Success, Failed, Skipped)
4. Click on a deployment to see detailed logs

## Migration from Netlify

If migrating from Netlify:

1. ✅ Set up Cloudflare Pages projects (steps above)
2. ✅ Configure build watch paths
3. ✅ Set up custom domains
4. ⏳ Test deployments by pushing changes
5. ⏳ Verify both sites work on Cloudflare
6. ⏳ Update DNS records if not using Cloudflare DNS
7. ⏳ Delete Netlify sites after verification

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Build Watch Paths Guide](https://developers.cloudflare.com/pages/configuration/build-watch-paths/)
- [Monorepo Support](https://developers.cloudflare.com/pages/configuration/monorepos/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
