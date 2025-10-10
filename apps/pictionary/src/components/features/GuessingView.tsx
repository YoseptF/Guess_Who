import { useState, useEffect } from 'react';
import { Canvas, Timer, Input, Button } from 'shared-ui';
import { useCanvas } from '../../hooks/useCanvas';
import type { DrawingEvent } from '../../types';

interface GuessingViewProps {
  timeRemaining: number;
  drawings: DrawingEvent[];
  onGuess: (guess: string) => void;
}

const GuessingView = ({
  timeRemaining,
  drawings,
  onGuess,
}: GuessingViewProps) => {
  const { canvasRef, replayEvent } = useCanvas(false);
  const [guess, setGuess] = useState('');

  useEffect(() => {
    if (drawings.length > 0) {
      const latestEvent = drawings[drawings.length - 1];
      replayEvent(latestEvent);
    }
  }, [drawings, replayEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim().toLowerCase());
      setGuess('');
    }
  };

  return (
    <div className="app">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex items-center justify-between w-full max-w-4xl">
          <div className="text-3xl font-bold text-white bg-white/20 px-8 py-4 rounded-xl backdrop-blur-sm">
            Guess the word!
          </div>
          <Timer timeRemaining={timeRemaining} />
        </div>

        <Canvas ref={canvasRef} canvasWidth={800} canvasHeight={600} className="pointer-events-none" />

        <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-md">
          <Input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Type your guess..."
            className="flex-1 text-lg p-4"
            autoFocus
          />
          <Button type="submit" size="lg">
            Guess
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GuessingView;
