import React, { useRef, useEffect, ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';

const ResizableCanvas = (props: { children: ReactNode, shadows?: boolean, camera?: any, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parentNode = canvasRef.current.parentNode as HTMLElement;
        const width = parentNode.offsetWidth;
        const height = parentNode.offsetHeight;

        if (width && height) {
          canvasRef.current.style.width = `${width}px`;
          canvasRef.current.style.height = `${height}px`;
        }
      }
    };

    const handleContextLost = (event: WebGLContextEvent) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore it...');
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      // Optionally, force a re-render or resource reloading here.
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    // canvasRef.current?.addEventListener('webglcontextlost', handleContextLost);
    canvasRef.current?.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('resize', handleResize);
    //   canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost);
      canvasRef.current?.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  return (
    <div ref={containerRef} className="canvas-container">
      <Canvas ref={canvasRef} {...props}>
        {props.children}
      </Canvas>
    </div>
  );
};

export default ResizableCanvas;
