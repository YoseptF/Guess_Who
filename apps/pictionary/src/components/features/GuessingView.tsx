import { useState, useEffect, useRef } from 'react';
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
  const lastDrawingCountRef = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (drawings.length > lastDrawingCountRef.current) {
      for (let i = lastDrawingCountRef.current; i < drawings.length; i++) {
        replayEvent(drawings[i]);
      }
      lastDrawingCountRef.current = drawings.length;
    }
  }, [drawings, replayEvent]);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const windowHeight = window.innerHeight;

      const keyboardVisible = viewportHeight < windowHeight * 0.75;
      setIsKeyboardVisible(keyboardVisible);

      if (keyboardVisible && canvasContainerRef.current) {
        canvasContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim().toLowerCase());
      setGuess('');
    }
  };

  return (
    <div
      className="app h-screen flex flex-col w-full"
      style={{
        touchAction: 'none',
        overflow: isKeyboardVisible ? 'auto' : 'hidden'
      }}
    >
      <div className="flex flex-col items-center gap-3 p-3 bg-gradient-to-b from-purple-900 to-purple-900/95 w-full">
        <div className="flex items-center justify-between w-full max-w-4xl flex-wrap gap-2">
          <div className="text-xl md:text-3xl font-bold text-white bg-white/20 px-3 md:px-8 py-2 md:py-4 rounded-xl backdrop-blur-sm">
            Guess the word!
          </div>
          <Timer timeRemaining={timeRemaining} />
        </div>
      </div>

      <div
        ref={canvasContainerRef}
        className="flex-1 flex items-center justify-center overflow-hidden w-full"
      >
        <Canvas ref={canvasRef} className="pointer-events-none" />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 p-4 bg-gradient-to-t from-purple-900 to-purple-900/95">
        <Input
          type="text"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          placeholder="Type your guess..."
          className="flex-1 text-base md:text-lg p-3 md:p-4"
          autoFocus
        />
        <Button type="submit" size="lg">
          Guess
        </Button>
      </form>
    </div>
  );
};

export default GuessingView;
