export interface Character {
  id: number;
  name: string;
  image: string;
}

export interface GameState {
  characters: Character[];
  mySecret: Character | null;
  crossedOut: Set<number>;
}

export type GamePhase = "menu" | "waiting" | "playing";

export interface PeerData {
  type: "gameStart" | "crossOut" | "ready";
  characters?: Character[];
  secret?: Character;
  crossedOut?: number[];
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
