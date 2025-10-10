import { useRef, useCallback, useEffect } from 'react';
import type { DrawingEvent, Point } from '../types';

export const useCanvas = (
  isDrawing: boolean,
  onDrawingEvent?: (event: DrawingEvent) => void,
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<Point[]>([]);
  const currentColor = useRef('#000000');
  const currentBrushSize = useRef(3);

  const getContext = useCallback((): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const clearCanvas = useCallback(() => {
    const ctx = getContext();
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (onDrawingEvent) {
      onDrawingEvent({
        type: 'clear',
        timestamp: Date.now(),
      });
    }
  }, [getContext, onDrawingEvent]);

  const setColor = useCallback((color: string) => {
    currentColor.current = color;
  }, []);

  const setBrushSize = useCallback((size: number) => {
    currentBrushSize.current = size;
  }, []);

  const drawLine = useCallback((points: Point[], color: string, brushSize: number) => {
    const ctx = getContext();
    if (!ctx || points.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
  }, [getContext]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    isDrawingRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentPathRef.current = [{ x, y }];
  }, [isDrawing]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDrawingRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentPathRef.current.push({ x, y });

    drawLine(
      currentPathRef.current.slice(-2),
      currentColor.current,
      currentBrushSize.current,
    );
  }, [drawLine]);

  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;

    if (currentPathRef.current.length > 0 && onDrawingEvent) {
      onDrawingEvent({
        type: 'stroke',
        points: [...currentPathRef.current],
        color: currentColor.current,
        brushSize: currentBrushSize.current,
        timestamp: Date.now(),
      });
    }

    currentPathRef.current = [];
  }, [onDrawingEvent]);

  const replayEvent = useCallback((event: DrawingEvent) => {
    switch (event.type) {
      case 'clear': {
        const ctx = getContext();
        if (!ctx || !canvasRef.current) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        break;
      }
      case 'stroke':
        if (event.points && event.color && event.brushSize) {
          drawLine(event.points, event.color, event.brushSize);
        }
        break;
    }
  }, [getContext, drawLine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return {
    canvasRef,
    clearCanvas,
    setColor,
    setBrushSize,
    replayEvent,
  };
};
