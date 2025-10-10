import { cn } from './utils';

interface TimerProps {
  timeRemaining: number;
  className?: string;
}

export const Timer = ({ timeRemaining, className }: TimerProps) => {
  const isLowTime = timeRemaining <= 10;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div
      className={cn(
        'text-6xl font-bold py-4 px-8 rounded-2xl backdrop-blur-sm transition-colors duration-300',
        isLowTime
          ? 'bg-red-500/30 text-red-100 animate-pulse'
          : 'bg-white/20 text-white',
        className
      )}
    >
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};
