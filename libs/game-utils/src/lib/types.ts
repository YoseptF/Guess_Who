export interface Character {
  id: number;
  name: string;
  image: string;
}

export type GamePhase = "menu" | "waiting" | "playing";

export interface PeerData {
  type: "gameStart" | "crossOut" | "ready" | "nameUpdate";
  characters?: Character[];
  secret?: Character;
  crossedOut?: number[];
  name?: string;
}
