import { Button } from 'shared-ui';
import CharacterCard from '../ui/CharacterCard';
import type { GameState } from '../../types';
import SecretCharacter from '../ui/SecretCharacter';
import SettingsDropdown from '../ui/SettingsDropdown';
import WinsDropdown from '../ui/WinsDropdown';
import PlayerNames from '../ui/PlayerNames';

interface GameProps {
  gameState: GameState;
  isHost: boolean;
  onCharacterClick: (characterId: number) => void;
  onResetGame: () => void;
  onNameUpdate: (name: string) => void;
  onAddWinToMe: () => void;
  onAddWinToOpponent: () => void;
}

export default function Game({
  gameState,
  isHost,
  onCharacterClick,
  onResetGame,
  onNameUpdate,
  onAddWinToMe,
  onAddWinToOpponent,
}: GameProps) {
  return (
    <div className="app">
      <div className="game-header">
        <h1>Guess Who?</h1>
        {isHost && (
          <div className="game-controls flex items-center gap-3">
            <Button onClick={onResetGame}>Reset Game</Button>
            <SettingsDropdown />
            <WinsDropdown
              myName={gameState.myName}
              opponentName={gameState.opponentName}
              onAddWinToMe={onAddWinToMe}
              onAddWinToOpponent={onAddWinToOpponent}
            />
          </div>
        )}
      </div>

      <PlayerNames
        myName={gameState.myName}
        opponentName={gameState.opponentName}
        myWins={gameState.myWins}
        opponentWins={gameState.opponentWins}
        onNameChange={onNameUpdate}
      />

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
