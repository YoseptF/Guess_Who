import { Button } from 'shared-ui';
import { Gamepad2, Sparkles, Users, ExternalLink, Github } from 'lucide-react';

export const App = () => {
  const games = [
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <header className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
            <Sparkles className="size-3 sm:size-4 text-purple-400" />
            <span className="text-xs sm:text-sm text-purple-300">
              Built with React 19 & TypeScript
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient px-4">
            Games by Yoseph
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Open-source multiplayer games built for fun with friends
          </p>

          <div className="flex items-center justify-center gap-4 px-4">
            <a
              href="https://github.com/yoseph/guess_who"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="text-sm sm:text-base">
                <Github className="size-4 sm:size-5" />
                <span className="hidden xs:inline">View on GitHub</span>
                <span className="xs:hidden">GitHub</span>
              </Button>
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 md:hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
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

                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      {game.status}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white">
                    {game.name}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {game.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
          })}

          <div className="group relative bg-gradient-to-br from-slate-900/30 to-slate-800/30 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-dashed border-slate-700/50 flex flex-col items-center justify-center text-center hover:border-purple-500/30 transition-all duration-300 min-h-[200px] sm:min-h-[250px]">
            <div className="p-3 sm:p-4 rounded-full bg-slate-800/50 mb-3 sm:mb-4">
              <Users className="size-6 sm:size-8 text-slate-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-400 mb-1 sm:mb-2">
              More Games Coming
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Building the next multiplayer experience...
            </p>
          </div>
        </div>

        <footer className="text-center mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-slate-800/50 px-4">
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Built with ♥ by Yosept • Open Source • React 19 • TypeScript •
            Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
