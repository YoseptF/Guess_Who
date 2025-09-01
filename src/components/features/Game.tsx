import { Button } from "../ui/Button";
import CharacterCard from "../ui/CharacterCard";
import type { GameState } from "../../types";
import SecretCharacter from "../ui/SecretCharacter";
import SettingsDropdown from "../ui/SettingsDropdown";
import { useState } from "react";

interface GameProps {
  gameState: GameState;
  isHost: boolean;
  onCharacterClick: (characterId: number) => void;
  onResetGame: () => void;
  onNameUpdate: (name: string) => void;
}

interface EditablePlayerNameProps {
  name: string;
  onNameChange: (name: string) => void;
}

function EditablePlayerName({ name, onNameChange }: EditablePlayerNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSave = () => {
    onNameChange(tempName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
        />
        <Button
          onClick={handleSave}
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-green-600"
          title="Save"
        >
          ✓
        </Button>
        <Button
          onClick={handleCancel}
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-red-600"
          title="Cancel"
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{name}</span>
      <Button
        onClick={() => setIsEditing(true)}
        variant="ghost"
        size="sm"
        className="p-1 h-auto"
        title="Edit name"
      >
        ✏️
      </Button>
    </div>
  );
}

export default function Game({
  gameState,
  isHost,
  onCharacterClick,
  onResetGame,
  onNameUpdate,
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

      <div className="player-names flex justify-between items-center mb-4 px-4">
        <div className="my-name flex items-center gap-2">
          <span className="text-sm text-gray-600">You: </span>
          <EditablePlayerName
            name={gameState.myName}
            onNameChange={onNameUpdate}
          />
        </div>
        <div className="opponent-name">
          <span className="text-sm text-gray-600">Opponent: </span>
          <span className="font-medium">{gameState.opponentName}</span>
        </div>
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
