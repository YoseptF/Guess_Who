import { useState, useCallback } from 'react';
import type { GameState, Player, DrawingEvent, PictionaryPeerData } from '../types';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: new Map(),
    currentDrawerId: null,
    currentWord: null,
    phase: 'menu',
    timeRemaining: 120,
    drawings: [],
    roundWinnerId: null,
  });

  const addPlayer = useCallback((player: Player) => {
    setGameState(prev => {
      const newPlayers = new Map(prev.players);
      newPlayers.set(player.id, player);
      return { ...prev, players: newPlayers };
    });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setGameState(prev => {
      const newPlayers = new Map(prev.players);
      newPlayers.delete(playerId);
      return { ...prev, players: newPlayers };
    });
  }, []);

  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    setGameState(prev => {
      const newPlayers = new Map(prev.players);
      const player = newPlayers.get(playerId);
      if (player) {
        newPlayers.set(playerId, { ...player, ...updates });
      }
      return { ...prev, players: newPlayers };
    });
  }, []);

  const setPlayerReady = useCallback((playerId: string, isReady: boolean) => {
    updatePlayer(playerId, { isReady });
  }, [updatePlayer]);

  const updatePlayerName = useCallback((playerId: string, name: string) => {
    updatePlayer(playerId, { name });
  }, [updatePlayer]);

  const startRound = useCallback((drawerId: string, word: string, duration: number) => {
    setGameState(prev => ({
      ...prev,
      currentDrawerId: drawerId,
      currentWord: word,
      phase: 'drawing',
      timeRemaining: duration,
      drawings: [],
      roundWinnerId: null,
    }));
  }, []);

  const addDrawingEvent = useCallback((event: DrawingEvent) => {
    setGameState(prev => ({
      ...prev,
      drawings: [...prev.drawings, event],
    }));
  }, []);

  const clearDrawings = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      drawings: [],
    }));
  }, []);

  const endRound = useCallback((winnerId: string | null) => {
    setGameState(prev => ({
      ...prev,
      phase: 'roundEnd',
      roundWinnerId: winnerId,
    }));
  }, []);

  const showScoreboard = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'scoreboard',
    }));
  }, []);

  const updateScores = useCallback((scores: Record<string, number>) => {
    setGameState(prev => {
      const newPlayers = new Map(prev.players);
      Object.entries(scores).forEach(([playerId, score]) => {
        const player = newPlayers.get(playerId);
        if (player) {
          newPlayers.set(playerId, { ...player, score });
        }
      });
      return { ...prev, players: newPlayers };
    });
  }, []);

  const incrementDrawCount = useCallback((playerId: string) => {
    updatePlayer(playerId, {
      drawCount: (gameState.players.get(playerId)?.drawCount || 0) + 1,
    });
  }, [updatePlayer, gameState.players]);

  const selectNextDrawer = useCallback((): string | null => {
    const players = Array.from(gameState.players.values());
    if (players.length === 0) return null;

    const maxDrawCount = Math.max(...players.map(p => p.drawCount));
    const weights = players.map(p => maxDrawCount - p.drawCount + 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let random = Math.random() * totalWeight;
    for (let i = 0; i < players.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return players[i].id;
      }
    }

    return players[0].id;
  }, [gameState.players]);

  const handlePeerData = useCallback((data: PictionaryPeerData, peerId?: string): boolean => {
    console.debug('Processing peer data:', data.type);

    switch (data.type) {
      case 'playerJoined':
        addPlayer(data.player);
        return true;

      case 'playerReady':
        setPlayerReady(data.playerId, data.isReady);
        return true;

      case 'playerNameUpdate':
        updatePlayerName(data.playerId, data.name);
        return true;

      case 'allPlayers':
        setGameState(prev => ({
          ...prev,
          players: new Map(Object.entries(data.players)),
        }));
        return true;

      case 'startRound':
        startRound(data.drawerId, data.word, data.duration);
        return true;

      case 'drawing':
        addDrawingEvent(data.event);
        return true;

      case 'correctGuess':
        endRound(data.playerId);
        return true;

      case 'roundTimeout':
        endRound(null);
        return true;

      case 'updateScores':
        updateScores(data.scores);
        return true;

      case 'showScoreboard':
        showScoreboard();
        return true;

      case 'continueGame':
        setGameState(prev => ({ ...prev, phase: 'lobby' }));
        return true;

      case 'gameEnd':
        setGameState(prev => ({ ...prev, phase: 'menu' }));
        return true;

      default:
        return false;
    }
  }, [addPlayer, setPlayerReady, updatePlayerName, startRound, addDrawingEvent, endRound, updateScores, showScoreboard]);

  const setPhase = useCallback((phase: GameState['phase']) => {
    setGameState(prev => ({ ...prev, phase }));
  }, []);

  return {
    gameState,
    addPlayer,
    removePlayer,
    updatePlayer,
    setPlayerReady,
    updatePlayerName,
    startRound,
    addDrawingEvent,
    clearDrawings,
    endRound,
    showScoreboard,
    updateScores,
    incrementDrawCount,
    selectNextDrawer,
    handlePeerData,
    setPhase,
  };
};
