import { Button } from 'shared-ui';
import { siGithub } from 'simple-icons';
import { TechBadge } from '../ui/TechBadge';

export const Header = () => (
  <header className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
    <TechBadge />

    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient px-4">
      Games by Yosept
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
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 sm:size-5 fill-current"
            aria-label="GitHub"
          >
            <path d={siGithub.path} />
          </svg>
          <span className="hidden xs:inline">View on GitHub</span>
          <span className="xs:hidden">GitHub</span>
        </Button>
      </a>
    </div>
  </header>
);
