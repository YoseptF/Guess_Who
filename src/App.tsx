import "./App.css";

import {
  Character,
  GamePhase,
  GameState,
  PeerData,
  SuperheroApiCharacter,
} from "./types";
import Peer, { DataConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";

import Button from "./components/Button";
import CharacterCard from "./components/CharacterCard";
import SecretCharacter from "./components/SecretCharacter";

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    characters: [],
    mySecret: null,
    crossedOut: new Set(),
  });

  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);

  const fetchCharacters = async (): Promise<Character[]> => {
    try {
      const response = await fetch(
        "https://akabab.github.io/superhero-api/api/all.json"
      );
      const data: SuperheroApiCharacter[] = await response.json();

      const selected = data
        .filter((char) => char.images?.sm)
        .sort(() => Math.random() - 0.5)
        .slice(0, 24)
        .map((char, index) => ({
          id: index,
          name: char.name,
          image: char.images.sm!,
        }));

      return selected;
    } catch (error) {
      console.error("Error fetching characters:", error);
      return [];
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = async () => {
    console.log("Initializing game...");
    const characters = await fetchCharacters();
    if (characters.length === 0) return;

    const hostSecret =
      characters[Math.floor(Math.random() * characters.length)];
    const guestSecretOptions = characters.filter((c) => c.id !== hostSecret.id);
    const guestSecret =
      guestSecretOptions[Math.floor(Math.random() * guestSecretOptions.length)];

    const hostChars = shuffleArray(characters);
    const guestChars = shuffleArray(characters);

    // Set host's game state
    setGameState({
      characters: hostChars,
      mySecret: guestSecret,
      crossedOut: new Set(),
    });

    // Send guest's game data
    if (connectionRef.current) {
      connectionRef.current.send({
        type: "gameStart",
        characters: guestChars,
        secret: hostSecret,
      });
      console.log("Game data sent to guest");
    }

    setGamePhase("playing");
  };

  const createRoom = () => {
    console.log("Creating room...");

    // Create peer with explicit config
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
      debug: 3, // Enable full debug logging
    });
    peerRef.current = peer;
    setIsHost(true);

    peer.on("open", (id) => {
      console.log("Room created with ID:", id);
      setRoomCode(id);
      setGamePhase("waiting");
    });

    peer.on("connection", (conn) => {
      console.log("Incoming connection from:", conn.peer);
      connectionRef.current = conn;

      // Set up data handler BEFORE open event
      conn.on("data", (data) => {
        console.log("Host received data:", data);
        handlePeerData(data);
      });

      conn.on("open", () => {
        console.log("Connection opened with guest");
        // Initialize game when connection is ready
        initializeGame();
      });

      conn.on("close", () => {
        console.log("Guest disconnected");
        alert("Player disconnected");
        setGamePhase("menu");
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
      });
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
      if (err.type === "network") {
        alert("Network error. Please check your connection.");
      }
    });
  };

  const joinRoom = () => {
    if (!inputCode.trim()) {
      alert("Please enter a room code");
      return;
    }

    console.log("Joining room:", inputCode);

    const peer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
      debug: 3, // Enable full debug logging
    });
    peerRef.current = peer;
    setIsHost(false);

    peer.on("open", (id) => {
      console.log("My peer ID:", id);
      console.log("Connecting to host:", inputCode);

      const conn = peer.connect(inputCode);
      connectionRef.current = conn;

      // Set up data handler BEFORE open event
      conn.on("data", (data) => {
        console.log("Guest received data:", data);
        handlePeerData(data);
      });

      conn.on("open", () => {
        console.log("Connected to host!");
        setGamePhase("waiting");
        conn.send({ type: "ready" }); // Send ready signal
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
        alert("Failed to connect. Check the room code and try again.");
        setGamePhase("menu");
      });

      conn.on("close", () => {
        console.log("Disconnected from host");
        alert("Disconnected from host");
        setGamePhase("menu");
      });
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
      if (err.type === "peer-unavailable") {
        alert("Room not found. Please check the code.");
        setGamePhase("menu");
      } else if (err.type === "network") {
        alert("Network error. Please check your connection.");
        setGamePhase("menu");
      }
    });
  };

  function assertPeerData(data: unknown): asserts data is PeerData {
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid peer data");
    }
    if (!("type" in data)) {
      throw new Error("Missing type in peer data");
    }
  }

  const handlePeerData = (data: unknown) => {
    try {
      assertPeerData(data);
      console.log("Processing data of type:", data.type);

      if (data.type === "gameStart" && data.characters && data.secret) {
        console.log("Starting game with", data.characters.length, "characters");
        setGameState({
          characters: data.characters,
          mySecret: data.secret,
          crossedOut: new Set(),
        });
        setGamePhase("playing");
      } else if (data.type === "crossOut" && data.crossedOut) {
        console.log("Updating crossed out characters");
        setGameState((prev) => ({
          ...prev,
          crossedOut: new Set(data.crossedOut),
        }));
      } else if (data.type === "ready") {
        console.log("Guest is ready");
      }
    } catch (error) {
      console.error("Error handling peer data:", error);
    }
  };

  const toggleCrossOut = (characterId: number) => {
    setGameState((prev) => {
      const newCrossedOut = new Set(prev.crossedOut);
      if (newCrossedOut.has(characterId)) {
        newCrossedOut.delete(characterId);
      } else {
        newCrossedOut.add(characterId);
      }

      if (connectionRef.current) {
        connectionRef.current.send({
          type: "crossOut",
          crossedOut: Array.from(newCrossedOut),
        });
      }

      return {
        ...prev,
        crossedOut: newCrossedOut,
      };
    });
  };

  const resetGame = async () => {
    if (!isHost) return;
    await initializeGame();
  };

  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  if (gamePhase === "menu") {
    return (
      <div className="app">
        <h1>Guess Who?</h1>
        <div className="menu">
          <Button onClick={createRoom} variant="create">
            Create Room
          </Button>
          <div className="join-section">
            <input
              type="text"
              placeholder="Enter room code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && joinRoom()}
              className="code-input"
            />
            <Button onClick={joinRoom} variant="join">
              Join Room
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === "waiting") {
    return (
      <div className="app">
        <h1>Guess Who?</h1>
        <div className="waiting">
          {isHost ? (
            <>
              <h2>Share this code with your friend:</h2>
              <div className="room-code">{roomCode}</div>
              <p>Waiting for player to join...</p>
            </>
          ) : (
            <p>Connected! Waiting for game to start...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-header">
        <h1>Guess Who?</h1>
        {isHost && (
          <Button onClick={resetGame} variant="reset">
            Reset Game
          </Button>
        )}
      </div>

      {gameState.mySecret && <SecretCharacter character={gameState.mySecret} />}

      <div className="character-grid">
        {gameState.characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isCrossedOut={gameState.crossedOut.has(character.id)}
            onClick={() => toggleCrossOut(character.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
