import Peer, { DataConnection } from 'peerjs';
import { useCallback, useRef } from 'react';
import { humanId } from 'human-id';
import type { PictionaryPeerData } from '../types';

const ID = humanId({
  separator: '-',
  capitalize: false,
});

export const usePeerConnection = () => {
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());

  const assertPeerData = (data: unknown): data is PictionaryPeerData => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid peer data');
    }
    if (!('type' in data)) {
      throw new Error('Missing type in peer data');
    }
    return true;
  };

  const createPeer = useCallback(() =>
    new Peer(ID, {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
      debug: 3,
    }), []);

  const createRoom = useCallback(
    (
      onRoomCreated: (roomCode: string) => void,
      onConnectionEstablished: (peerId: string) => void,
      onDataReceived: (data: PictionaryPeerData, peerId: string) => void,
      onDisconnect: (peerId: string) => void,
      onError: (error: Error) => void,
    ) => {
      console.debug('Creating room...');

      const peer = createPeer();
      peerRef.current = peer;

      peer.on('open', id => {
        console.debug('Room created with ID:', id);
        onRoomCreated(id);
      });

      peer.on('connection', conn => {
        console.debug('Incoming connection from:', conn.peer);
        connectionsRef.current.set(conn.peer, conn);

        conn.on('data', data => {
          console.debug('Host received data from', conn.peer, ':', data);
          try {
            if (assertPeerData(data)) {
              onDataReceived(data, conn.peer);
            }
          } catch (error) {
            console.error('Error handling peer data:', error);
          }
        });

        conn.on('open', () => {
          console.debug('Connection opened with guest:', conn.peer);
          onConnectionEstablished(conn.peer);
        });

        conn.on('close', () => {
          console.debug('Guest disconnected:', conn.peer);
          connectionsRef.current.delete(conn.peer);
          onDisconnect(conn.peer);
        });

        conn.on('error', err => {
          console.error('Connection error:', err);
          onError(err);
        });
      });

      peer.on('error', err => {
        console.error('Peer error:', err);
        onError(err);
      });
    },
    [createPeer],
  );

  const joinRoom = useCallback(
    (
      roomCode: string,
      onConnected: () => void,
      onDataReceived: (data: PictionaryPeerData) => void,
      onDisconnect: () => void,
      onError: (error: Error) => void,
    ) => {
      console.debug('Joining room:', roomCode);

      const peer = createPeer();
      peerRef.current = peer;

      peer.on('open', id => {
        console.debug('My peer ID:', id);
        console.debug('Connecting to host:', roomCode);

        const conn = peer.connect(roomCode);
        connectionsRef.current.set(roomCode, conn);

        conn.on('data', data => {
          console.debug('Guest received data:', data);
          try {
            if (assertPeerData(data)) {
              onDataReceived(data);
            }
          } catch (error) {
            console.error('Error handling peer data:', error);
          }
        });

        conn.on('open', () => {
          console.debug('Connected to host!');
          onConnected();
        });

        conn.on('error', err => {
          console.error('Connection error:', err);
          onError(err);
        });

        conn.on('close', () => {
          console.debug('Disconnected from host');
          connectionsRef.current.delete(roomCode);
          onDisconnect();
        });
      });

      peer.on('error', err => {
        console.error('Peer error:', err);
        onError(err);
      });
    },
    [createPeer],
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
