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

  useEffect(() => {
    playersRef.current = gameState.players;
  }, [gameState.players]);

  const { createRoom, joinRoom, broadcast, sendTo, cleanup, getMyId } =
    usePeerConnection();

  const handleTimeout = useCallback(() => {
    if (!isHost) return;

    broadcast({ type: 'roundTimeout', word: gameState.currentWord || '' });
    endRound(null);
    setGamePhase('roundEnd');

    setTimeout(() => {
      broadcast({ type: 'showScoreboard' });
      showScoreboard();
    }, 3000);
  }, [isHost, broadcast, gameState.currentWord, endRound, showScoreboard]);

  const {
    timeRemaining,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useTimer(timerDuration, handleTimeout);

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
        if (data.type === 'playerJoined') {
          addPlayer(data.player);
          broadcast(data);
        } else if (data.type === 'playerReady') {
          setPlayerReady(data.playerId, data.isReady);
          broadcast(data);
        } else if (data.type === 'guess') {
          if (
            gameState.currentWord &&
            data.guess === gameState.currentWord.toLowerCase()
          ) {
            stopTimer();

            const newScores = Object.fromEntries(
              Array.from(gameState.players.entries()).map(([id, p]) => {
                let score = p.score;
                if (id === data.playerId) score += 10;
                if (id === gameState.currentDrawerId) score += 5;
                return [id, score];
              }),
            );

            broadcast({ type: 'updateScores', scores: newScores });
            broadcast({
              type: 'correctGuess',
              playerId: data.playerId,
              word: gameState.currentWord,
            });

            updateScores(newScores);
            endRound(data.playerId);
            setGamePhase('roundEnd');

            setTimeout(() => {
              broadcast({ type: 'showScoreboard' });
              showScoreboard();
            }, 3000);
          }
        } else {
          handlePeerData(data, peerId);
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
    gameState.currentWord,
    gameState.currentDrawerId,
    broadcast,
    setPlayerReady,
    stopTimer,
    updateScores,
    endRound,
    showScoreboard,
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

        if (data.type === 'startRound') {
          setGamePhase('drawing');
          startTimer();
        } else if (data.type === 'drawing') {
          addDrawingEvent(data.event);
        } else if (
          data.type === 'correctGuess' ||
          data.type === 'roundTimeout'
        ) {
          setGamePhase('roundEnd');
          stopTimer();
        } else if (data.type === 'showScoreboard') {
          setGamePhase('scoreboard');
        } else if (data.type === 'continueGame') {
          setGamePhase('lobby');
        } else if (data.type === 'gameEnd') {
          setGamePhase('menu');
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
    },
    [broadcast, myId],
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
