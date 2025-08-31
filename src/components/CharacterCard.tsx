import { Character } from "../types";
import "./CharacterCard.css";

interface CharacterCardProps {
  character: Character;
  isCrossedOut: boolean;
  onClick: () => void;
}

export default function CharacterCard({
  character,
  isCrossedOut,
  onClick,
}: CharacterCardProps) {
  return (
    <div
      className={`character-card ${isCrossedOut ? "crossed-out" : ""}`}
      onClick={onClick}
    >
      <img src={character.image} alt={character.name} />
      <h4>{character.name}</h4>
      {isCrossedOut && <div className="cross-out">✖</div>}
    </div>
  );
}
