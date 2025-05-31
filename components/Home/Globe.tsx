"use client";
import React from "react";
import { cn } from "@/lib/utlis";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

// Define a minimal interface for the globe instance
interface GlobeInstance {
  destroy: () => void;
  // Add other methods like toggle if needed in the future
  // toggle?: () => void;
}

// ... (Keep all other imports and components the same)

export const SkeletonFour = () => {
  return (
    <div className="w-full max-w-[600px] h-auto aspect-square mx-auto">
      <Globe className="w-full h-full" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let phi = 0;

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = window.devicePixelRatio;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      if (globeRef.current) {
        globeRef.current.destroy();
      }

      const globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: height * dpr,
        phi: 0,
        theta: 0,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 3,
        baseColor: [1, 1, 1],
        markerColor: [1, 1, 1],
        glowColor: [1, 1, 1],
        markers: [
          { location: [37.7595, -122.4367], size: 0.03 },
          { location: [40.7128, -74.006], size: 0.1 },
        ],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.01;
        },
      });

      globeRef.current = globe as GlobeInstance;
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (globeRef.current) {
        globeRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full aspect-square", className)}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

// ... (Keep rest of the file the same)
