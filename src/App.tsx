import { useState, useEffect, useRef } from "react";
import Peer, { DataConnection } from "peerjs";
import {
  Character,
  GameState,
  GamePhase,
  PeerData,
  SuperheroApiCharacter,
} from "./types";
import Button from "./components/Button";
import CharacterCard from "./components/CharacterCard";
import SecretCharacter from "./components/SecretCharacter";
import "./App.css";

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
        "https://akabab.github.io/superhero-api/api/all.json",
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
      console.debug("Error fetching characters:", error);
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
    const characters = await fetchCharacters();
    if (characters.length === 0) return;

    const hostSecret =
      characters[Math.floor(Math.random() * characters.length)];
    const guestSecret = characters.filter((c) => c.id !== hostSecret.id)[
      Math.floor(Math.random() * (characters.length - 1))
    ];

    const hostChars = shuffleArray(characters);
    const guestChars = shuffleArray(characters);

    if (isHost) {
      setGameState({
        characters: hostChars,
        mySecret: guestSecret,
        crossedOut: new Set(),
      });

      if (connectionRef.current) {
        connectionRef.current.send({
          type: "gameStart",
          characters: guestChars,
          secret: hostSecret,
        });
      }
    }

    setGamePhase("playing");
  };

  const createRoom = async () => {
    const peer = new Peer();
    peerRef.current = peer;
    setIsHost(true);

    peer.on("open", (id) => {
      setRoomCode(id);
      setGamePhase("waiting");
    });

    peer.on("connection", (conn) => {
      connectionRef.current = conn;
      conn.on("data", handlePeerData);
      initializeGame();
    });
  };

  const joinRoom = () => {
    if (!inputCode.trim()) return;

    const peer = new Peer();
    peerRef.current = peer;
    setIsHost(false);

    peer.on("open", () => {
      const conn = peer.connect(inputCode);
      connectionRef.current = conn;

      conn.on("data", handlePeerData);
      conn.on("open", () => {
        setGamePhase("waiting");
      });
    });
  };

  const handlePeerData = (data: PeerData) => {
    if (data.type === "gameStart" && data.characters && data.secret) {
      setGameState({
        characters: data.characters,
        mySecret: data.secret,
        crossedOut: new Set(),
      });
      setGamePhase("playing");
    } else if (data.type === "crossOut" && data.crossedOut) {
      setGameState((prev) => ({
        ...prev,
        crossedOut: new Set(data.crossedOut),
      }));
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

    const characters = await fetchCharacters();
    if (characters.length === 0) return;

    const hostSecret =
      characters[Math.floor(Math.random() * characters.length)];
    const guestSecret = characters.filter((c) => c.id !== hostSecret.id)[
      Math.floor(Math.random() * (characters.length - 1))
    ];

    const hostChars = shuffleArray(characters);
    const guestChars = shuffleArray(characters);

    setGameState({
      characters: hostChars,
      mySecret: guestSecret,
      crossedOut: new Set(),
    });

    if (connectionRef.current) {
      connectionRef.current.send({
        type: "gameStart",
        characters: guestChars,
        secret: hostSecret,
      });
    }
  };

  useEffect(() => {
    return () => {
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
            <p>Connecting...</p>
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
