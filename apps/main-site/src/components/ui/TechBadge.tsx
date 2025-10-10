import { Sparkles } from 'lucide-react';

export const TechBadge = () => (
  <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
    <Sparkles className="size-3 sm:size-4 text-purple-400" />
    <span className="text-xs sm:text-sm text-purple-300">
      Built with React 19 & TypeScript
    </span>
  </div>
);
