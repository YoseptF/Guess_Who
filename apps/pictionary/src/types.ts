export type GamePhase = 'menu' | 'lobby' | 'drawing' | 'roundEnd' | 'scoreboard';

export interface Player {
  id: string;
  name: string;
  score: number;
  drawCount: number;
  isReady: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export type DrawingEventType = 'stroke' | 'clear';

export interface DrawingEvent {
  type: DrawingEventType;
  points?: Point[];
  color?: string;
  brushSize?: number;
  timestamp: number;
}

export interface GameState {
  players: Map<string, Player>;
  currentDrawerId: string | null;
  currentWord: string | null;
  phase: GamePhase;
  timeRemaining: number;
  drawings: DrawingEvent[];
  roundWinnerId: string | null;
}

export interface WordProvider {
  name: string;
  fetchWords(count: number): Promise<string[]>;
}

export interface WordProviderSettings {
  [key: string]: boolean;
}

export type PictionaryPeerData =
  | { type: 'playerJoined'; player: Player }
  | { type: 'playerReady'; playerId: string; isReady: boolean }
  | { type: 'playerNameUpdate'; playerId: string; name: string }
  | { type: 'allPlayers'; players: Record<string, Player> }
  | { type: 'startRound'; drawerId: string; word: string; duration: number }
  | { type: 'drawing'; event: DrawingEvent }
  | { type: 'guess'; playerId: string; guess: string }
  | { type: 'correctGuess'; playerId: string; word: string }
  | { type: 'roundTimeout'; word: string }
  | { type: 'updateScores'; scores: Record<string, number> }
  | { type: 'showScoreboard' }
  | { type: 'continueGame' }
  | { type: 'gameEnd' };
