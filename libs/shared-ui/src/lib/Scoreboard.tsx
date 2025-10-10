import { cn } from './utils';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface ScoreboardProps {
  players: Player[];
  className?: string;
}

export const Scoreboard = ({ players, className }: ScoreboardProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={cn('bg-white/10 rounded-2xl p-6 backdrop-blur-sm', className)}>
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Scoreboard
      </h2>
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={cn(
              'flex items-center justify-between p-4 rounded-lg transition-all duration-300',
              index === 0
                ? 'bg-yellow-500/30 border-2 border-yellow-400'
                : 'bg-white/10 border border-white/20'
            )}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-white/70 w-8">
                #{index + 1}
              </span>
              <span className="text-xl font-semibold text-white">
                {player.name}
              </span>
            </div>
            <span className="text-2xl font-bold text-white">
              {player.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
