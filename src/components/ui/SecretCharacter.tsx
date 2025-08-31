import { Character } from "../types";
import "./SecretCharacter.css";

interface SecretCharacterProps {
  character: Character;
}

export default function SecretCharacter({ character }: SecretCharacterProps) {
  return (
    <div className="secret-character">
      <h2>Your Secret Character:</h2>
      <div className="secret-card">
        <img src={character.image} alt={character.name} />
        <h3>{character.name}</h3>
      </div>
    </div>
  );
}
