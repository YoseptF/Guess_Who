import "./App.css";

import { GamePhase, PeerData } from "./types";
import { useEffect, useState } from "react";

import Menu from "./components/features/Menu";
import Waiting from "./components/features/Waiting";
import Game from "./components/features/Game";
import { usePeerConnection } from "./hooks/usePeerConnection";
import { useGameState } from "./hooks/useGameState";

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isHost, setIsHost] = useState(false);

  const { createRoom, joinRoom, sendData, cleanup } = usePeerConnection();
  const {
    gameState,
    initializeGame,
    setGameAsHost,
    handlePeerData,
    toggleCrossOut,
    resetGameState,
  } = useGameState();

  const handleGameInitialization = async () => {
    const gameData = await initializeGame();
    if (!gameData) return;

    const { hostChars, guestChars, hostSecret, guestSecret } = gameData;

    setGameAsHost(hostChars, guestSecret);

    sendData({
      type: "gameStart",
      characters: guestChars,
      secret: hostSecret,
    });
    console.debug("Game data sent to guest");

    setGamePhase("playing");
  };

  const handleCreateRoom = () => {
    setIsHost(true);
    createRoom(
      (id) => {
        setRoomCode(id);
        setGamePhase("waiting");
      },
      handleGameInitialization,
      (data: PeerData) => {
        const handled = handlePeerData(data);
        if (data.type === "gameStart" && handled) {
          setGamePhase("playing");
        }
      },
      () => {
        alert("Player disconnected");
        setGamePhase("menu");
        resetGameState();
      },
      (error) => {
        console.error("Connection error:", error);
        if (error.message.includes("network")) {
          alert("Network error. Please check your connection.");
        }
      },
    );
  };

  const handleJoinRoom = () => {
    if (!inputCode.trim()) {
      alert("Please enter a room code");
      return;
    }

    setIsHost(false);
    joinRoom(
      inputCode,
      () => setGamePhase("waiting"),
      (data: PeerData) => {
        const handled = handlePeerData(data);
        if (data.type === "gameStart" && handled) {
          setGamePhase("playing");
        }
      },
      () => {
        alert("Disconnected from host");
        setGamePhase("menu");
        resetGameState();
      },
      (error) => {
        console.error("Connection error:", error);
        if (error.message.includes("peer-unavailable")) {
          alert("Room not found. Please check the code.");
        } else if (error.message.includes("network")) {
          alert("Network error. Please check your connection.");
        } else {
          alert("Failed to connect. Check the room code and try again.");
        }
        setGamePhase("menu");
      },
    );
  };

  const handleCharacterClick = (characterId: number) => {
    toggleCrossOut(characterId, sendData);
  };

  const handleResetGame = async () => {
    if (!isHost) return;
    await handleGameInitialization();
  };

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (gamePhase === "menu") {
    return (
      <Menu
        inputCode={inputCode}
        onInputCodeChange={setInputCode}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
    );
  }

  if (gamePhase === "waiting") {
    return <Waiting isHost={isHost} roomCode={roomCode} />;
  }

  return (
    <Game
      gameState={gameState}
      isHost={isHost}
      onCharacterClick={handleCharacterClick}
      onResetGame={handleResetGame}
    />
  );
}

export default App;
