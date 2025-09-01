import { Button } from "../ui/Button";
import CharacterCard from "../ui/CharacterCard";
import type { GameState } from "../../types";
import SecretCharacter from "../ui/SecretCharacter";
import SettingsDropdown from "../ui/SettingsDropdown";

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
          <div className="game-controls flex items-center gap-3">
            <Button onClick={onResetGame}>Reset Game</Button>
            <SettingsDropdown />
          </div>
        )}
      </div>

      {gameState.mySecret && <SecretCharacter character={gameState.mySecret} />}

      <div className="character-grid">
        {gameState.characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isCrossedOut={gameState.myCrossedOut.has(character.id)}
            onClick={() => onCharacterClick(character.id)}
          />
        ))}
      </div>
    </div>
  );
}
