import type { Character, GamePhase, PeerData } from 'game-utils';

export type { Character, GamePhase, PeerData };

export interface GameState {
  characters: Character[];
  mySecret: Character | null;
  myCrossedOut: Set<number>;
  opponentCrossedOut: Set<number>;
  myName: string;
  opponentName: string;
  myWins: number;
  opponentWins: number;
}

export interface SuperheroApiCharacter {
  id: number;
  name: string;
  images: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
}

export interface CharacterProvider {
  name: string;
  fetchCharacters(): Promise<Character[]>;
}

export interface CharacterSourceSettings {
  [key: string]: boolean;
}
