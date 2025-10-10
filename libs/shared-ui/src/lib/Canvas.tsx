import { forwardRef } from 'react';
import { cn } from './utils';

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  canvasWidth?: number;
  canvasHeight?: number;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className, canvasWidth = 800, canvasHeight = 600, ...props }, ref) => (
    <canvas
      ref={ref}
      width={canvasWidth}
      height={canvasHeight}
      className={cn(
        'border-2 border-white/20 rounded-lg bg-white cursor-crosshair touch-none',
        className
      )}
      {...props}
    />
  )
);

Canvas.displayName = 'Canvas';
