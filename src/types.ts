export interface Character {
  id: number;
  name: string;
  image: string;
}

export interface GameState {
  characters: Character[];
  mySecret: Character | null;
  myCrossedOut: Set<number>;
  opponentCrossedOut: Set<number>;
  myName: string;
  opponentName: string;
}

export type GamePhase = "menu" | "waiting" | "playing";

export interface PeerData {
  type: "gameStart" | "crossOut" | "ready" | "nameUpdate";
  characters?: Character[];
  secret?: Character;
  crossedOut?: number[];
  name?: string;
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
