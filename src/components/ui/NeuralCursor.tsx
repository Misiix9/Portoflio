'use client';

import { useEffect, useRef } from 'react';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

interface CursorTarget {
  x: number;
  y: number;
}

const MAX_LINES = 5;
const PROXIMITY = 145;

export default function NeuralCursor() {
  const { canUsePointerEffects } = usePerformanceMode();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!canUsePointerEffects) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let isPointer = false;
    let isClicking = false;
    let frame = 0;
    let scanFrame = 0;
    let targets: CursorTarget[] = [];

    const lineEls = Array.from({ length: MAX_LINES }, () => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', 'rgba(86, 2, 10, 0.32)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      line.style.display = 'none';
      svgRef.current?.appendChild(line);
      return line;
    });

    const scanElements = () => {
      targets = Array.from(document.querySelectorAll<HTMLElement>('a, button, .magnetic-target'))
        .slice(0, 90)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        });
    };

    const scheduleScan = () => {
      cancelAnimationFrame(scanFrame);
      scanFrame = requestAnimationFrame(scanElements);
    };

    const render = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot && ring) {
        dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0) scale(${isClicking ? 0.8 : 1})`;

        const ringSize = isPointer ? 60 : 40;
        ring.style.width = `${ringSize}px`;
        ring.style.height = `${ringSize}px`;
        ring.style.backgroundColor = isPointer ? 'rgba(255,255,255,0.05)' : 'transparent';
        ring.style.transform = `translate3d(${x - ringSize / 2}px, ${y - ringSize / 2}px, 0)`;
      }

      let lineIndex = 0;
      for (const target of targets) {
        if (lineIndex >= MAX_LINES) break;
        const distance = Math.hypot(x - target.x, y - target.y);
        if (distance < PROXIMITY) {
          const line = lineEls[lineIndex];
          line.style.display = 'block';
          line.setAttribute('x1', String(x));
          line.setAttribute('y1', String(y));
          line.setAttribute('x2', String(target.x));
          line.setAttribute('y2', String(target.y));
          lineIndex += 1;
        }
      }

      for (let i = lineIndex; i < lineEls.length; i++) {
        lineEls[i].style.display = 'none';
      }

      frame = requestAnimationFrame(render);
    };

    const updatePosition = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target as HTMLElement | null;
      isPointer = Boolean(target?.closest('a, button, .magnetic-target'));
    };

    const handlePointerDown = () => {
      isClicking = true;
    };

    const handlePointerUp = () => {
      isClicking = false;
    };

    scanElements();
    frame = requestAnimationFrame(render);
    const scanInterval = window.setInterval(scanElements, 2500);

    window.addEventListener('pointermove', updatePosition, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('resize', scheduleScan, { passive: true });
    window.addEventListener('scroll', scheduleScan, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scanFrame);
      clearInterval(scanInterval);
      window.removeEventListener('pointermove', updatePosition);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', scheduleScan);
      window.removeEventListener('scroll', scheduleScan);
      lineEls.forEach((line) => line.remove());
    };
  }, [canUsePointerEffects]);

  if (!canUsePointerEffects) {
    return null;
  }

  return (
    <>
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9997] overflow-visible"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-white/30 pointer-events-none z-[9998] will-change-transform"
      />
    </>
  );
}
