'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function NeuralCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Store nearby targets for lines
  const [targets, setTargets] = useState<{x: number, y: number, key: string}[]>([]);

  // Cache specific target locations to avoid layout thrashing
  const targetsRef = useRef<{x: number, y: number, key: string}[]>([]); 

  useEffect(() => {
    const scanElements = () => {
      const els = document.querySelectorAll('a, button, .magnetic-target');
      const newTargets: {x: number, y: number, key: string}[] = [];
      
      els.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        newTargets.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          key: `target-${index}`
        });
      });
      targetsRef.current = newTargets;
    };

    // Scan initially and on resize/scroll
    scanElements();
    const interval = setInterval(scanElements, 2000); 

    const updatePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
            
            const target = e.target as HTMLElement;
            // Quick check for pointer - using computed style is still heavy, maybe simplify?
            // For now, tagName check is fast. fallback to computed style only if needed.
            const isClickable = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') !== null || target.closest('button') !== null;
            setIsPointer(isClickable);

            // Proximity check using CACHED coords
            const proximity = 150;
            const closeTargets: {x: number, y: number, key: string}[] = [];

            targetsRef.current.forEach((t) => {
                const dist = Math.hypot(clientX - t.x, clientY - t.y);
                if (dist < proximity) {
                    closeTargets.push(t);
                }
            });
            setTargets(closeTargets);
        };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', scanElements);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', scanElements);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        body { cursor: none; }
        a, button, input, textarea { cursor: none; }
      `}</style>

      {/* Connection Lines (Neural Synapses) */}
      <svg className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9997] overflow-visible">
         {targets.map(target => (
            <path
                key={target.key}
                d={`M ${position.x} ${position.y} L ${target.x} ${target.y}`}
                stroke="rgba(86, 2, 10, 0.3)" 
                strokeWidth="1"
            />
         ))}
      </svg>
      
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: position.x, y: position.y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isClicking ? 0.8 : 1
        }}
      />

      {/* Glowing Surround */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white/30 pointer-events-none z-[9998]"
        style={{ x: position.x, y: position.y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isPointer ? 60 : 40,
          height: isPointer ? 60 : 40,
          opacity: 1,
          backgroundColor: isPointer ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        }}
        transition={{
            type: "spring", stiffness: 300, damping: 20
        }}
      />
    </>
  );
}
