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
    onDrawingEvent,
  );

  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    setColor(currentColor);
  }, [currentColor, setColor]);

  useEffect(() => {
    setBrushSize(currentSize);
  }, [currentSize, setBrushSize]);

  const colors = [
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
  ];
  const sizes = [1, 3, 5, 10];

  return (
    <div
      className="app h-screen overflow-hidden flex flex-col w-full relative"
      style={{ touchAction: 'none' }}
    >
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-2">
        <div className="text-lg md:text-2xl font-bold text-white bg-purple-900/90 px-3 py-1 rounded-lg backdrop-blur-sm shadow-lg">
          Draw: <span className="text-yellow-300">{word}</span>
        </div>
        <Timer timeRemaining={timeRemaining} />
      </div>

      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-14 left-2 z-20 bg-purple-900/90 text-white px-3 py-2 rounded-lg backdrop-blur-sm shadow-lg flex items-center gap-2 font-semibold"
      >
        <span
          className="w-5 h-5 rounded-full border-2 border-white"
          style={{ backgroundColor: currentColor }}
        />
        <span className="text-sm">{currentSize}px</span>
        <span className="text-xs">{showControls ? '▼' : '▶'}</span>
      </button>

      {showControls && (
        <div className="absolute top-28 left-2 right-2 z-20 bg-purple-900/95 p-3 rounded-lg backdrop-blur-sm shadow-lg">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-white font-semibold text-sm">Color:</span>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentColor === color
                      ? 'border-white scale-110'
                      : 'border-white/30'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-white font-semibold text-sm">Size:</span>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setCurrentSize(size)}
                  className={`w-8 h-8 rounded-full bg-white/20 text-white font-bold text-xs transition-all ${
                    currentSize === size ? 'bg-white/40 scale-110' : ''
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearCanvas}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                Clear Canvas
              </Button>
              <Button
                onClick={() => setShowControls(false)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{ padding: '4rem 0.5rem 1rem 0.5rem' }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default DrawingView;
