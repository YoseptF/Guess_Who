import { Users } from 'lucide-react';

export const ComingSoonCard = () => (
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
);
