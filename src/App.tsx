import type { GamePhase, PeerData } from "./types";
import { useEffect, useState } from "react";

import Menu from "./components/features/Menu";
import Waiting from "./components/features/Waiting";
import Game from "./components/features/Game";
import { usePeerConnection } from "./hooks/usePeerConnection";
import { useGameState } from "./hooks/useGameState";
import { getRoomCodeFromUrl } from "./lib/utils";
import {
  createGameInitializationHandler,
  createRoomCreationHandler,
  createRoomJoiningHandler,
  createCharacterClickHandler,
  createGameResetHandler,
} from "./lib/gameHandlers";

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const roomCodeFromUrl = getRoomCodeFromUrl();
    if (roomCodeFromUrl) {
      setInputCode(roomCodeFromUrl);
    }
  }, []);

  const { createRoom, joinRoom, sendData, cleanup } = usePeerConnection();
  const {
    gameState,
    initializeGame,
    setGameAsHost,
    handlePeerData,
    toggleCrossOut,
    resetGameState,
  } = useGameState();

  const gameHandlers = {
    sendData,
    setGameAsHost,
    initializeGame,
    setGamePhase,
    handlePeerData,
    resetGameState,
    toggleCrossOut,
    setIsHost,
    setRoomCode,
    createRoom,
    joinRoom,
  };

  const handleGameInitialization =
    createGameInitializationHandler(gameHandlers);
  const handleCreateRoom = createRoomCreationHandler(gameHandlers);
  const handleJoinRoom = () => {
    setIsJoining(true);
    const joinHandler = createRoomJoiningHandler({
      ...gameHandlers,
      setGamePhase: (phase: GamePhase) => {
        setIsJoining(false);
        setGamePhase(phase);
      },
    });

    try {
      joinHandler(inputCode);
    } catch (error) {
      setIsJoining(false);
      throw error;
    }
  };
  const handleCharacterClick = createCharacterClickHandler(gameHandlers);
  const handleResetGame = createGameResetHandler(
    isHost,
    handleGameInitialization,
  );

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
        isJoining={isJoining}
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
