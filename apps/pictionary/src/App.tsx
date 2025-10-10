import { useEffect, useState, useCallback, useRef } from 'react';
import type { GamePhase, Player } from './types';
import Menu from './components/features/Menu';
import Lobby from './components/features/Lobby';
import DrawingView from './components/features/DrawingView';
import GuessingView from './components/features/GuessingView';
import RoundEnd from './components/features/RoundEnd';
import ScoreboardView from './components/features/ScoreboardView';
import { usePeerConnection } from './hooks/usePeerConnection';
import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';
import { useWordProviders } from './hooks/useWordProviders';
import { useSettings } from './contexts/SettingsContext';
import { getRoomCodeFromUrl } from 'game-utils';

const App = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [myId, setMyId] = useState('');
  const playersRef = useRef<Map<string, Player>>(new Map());

  const { timerDuration, getEnabledProviders } = useSettings();
  const { fetchWord } = useWordProviders();

  const {
    gameState,
    addPlayer,
    removePlayer,
    setPlayerReady,
    updatePlayerName,
    startRound,
    addDrawingEvent,
    endRound,
    showScoreboard,
    updateScores,
    incrementDrawCount,
    selectNextDrawer,
    handlePeerData,
  } = useGameState();

  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
    playersRef.current = gameState.players;
  }, [gameState]);

  const { createRoom, joinRoom, broadcast, sendTo, cleanup, getMyId } =
    usePeerConnection();

  const handleTimeout = useCallback(() => {
    if (!isHost) return;

    const currentWord = gameStateRef.current.currentWord || '';
    broadcast({ type: 'roundTimeout', word: currentWord });
    endRound(null);
    setGamePhase('roundEnd');

    setTimeout(() => {
      broadcast({ type: 'showScoreboard' });
      showScoreboard();
      setGamePhase('scoreboard');
    }, 3000);
  }, [isHost, broadcast, endRound, showScoreboard]);

  const {
    timeRemaining,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useTimer(timerDuration, handleTimeout);

  const processGuess = useCallback((playerId: string, guess: string) => {
    const currentState = gameStateRef.current;

    if (
      currentState.currentWord &&
      guess === currentState.currentWord.toLowerCase()
    ) {
      stopTimer();

      const newScores = Object.fromEntries(
        Array.from(currentState.players.entries()).map(([id, p]) => {
          let score = p.score;
          if (id === playerId) score += 10;
          if (id === currentState.currentDrawerId) score += 5;
          return [id, score];
        }),
      );

      broadcast({ type: 'updateScores', scores: newScores });
      broadcast({
        type: 'correctGuess',
        playerId,
        word: currentState.currentWord,
      });

      updateScores(newScores);
      endRound(playerId);
      setGamePhase('roundEnd');

      setTimeout(() => {
        broadcast({ type: 'showScoreboard' });
        showScoreboard();
        setGamePhase('scoreboard');
      }, 3000);
    }
  }, [stopTimer, broadcast, updateScores, endRound, showScoreboard]);

  useEffect(() => {
    const code = getRoomCodeFromUrl();
    if (code && typeof code === 'string') {
      setInputCode(code);
    }
  }, []);

  const handleCreateRoom = useCallback(() => {
    createRoom(
      (code) => {
        setRoomCode(code);
        setIsHost(true);
        const id = getMyId();
        if (id) {
          setMyId(id);
          addPlayer({
            id,
            name: 'Host',
            score: 0,
            drawCount: 0,
            isReady: true,
          });
        }
        setGamePhase('lobby');
      },
      (peerId) => {
        const playersToSend = Object.fromEntries(
          Array.from(playersRef.current.entries()).map(([id, p]) => [id, p]),
        );
        sendTo(peerId, {
          type: 'allPlayers',
          players: playersToSend,
        });
      },
      (data, peerId) => {
        switch (data.type) {
          case 'playerJoined':
            addPlayer(data.player);
            broadcast(data);
            break;
          case 'playerReady':
            setPlayerReady(data.playerId, data.isReady);
            broadcast(data);
            break;
          case 'drawing':
            addDrawingEvent(data.event);
            broadcast(data);
            break;
          case 'guess':
            processGuess(data.playerId, data.guess);
            break;
          default:
            handlePeerData(data, peerId);
            break;
        }
      },
      (peerId) => {
        removePlayer(peerId);
      },
      (err) => {
        console.error('Connection error:', err);
      },
    );
  }, [
    createRoom,
    getMyId,
    addPlayer,
    sendTo,
    broadcast,
    setPlayerReady,
    addDrawingEvent,
    processGuess,
    handlePeerData,
    removePlayer,
  ]);

  const handleJoinRoom = useCallback(() => {
    setIsJoining(true);
    joinRoom(
      inputCode,
      () => {
        setIsJoining(false);
        setRoomCode(inputCode);
        const id = getMyId();
        if (id) {
          setMyId(id);
        }
        setGamePhase('lobby');
      },
      (data) => {
        if (data.type === 'allPlayers') {
          const id = getMyId();
          if (id) {
            const newPlayer: Player = {
              id,
              name: `Player ${id.substring(0, 4)}`,
              score: 0,
              drawCount: 0,
              isReady: false,
            };

            const allPlayers = new Map(Object.entries(data.players));
            allPlayers.set(id, newPlayer);

            handlePeerData({
              type: 'allPlayers',
              players: Object.fromEntries(allPlayers.entries()),
            });

            broadcast({ type: 'playerJoined', player: newPlayer });
          }
        } else {
          handlePeerData(data);
        }

        switch (data.type) {
          case 'startRound':
            setGamePhase('drawing');
            startTimer();
            break;
          case 'drawing':
            addDrawingEvent(data.event);
            break;
          case 'updateScores':
            updateScores(data.scores);
            break;
          case 'correctGuess':
          case 'roundTimeout':
            setGamePhase('roundEnd');
            stopTimer();
            break;
          case 'showScoreboard':
            setGamePhase('scoreboard');
            break;
          case 'continueGame':
            setGamePhase('lobby');
            break;
          case 'gameEnd':
            setGamePhase('menu');
            break;
        }
      },
      () => {
        setGamePhase('menu');
      },
      (err) => {
        console.error('Join error:', err);
        setIsJoining(false);
      },
    );
  }, [
    inputCode,
    joinRoom,
    getMyId,
    addPlayer,
    broadcast,
    handlePeerData,
    startTimer,
    addDrawingEvent,
    updateScores,
    stopTimer,
  ]);

  const handleReady = useCallback(() => {
    const player = gameState.players.get(myId);
    if (!player) return;

    const newReadyState = !player.isReady;
    setPlayerReady(myId, newReadyState);
    broadcast({ type: 'playerReady', playerId: myId, isReady: newReadyState });
  }, [gameState.players, myId, setPlayerReady, broadcast]);

  const handleStartGame = useCallback(async () => {
    const drawerId = selectNextDrawer();
    if (!drawerId) return;

    incrementDrawCount(drawerId);

    const enabledProviders = getEnabledProviders();
    const word = await fetchWord(enabledProviders);

    broadcast({
      type: 'startRound',
      drawerId,
      word,
      duration: timerDuration,
    });

    startRound(drawerId, word, timerDuration);
    resetTimer(timerDuration);
    setGamePhase('drawing');
    startTimer();
  }, [
    selectNextDrawer,
    incrementDrawCount,
    getEnabledProviders,
    fetchWord,
    broadcast,
    startRound,
    timerDuration,
    resetTimer,
    startTimer,
  ]);

  const handleDrawingEvent = useCallback(
    (event: (typeof gameState.drawings)[number]) => {
      addDrawingEvent(event);
      broadcast({ type: 'drawing', event });
    },
    [addDrawingEvent, broadcast],
  );

  const handleGuess = useCallback(
    (guess: string) => {
      broadcast({ type: 'guess', playerId: myId, guess });

      if (isHost) {
        processGuess(myId, guess);
      }
    },
    [broadcast, myId, isHost, processGuess],
  );

  const handleContinue = useCallback(() => {
    broadcast({ type: 'continueGame' });
    setGamePhase('lobby');
    handleStartGame();
  }, [broadcast, handleStartGame]);

  const handleFinish = useCallback(() => {
    broadcast({ type: 'gameEnd' });
    setGamePhase('menu');
  }, [broadcast]);

  useEffect(() => cleanup, [cleanup]);

  if (gamePhase === 'menu') {
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

  if (gamePhase === 'lobby') {
    return (
      <Lobby
        isHost={isHost}
        roomCode={roomCode}
        players={Array.from(gameState.players.values())}
        myId={myId}
        onReady={handleReady}
        onStartGame={handleStartGame}
        isReady={gameState.players.get(myId)?.isReady || false}
      />
    );
  }

  if (gamePhase === 'drawing') {
    const isDrawer = gameState.currentDrawerId === myId;

    if (isDrawer && gameState.currentWord) {
      return (
        <DrawingView
          word={gameState.currentWord}
          timeRemaining={timeRemaining}
          onDrawingEvent={handleDrawingEvent}
        />
      );
    }

    return (
      <GuessingView
        timeRemaining={timeRemaining}
        drawings={gameState.drawings}
        onGuess={handleGuess}
      />
    );
  }

  if (gamePhase === 'roundEnd') {
    const winner = gameState.roundWinnerId
      ? gameState.players.get(gameState.roundWinnerId) || null
      : null;

    return (
      <RoundEnd
        isSuccess={!!winner}
        word={gameState.currentWord || ''}
        winner={winner}
        drawings={gameState.drawings}
      />
    );
  }

  if (gamePhase === 'scoreboard') {
    return (
      <ScoreboardView
        players={Array.from(gameState.players.values())}
        isHost={isHost}
        onContinue={handleContinue}
        onFinish={handleFinish}
      />
    );
  }

  return null;
};

export default App;
