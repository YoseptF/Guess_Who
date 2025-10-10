import { Button, Scoreboard as ScoreboardComponent } from 'shared-ui';
import type { Player } from '../../types';

interface ScoreboardViewProps {
  players: Player[];
  isHost: boolean;
  onContinue: () => void;
  onFinish: () => void;
}

const ScoreboardView = ({
  players,
  isHost,
  onContinue,
  onFinish,
}: ScoreboardViewProps) => {
  const playersForScoreboard = Array.from(players).map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
  }));

  return (
    <div className="app">
      <h1>🎨 Pictionary</h1>
      <div className="flex flex-col items-center gap-8 mt-8">
        <ScoreboardComponent players={playersForScoreboard} className="w-full max-w-2xl" />

        {isHost && (
          <div className="flex gap-4">
            <Button onClick={onContinue} size="lg">
              Continue Playing
            </Button>
            <Button onClick={onFinish} variant="outline" size="lg">
              End Game
            </Button>
          </div>
        )}

        {!isHost && (
          <div className="text-xl text-white/70">
            Waiting for host...
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreboardView;
