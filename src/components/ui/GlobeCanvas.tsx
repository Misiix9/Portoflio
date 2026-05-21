'use client';

import createGlobe from 'cobe';
import { useEffect, useRef, useState } from 'react';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profile = usePerformanceMode();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !profile.canUseHeavyVisuals) return;

    if (!('IntersectionObserver' in window)) {
      const frame = requestAnimationFrame(() => setIsReady(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '220px' },
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [profile.canUseHeavyVisuals]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady || !profile.canUseHeavyVisuals) return;

    const parentSize = canvas.parentElement?.clientWidth ?? 600;
    const size = Math.min(Math.max(parentSize, 280), 600);
    const dpr = profile.maxDpr;
    let phi = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: Math.floor(size * dpr),
      height: Math.floor(size * dpr),
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: profile.globeSamples,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.9, 0.1, 0.2],
      glowColor: [0.5, 0, 0.1],
      markers: [
        { location: [40.7128, -74.0060], size: 0.1 },
        { location: [51.5074, -0.1278], size: 0.1 },
        { location: [35.6762, 139.6503], size: 0.1 },
        { location: [47.4979, 19.0402], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        if (profile.canUseAmbientMotion) {
          phi += profile.mode === 'full' ? 0.002 : 0.0011;
        }
      },
    });

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    return () => globe.destroy();
  }, [
    isReady,
    profile.canUseAmbientMotion,
    profile.canUseHeavyVisuals,
    profile.globeSamples,
    profile.maxDpr,
    profile.mode,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: 1 }}
      className="cursor-move grab active:grabbing"
      aria-hidden="true"
    />
  );
}
