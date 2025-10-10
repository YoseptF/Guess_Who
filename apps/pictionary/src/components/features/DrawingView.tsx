import { useState, useEffect } from 'react';
import { Canvas, Timer, Button } from 'shared-ui';
import { useCanvas } from '../../hooks/useCanvas';
import type { DrawingEvent } from '../../types';

interface DrawingViewProps {
  word: string;
  timeRemaining: number;
  onDrawingEvent: (event: DrawingEvent) => void;
}

const DrawingView = ({
  word,
  timeRemaining,
  onDrawingEvent,
}: DrawingViewProps) => {
  const { canvasRef, clearCanvas, setColor, setBrushSize } = useCanvas(
    true,
    onDrawingEvent
  );

  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);

  useEffect(() => {
    setColor(currentColor);
  }, [currentColor, setColor]);

  useEffect(() => {
    setBrushSize(currentSize);
  }, [currentSize, setBrushSize]);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
  const sizes = [1, 3, 5, 10];

  return (
    <div className="app">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex items-center justify-between w-full max-w-4xl">
          <div className="text-3xl font-bold text-white bg-white/20 px-8 py-4 rounded-xl backdrop-blur-sm">
            Draw: <span className="text-yellow-300">{word}</span>
          </div>
          <Timer timeRemaining={timeRemaining} />
        </div>

        <div className="flex gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex gap-2 items-center">
            <span className="text-white font-semibold">Color:</span>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  currentColor === color ? 'border-white scale-110' : 'border-white/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex gap-2 items-center ml-4">
            <span className="text-white font-semibold">Size:</span>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setCurrentSize(size)}
                className={`w-10 h-10 rounded-full bg-white/20 text-white font-bold transition-all ${
                  currentSize === size ? 'bg-white/40 scale-110' : ''
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <Button onClick={clearCanvas} variant="destructive" size="sm" className="ml-4">
            Clear
          </Button>
        </div>

        <Canvas ref={canvasRef} canvasWidth={800} canvasHeight={600} />
      </div>
    </div>
  );
};

export default DrawingView;
