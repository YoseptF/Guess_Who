import { useRef, useCallback } from "react";
import Peer, { DataConnection } from "peerjs";
import type { PeerData } from "../types";

export const usePeerConnection = () => {
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);

  const assertPeerData: (data: unknown) => asserts data is PeerData = (
    data: unknown,
  ): asserts data is PeerData => {
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid peer data");
    }
    if (!("type" in data)) {
      throw new Error("Missing type in peer data");
    }
  };

  const createPeer = useCallback(() => {
    return new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
      debug: 3,
    });
  }, []);

  const createRoom = useCallback(
    (
      onRoomCreated: (roomCode: string) => void,
      onConnectionEstablished: () => void,
      onDataReceived: (data: PeerData) => void,
      onDisconnect: () => void,
      onError: (error: Error) => void,
    ) => {
      console.debug("Creating room...");

      const peer = createPeer();
      peerRef.current = peer;

      peer.on("open", (id) => {
        console.debug("Room created with ID:", id);
        onRoomCreated(id);
      });

      peer.on("connection", (conn) => {
        console.debug("Incoming connection from:", conn.peer);
        connectionRef.current = conn;

        conn.on("data", (data) => {
          console.debug("Host received data:", data);
          try {
            assertPeerData(data);
            onDataReceived(data);
          } catch (error) {
            console.error("Error handling peer data:", error);
          }
        });

        conn.on("open", () => {
          console.debug("Connection opened with guest");
          onConnectionEstablished();
        });

        conn.on("close", () => {
          console.debug("Guest disconnected");
          onDisconnect();
        });

        conn.on("error", (err) => {
          console.error("Connection error:", err);
          onError(err);
        });
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
        onError(err);
      });
    },
    [createPeer],
  );

  const joinRoom = useCallback(
    (
      roomCode: string,
      onConnected: () => void,
      onDataReceived: (data: PeerData) => void,
      onDisconnect: () => void,
      onError: (error: Error) => void,
    ) => {
      console.debug("Joining room:", roomCode);

      const peer = createPeer();
      peerRef.current = peer;

      peer.on("open", (id) => {
        console.debug("My peer ID:", id);
        console.debug("Connecting to host:", roomCode);

        const conn = peer.connect(roomCode);
        connectionRef.current = conn;

        conn.on("data", (data) => {
          console.debug("Guest received data:", data);
          try {
            assertPeerData(data);
            onDataReceived(data);
          } catch (error) {
            console.error("Error handling peer data:", error);
          }
        });

        conn.on("open", () => {
          console.debug("Connected to host!");
          onConnected();
          conn.send({ type: "ready" });
        });

        conn.on("error", (err) => {
          console.error("Connection error:", err);
          onError(err);
        });

        conn.on("close", () => {
          console.debug("Disconnected from host");
          onDisconnect();
        });
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
        onError(err);
      });
    },
    [createPeer],
  );

  const sendData = useCallback((data: PeerData) => {
    if (connectionRef.current) {
      connectionRef.current.send(data);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
  }, []);

  return {
    createRoom,
    joinRoom,
    sendData,
    cleanup,
  };
};
