import { useState, useEffect, useRef } from 'react';
import { Canvas, Timer, Input, Button } from 'shared-ui';
import { useCanvas } from '../../hooks/useCanvas';
import type { DrawingEvent } from '../../types';
import { VisualViewport } from './VisualViewport';

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

  // useEffect(() => {
  //   const handleResize = () => {
  //     const viewportHeight =
  //       window.visualViewport?.height ?? window.innerHeight;
  //     const windowHeight = window.innerHeight;

  //     const keyboardVisible = viewportHeight < windowHeight * 0.75;
  //     setIsKeyboardVisible(keyboardVisible);

  //     if (keyboardVisible && canvasContainerRef.current) {
  //       canvasContainerRef.current.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center',
  //       });
  //     }
  //   };

  //   window.visualViewport?.addEventListener('resize', handleResize);
  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.visualViewport?.removeEventListener('resize', handleResize);
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim().toLowerCase());
      setGuess('');
    }
  };

  return (
    <VisualViewport
      className="flex flex-col bg-red-300 h-full"
      style={{
        touchAction: 'none',
      }}
    >
      <div className="flex items-center justify-between gap-2 border-4 border-b-black">
        <div className="text-lg font-bold text-white bg-purple-900/90 px-3 py-1 rounded-lg backdrop-blur-sm shadow-lg">
          Guess the word!
        </div>
        <Timer timeRemaining={timeRemaining} />
      </div>
      <div
        ref={canvasContainerRef}
        className="w-full flex items-center justify-center  bg-red-100 border-4 border-b-black"
        style={{
          height: `calc(100% - ${isKeyboardVisible ? '300px' : '155px'})`,
          transition: 'height 150ms ease',
        }}
      >
        <Canvas ref={canvasRef} className="pointer-events-none" />
      </div>
      {window.innerHeight}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-4 border-b-black"
      >
        <Input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your guess..."
          className="flex-1 text-sm p-2 md:p-4 bg-white/95 backdrop-blur-sm"
          autoFocus
        />
        <Button type="submit" size="sm" className="px-4 shadow-lg">
          Guess
        </Button>
      </form>
    </VisualViewport>
  );
};

export default GuessingView;
