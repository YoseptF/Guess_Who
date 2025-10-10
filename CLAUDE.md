# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Nx monorepo containing a multiplayer "Guess Who?" game and related projects. The repository uses React 19, TypeScript, Vite, and Tailwind CSS v4 with PeerJS for real-time peer-to-peer communication.

## Monorepo Structure

The workspace is organized as an Nx monorepo with two applications and two shared libraries:

### Applications (`apps/`)
- **guess-who**: The main "Guess Who?" multiplayer game application
  - Runs on port 4200 (dev), 4300 (preview)
  - Uses PeerJS for P2P multiplayer connections
  - Character providers fetch from external APIs
  - Build output: `dist/apps/guess-who`

- **main-site**: Landing page for all games
  - Minimal landing/portfolio site
  - Build output: `dist/apps/main-site`

### Libraries (`libs/`)
- **shared-ui**: Reusable UI components (Button, Input, DropdownMenu, etc.)
  - Based on Radix UI and Tailwind CSS
  - Exports button variants, cn utility, and common components

- **game-utils**: Game logic utilities shared across applications
  - Contains game handlers, URL utilities, and common game logic
  - Exports `getRoomCodeFromUrl` and game-specific handlers

### Path Aliases
All projects use TypeScript path aliases defined in `tsconfig.base.json`:
```typescript
{
  "@/*": ["./src/*"],
  "game-utils": ["libs/game-utils/src/index.ts"],
  "shared-ui": ["libs/shared-ui/src/index.ts"]
}
```

## Development Commands

### Running Applications
```bash
# Run guess-who game (default dev command)
npm run dev
# or explicitly
npm run dev:guess-who

# Run main-site
npm run dev:main
```

### Building
```bash
# Build both applications
npm run build

# Build individual apps
npm run build:guess-who
npm run build:main
```

### Linting
```bash
# Lint all projects
npm run lint

# Lint specific projects
npm run lint:guess-who
npm run lint:main
```

### Type Checking
```bash
# Run type checking across all projects
npm run type-check
```

### Preview Production Builds
```bash
npm run preview:guess-who
npm run preview:main
```

### Nx Graph
```bash
# Visualize project dependencies
npm run graph
```

## Code Standards

### TypeScript Rules (Enforced via ESLint)
- **Never use `any`**: `@typescript-eslint/no-explicit-any` is set to error
- **Never use `as` for type assertions**: Avoid unsafe assignments and member access
- **Use function expressions, not declarations**: `func-style: ['error', 'expression']`
- **Use arrow functions concisely**: `arrow-body-style: ['error', 'as-needed']`
- **Minimal arrow function parens**: `arrow-parens: ['error', 'as-needed']`

### Logging
- Use `console.debug` instead of `console.log` for browser console output
- Clean up debug logs when no longer needed to keep console output minimal

### Comments
- Avoid trivial comments explaining obvious code
- Only add comments for complex logic that needs explanation
- Comments should explain "why", not "what"

## Architecture Patterns

### Guess Who Game Architecture
The game follows a clean separation of concerns:

- **Hooks** (`apps/guess-who/src/hooks/`):
  - `useCharacters.ts`: Fetches character data from external APIs
  - `usePeerConnection.ts`: Manages PeerJS connections and room logic
  - `useGameState.ts`: Manages game state (crossed out characters, scores, etc.)

- **Contexts** (`apps/guess-who/src/contexts/`):
  - `SettingsContext.tsx`: Global settings management

- **Types** (`apps/guess-who/src/types.ts`):
  - `Character`, `GameState`, `GamePhase`, `PeerData` interfaces
  - Character provider patterns for extensible data sources

### State Management
- React Context API for global settings (SettingsContext)
- Custom hooks for feature-specific state (game state, peer connections, characters)
- No external state management library (Redux, Zustand, etc.)

### Peer-to-Peer Networking
- Uses PeerJS for WebRTC-based P2P connections
- Room-based system with human-readable room codes (via `human-id` package)
- Synchronizes game state via `PeerData` messages:
  - `gameStart`: Initial game setup with characters and secret
  - `crossOut`: Sync crossed-out character IDs
  - `ready`: Player readiness status
  - `nameUpdate`: Player name changes

## Deployment

The project uses Cloudflare Pages for deployment with separate builds and automatic deployments:

### Cloudflare Pages Projects

- **Main site**: `games.yosept.me` (deploys `main-site` app)
  - Project name: `main-site-games`
  - Build command: `bunx nx build main-site`
  - Build output: `dist/apps/main-site`
  - Build watch paths:
    - Include: `apps/main-site/*, libs/*`
    - Exclude: `[]`

- **Guess Who**: `guesswho.yosept.me` (deploys `guess-who` app)
  - Project name: `guess-who-game`
  - Build command: `bunx nx build guess-who`
  - Build output: `dist/apps/guess-who`
  - Build watch paths:
    - Include: `apps/guess-who/*, libs/*`
    - Exclude: `[]`

### Automatic Deployment Behavior

Both projects connect to the same GitHub repository on the `main` branch. Cloudflare Pages uses **Build Watch Paths** to conditionally deploy:

- Changes to `apps/guess-who/**` → Only `guess-who` rebuilds
- Changes to `apps/main-site/**` → Only `main-site` rebuilds
- Changes to `libs/**` → Both projects rebuild (shared dependencies)
- Changes to both apps → Both projects rebuild

### Manual Deployment

Use the deployment script for manual deployments:

```bash
# Deploy main-site
./scripts/deploy.sh main-site

# Deploy guess-who
./scripts/deploy.sh guess-who
```

Requirements:
- Environment variables: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Wrangler CLI: `npm install -g wrangler`

Build commands use `bunx nx build [app-name]` with Node 22.

## Important Notes

- **React 19**: This project uses React 19, which may have breaking changes from React 18
- **Tailwind CSS v4**: Uses the new Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **Nx Executors**: All build/serve/lint commands use Nx executors (`@nx/vite:build`, `@nx/eslint:lint`, etc.)
- **Vite Configuration**: Each app has its own `vite.config.ts` with path aliases configured
