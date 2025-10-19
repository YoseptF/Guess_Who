import Peer, { DataConnection } from 'peerjs';
import { useCallback, useRef } from 'react';
import { humanId } from 'human-id';
import type { PictionaryPeerData } from '../types';

const SELF_HOSTED_SERVER = {
  host: 'pictionary-peerjs-server.onrender.com',
  port: 443,
  path: '/peerjs',
  secure: true,
};

export const usePeerConnection = () => {
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const usingSelfHostedRef = useRef(false);

  const assertPeerData = (data: unknown): data is PictionaryPeerData => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid peer data');
    }
    if (!('type' in data)) {
      throw new Error('Missing type in peer data');
    }
    return true;
  };

  const createPeer = useCallback((useSelfHosted = false) => {
    const id = humanId({
      separator: '-',
      capitalize: false,
    });

    const config = {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
      debug: 2,
    };

    if (useSelfHosted) {
      console.debug('Using self-hosted PeerJS server');
      usingSelfHostedRef.current = true;
      return new Peer(id, { ...config, ...SELF_HOSTED_SERVER });
    }

    console.debug('Trying public PeerJS server first');
    usingSelfHostedRef.current = false;
    return new Peer(id, config);
  }, []);

  const createRoom = useCallback(
    (
      onRoomCreated: (roomCode: string) => void,
      onConnectionEstablished: (peerId: string) => void,
      onDataReceived: (data: PictionaryPeerData, peerId: string) => void,
      onDisconnect: (peerId: string) => void,
      onError: (error: Error) => void,
    ) => {
      let peer = createPeer(false);
      peerRef.current = peer;
      let publicServerFailed = false;

      const timeout = setTimeout(() => {
        if (!peer.open && !publicServerFailed) {
          console.debug('Public server timeout, switching to self-hosted');
          publicServerFailed = true;
          peer.destroy();

          peer = createPeer(true);
          peerRef.current = peer;

          peer.on('open', id => {
            onRoomCreated(id);
          });

          setupPeerListeners(peer);
        }
      }, 10000);

      const setupPeerListeners = (peerInstance: Peer) => {
        peerInstance.on('connection', conn => {
          connectionsRef.current.set(conn.peer, conn);

          conn.on('data', data => {
            try {
              if (assertPeerData(data)) {
                onDataReceived(data, conn.peer);
              }
            } catch (error) {
              console.error('Error handling peer data:', error);
            }
          });

          conn.on('open', () => {
            onConnectionEstablished(conn.peer);
          });

          conn.on('close', () => {
            connectionsRef.current.delete(conn.peer);
            onDisconnect(conn.peer);
          });

          conn.on('error', err => {
            console.error('Connection error:', err);
            onError(err);
          });
        });

        peerInstance.on('error', err => {
          console.error('Peer error:', err);
          if (!publicServerFailed) {
            onError(err);
          }
        });
      };

      peer.on('open', id => {
        clearTimeout(timeout);
        console.debug(`Connected to ${usingSelfHostedRef.current ? 'self-hosted' : 'public'} server`);
        onRoomCreated(id);
      });

      setupPeerListeners(peer);
    },
    [createPeer, assertPeerData],
  );

  const joinRoom = useCallback(
    (
      roomCode: string,
      onConnected: () => void,
      onDataReceived: (data: PictionaryPeerData) => void,
      onDisconnect: () => void,
      onError: (error: Error) => void,
    ) => {
      let peer = createPeer(false);
      peerRef.current = peer;
      let publicServerFailed = false;

      const timeout = setTimeout(() => {
        if (!peer.open && !publicServerFailed) {
          console.debug('Public server timeout when joining, switching to self-hosted');
          publicServerFailed = true;
          peer.destroy();

          peer = createPeer(true);
          peerRef.current = peer;

          peer.on('open', () => {
            attemptConnection(peer);
          });

          peer.on('error', err => {
            console.error('Peer error:', err);
            if (!publicServerFailed) {
              onError(err);
            }
          });
        }
      }, 10000);

      const attemptConnection = (peerInstance: Peer) => {
        const conn = peerInstance.connect(roomCode);
        connectionsRef.current.set(roomCode, conn);

        conn.on('data', data => {
          try {
            if (assertPeerData(data)) {
              onDataReceived(data);
            }
          } catch (error) {
            console.error('Error handling peer data:', error);
          }
        });

        conn.on('open', () => {
          clearTimeout(timeout);
          console.debug(`Connected to room via ${usingSelfHostedRef.current ? 'self-hosted' : 'public'} server`);
          onConnected();
        });

        conn.on('error', err => {
          console.error('Connection error:', err);
          onError(err);
        });

        conn.on('close', () => {
          connectionsRef.current.delete(roomCode);
          onDisconnect();
        });
      };

      peer.on('open', () => {
        attemptConnection(peer);
      });

      peer.on('error', err => {
        console.error('Peer error:', err);
        if (!publicServerFailed) {
          onError(err);
        }
      });
    },
    [createPeer, assertPeerData],
  );

  const broadcast = useCallback((data: PictionaryPeerData) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) {
        conn.send(data);
      }
    });
  }, []);

  const sendTo = useCallback((peerId: string, data: PictionaryPeerData) => {
    const conn = connectionsRef.current.get(peerId);
    if (conn && conn.open) {
      conn.send(data);
    }
  }, []);

  const cleanup = useCallback(() => {
    connectionsRef.current.forEach(conn => conn.close());
    connectionsRef.current.clear();
    if (peerRef.current) {
      peerRef.current.destroy();
    }
  }, []);

  return {
    createRoom,
    joinRoom,
    broadcast,
    sendTo,
    cleanup,
    getMyId: () => peerRef.current?.id || null,
  };
};
