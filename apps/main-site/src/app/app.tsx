import { Gamepad2 } from 'lucide-react';
import type { Game } from '../types';
import { BackgroundGradient } from '../components/ui/BackgroundGradient';
import { Header } from '../components/features/Header';
import { GameCard } from '../components/features/GameCard';
import { ComingSoonCard } from '../components/features/ComingSoonCard';
import { Footer } from '../components/features/Footer';

export const App = () => {
  const games: Game[] = [
    {
      name: 'Guess Who',
      description: 'Classic guessing game with different character packs',
      url: 'https://guesswho.yosept.me',
      status: 'Live',
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-500',
      features: ['Multiplayer', 'Multiple Packs', 'P2P Connection'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden relative">
      <BackgroundGradient />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}

          <ComingSoonCard />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
