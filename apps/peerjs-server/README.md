# PeerJS Server

Self-hosted PeerJS signaling server for the Pictionary game.

## Local Development

```bash
cd apps/peerjs-server
npm install
npm start
```

Server will run on `http://localhost:9000`

## Deploy to Render

1. Push this code to your GitHub repository
2. Go to https://render.com and sign in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `pictionary-peerjs-server` (or any name you want)
   - **Root Directory**: `apps/peerjs-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Click "Create Web Service"
7. Wait for deployment (2-3 minutes)
8. Copy your service URL (e.g., `https://pictionary-peerjs-server.onrender.com`)

## Configure Your App

After deployment, update `apps/pictionary/src/hooks/usePeerConnection.ts`:

```typescript
return new Peer(id, {
  host: 'your-service-name.onrender.com',
  port: 443,
  path: '/peerjs',
  secure: true,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  },
  debug: 2,
});
```

Replace `your-service-name.onrender.com` with your actual Render URL.
