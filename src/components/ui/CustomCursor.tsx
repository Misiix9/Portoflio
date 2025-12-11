'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
          cursor: none;
        }
        a, button, input, textarea {
          cursor: none;
        }
      `}</style>
      
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isClicking ? 0.8 : 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />

      {/* Glowing Surround */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white/30 pointer-events-none z-[9998]"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          width: isPointer ? 60 : 40,
          height: isPointer ? 60 : 40,
          opacity: 1,
          backgroundColor: isPointer ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          mass: 0.8
        }}
        style={{
           boxShadow: isPointer ? '0 0 20px rgba(86, 2, 10, 0.5)' : 'none'
        }}
      />
    </>
  );
}
