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
    <div className="app h-screen overflow-hidden flex flex-col w-full" style={{ touchAction: 'none' }}>
      <div className="flex flex-col items-center gap-3 p-3 bg-gradient-to-b from-purple-900 to-purple-900/95 w-full">
        <div className="flex items-center justify-between w-full max-w-4xl flex-wrap gap-2">
          <div className="text-xl md:text-3xl font-bold text-white bg-white/20 px-3 md:px-8 py-2 md:py-4 rounded-xl backdrop-blur-sm">
            Draw: <span className="text-yellow-300">{word}</span>
          </div>
          <Timer timeRemaining={timeRemaining} />
        </div>

        <div className="flex flex-col md:flex-row gap-2 bg-white/10 p-2 md:p-4 rounded-xl backdrop-blur-sm w-full max-w-4xl">
          <div className="flex gap-1.5 items-center flex-wrap">
            <span className="text-white font-semibold text-xs md:text-sm">Color:</span>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-7 h-7 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                  currentColor === color ? 'border-white scale-110' : 'border-white/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex gap-1.5 items-center flex-wrap md:ml-4">
            <span className="text-white font-semibold text-xs md:text-sm">Size:</span>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setCurrentSize(size)}
                className={`w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/20 text-white font-bold text-xs md:text-sm transition-all ${
                  currentSize === size ? 'bg-white/40 scale-110' : ''
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <Button onClick={clearCanvas} variant="destructive" size="sm" className="md:ml-4 w-full md:w-auto">
            Clear
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
        <Canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default DrawingView;
