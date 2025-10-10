import { useEffect } from 'react';
import { Canvas } from 'shared-ui';
import { useCanvas } from '../../hooks/useCanvas';
import type { DrawingEvent, Player } from '../../types';

interface RoundEndProps {
  isSuccess: boolean;
  word: string;
  winner: Player | null;
  drawings: DrawingEvent[];
}

const RoundEnd = ({ isSuccess, word, winner, drawings }: RoundEndProps) => {
  const { canvasRef, replayEvent } = useCanvas(false);

  useEffect(() => {
    drawings.forEach(event => {
      replayEvent(event);
    });
  }, [drawings, replayEvent]);

  useEffect(() => {
    const audio = new Audio(isSuccess ? '/sounds/success.mp3' : '/sounds/failure.mp3');
    audio.play().catch(() => {});
  }, [isSuccess]);

  return (
    <div className="app">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="relative">
          <div className={`text-8xl mb-4 animate-bounce ${isSuccess ? 'animate-pulse' : ''}`}>
            {isSuccess ? '🎉' : '⏰'}
          </div>
          <h1 className={`text-5xl font-bold ${isSuccess ? 'text-green-300' : 'text-red-300'}`}>
            {isSuccess ? 'Correct!' : 'Time\'s Up!'}
          </h1>
        </div>

        <div className="text-3xl text-white bg-white/20 px-8 py-4 rounded-xl backdrop-blur-sm">
          The word was: <span className="font-bold text-yellow-300">{word}</span>
        </div>

        {isSuccess && winner && (
          <div className="text-2xl text-white bg-green-500/30 px-8 py-4 rounded-xl backdrop-blur-sm border-2 border-green-400">
            🏆 {winner.name} guessed it!
          </div>
        )}

        <Canvas ref={canvasRef} canvasWidth={800} canvasHeight={600} className="pointer-events-none opacity-80" />

        <div className="text-xl text-white/70 animate-pulse">
          {winner ? 'Host will continue shortly...' : 'Better luck next time!'}
        </div>
      </div>
    </div>
  );
};

export default RoundEnd;
