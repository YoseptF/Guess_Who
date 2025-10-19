import React, { FC, JSX, useEffect, useRef, useState } from 'react';

interface ViewportState {
  maxHeight: number | string;
  maxWidth: number | string;
}

interface VisualViewportProps {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const VisualViewport: FC<VisualViewportProps> = ({
  as: Element = 'div',
  children,
  style = {},
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [viewport, setViewport] = useState<ViewportState>({
    maxHeight: '100vh',
    maxWidth: '100vw',
  });

  const updateViewport = () => {
    setViewport({
      maxHeight: window.visualViewport?.height ?? 0,
      maxWidth: window.visualViewport?.width ?? 0,
    });

    window.scrollTo(0, ref.current?.offsetTop ?? 0);
  };

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.visualViewport !== 'undefined'
    ) {
      updateViewport();

      window.visualViewport?.addEventListener('resize', updateViewport);

      return () =>
        window.visualViewport?.removeEventListener('resize', updateViewport);
    }
  }, []);

  return (
    <Element ref={ref} style={{ ...style, ...viewport }} className={className}>
      {children}
    </Element>
  );
};
