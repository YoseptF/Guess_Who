import { useState } from "react";
import { Settings } from "lucide-react";
import type { GameState } from "../../types";
import Button from "../ui/Button";
import CharacterCard from "../ui/CharacterCard";
import SecretCharacter from "../ui/SecretCharacter";
import CharacterSettings from "../ui/CharacterSettings";

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
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="app">
      <div className="game-header">
        <h1>Guess Who?</h1>
        {isHost && (
          <div className="game-controls">
            <Button onClick={onResetGame} variant="reset">
              Reset Game
            </Button>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="secondary"
              title="Game Settings"
            >
              <Settings size={16} />
            </Button>
          </div>
        )}
      </div>

      {isHost && showSettings && (
        <div className="settings-panel">
          <CharacterSettings />
        </div>
      )}

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
