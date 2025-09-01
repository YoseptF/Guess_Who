import { Settings } from "lucide-react";
import type { GameState } from "../../types";
import Button from "../ui/Button";
import CharacterCard from "../ui/CharacterCard";
import SecretCharacter from "../ui/SecretCharacter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { useSettings } from "../../contexts/SettingsContext";
import { characterProviders } from "../../providers";

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
          <div className="game-controls">
            <Button onClick={onResetGame} variant="reset">
              Reset Game
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" title="Game Settings">
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
