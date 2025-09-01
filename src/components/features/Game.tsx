import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/Button";
import CharacterCard from "../ui/CharacterCard";
import type { GameState } from "../../types";
import SecretCharacter from "../ui/SecretCharacter";
import { Settings } from "lucide-react";
import { characterProviders } from "../../providers";
import { useSettings } from "../../contexts/SettingsContext";

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
  const { characterSources, updateCharacterSource } = useSettings();

  return (
    <div className="app">
      <div className="game-header">
        <h1>Guess Who?</h1>
        {isHost && (
          <div className="game-controls flex items-center gap-3">
            <Button onClick={onResetGame}>Reset Game</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button title="Game Settings">
                  <Settings size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Character Sources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {characterProviders.map((provider) => (
                  <DropdownMenuCheckboxItem
                    key={provider.name}
                    checked={characterSources[provider.name] || false}
                    onCheckedChange={(checked) =>
                      updateCharacterSource(provider.name, checked)
                    }
                    onSelect={(event) => event.preventDefault()}
                  >
                    {provider.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
