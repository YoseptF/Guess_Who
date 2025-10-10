import { Button } from 'shared-ui';
import { ExternalLink } from 'lucide-react';
import type { Game } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { FeatureTag } from '../ui/FeatureTag';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const Icon = game.icon;

  return (
    <div className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 md:hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 rounded-xl sm:rounded-2xl transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div
            className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${game.color} shadow-lg`}
          >
            <Icon className="size-5 sm:size-6 text-white" />
          </div>

          <StatusBadge status={game.status} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white">
          {game.name}
        </h2>

        <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6 leading-relaxed">
          {game.description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {game.features.map((feature, i) => (
            <FeatureTag key={i} feature={feature} />
          ))}
        </div>

        <a href={game.url} target="_blank" rel="noopener noreferrer">
          <Button
            variant="default"
            size="lg"
            className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 shadow-lg group-hover:shadow-xl transition-all text-sm sm:text-base`}
          >
            Play Now
            <ExternalLink className="size-3.5 sm:size-4" />
          </Button>
        </a>
      </div>
    </div>
  );
};
