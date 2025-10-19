import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { cn } from './utils';

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  canvasWidth?: number;
  canvasHeight?: number;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className, canvasWidth, canvasHeight, ...props }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const dimensionsRef = useRef({ width: 0, height: 0 });

    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useEffect(() => {
      const canvas = internalRef.current;
      if (!canvas) return;

      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (!container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const width = canvasWidth ?? containerWidth;
        const height = canvasHeight ?? containerHeight;

        if (
          dimensionsRef.current.width === width &&
          dimensionsRef.current.height === height
        ) {
          return;
        }

        if (canvas.width > 0 && canvas.height > 0) {
          const imageData = canvas
            .getContext('2d')
            ?.getImageData(0, 0, canvas.width, canvas.height);

          canvas.width = width;
          canvas.height = height;

          if (imageData) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.putImageData(imageData, 0, 0);
            }
          }
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        dimensionsRef.current = { width, height };
      };

      resizeCanvas();

      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }, [canvasWidth, canvasHeight]);

    return (
      <canvas
        ref={internalRef}
        className={cn(
          'border-2 border-white/20 rounded-lg bg-white cursor-crosshair',
          className,
        )}
        style={{
          touchAction: 'none',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        {...props}
      />
    );
  },
);

Canvas.displayName = 'Canvas';
