import type { GameState } from "../../types";
import Button from "../ui/Button";
import CharacterCard from "../ui/CharacterCard";
import SecretCharacter from "../ui/SecretCharacter";

interface GameProps {
  gameState: GameState;
  isHost: boolean;
  onCharacterClick: (characterId: number) => void;
  onResetGame: () => void;
}

export default function Game({
  gameState,
  isHost,
  onCharacterClick,
  onResetGame,
}: GameProps) {
  return (
    <div className="app">
      <div className="game-header">
        <h1>Guess Who?</h1>
        {isHost && (
          <Button onClick={onResetGame} variant="reset">
            Reset Game
          </Button>
        )}
      </div>

      {gameState.mySecret && <SecretCharacter character={gameState.mySecret} />}

      <div className="character-grid">
        {gameState.characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isCrossedOut={gameState.crossedOut.has(character.id)}
            onClick={() => onCharacterClick(character.id)}
          />
        ))}
      </div>
    </div>
  );
}
