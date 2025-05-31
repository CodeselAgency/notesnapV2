import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export const useSmoothScroll = () => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // Integrate with requestAnimationFrame
        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup function
        return () => {
            lenisRef.current?.destroy();
        };
    }, []);

    return lenisRef.current;
}; 