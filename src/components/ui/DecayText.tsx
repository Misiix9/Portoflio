'use client';

import { motion, type Variants } from 'framer-motion';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

export default function DecayText({ text, className = "", highlightWords = [] }: { text: string, className?: string, highlightWords?: string[] }) {
  // OPTIMIZATION: Removed scroll-linked animation. It was causing severe lag due to 
  // hundreds of active event listeners (one per character).
  // Now using a staggered entry animation which is much lighter.
  const { canUseAmbientMotion, mode } = usePerformanceMode();
  const words = text.split(" ");

  if (!canUseAmbientMotion || mode !== 'full') {
    return (
      <h2 className={`relative flex flex-wrap justify-center gap-[0.3em] ${className}`}>
        {words.map((word, wIndex) => {
          const normalizedWord = word.replace(/[^\p{L}\p{N}]/gu, "");
          const isHighlighted = highlightWords.includes(normalizedWord);
          return (
            <span key={wIndex} className={isHighlighted ? 'text-accent' : ''}>
              {word}
            </span>
          );
        })}
      </h2>
    );
  }
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotate: 10,
    },
  };

  return (
    <motion.h2 
        className={`relative flex flex-wrap justify-center gap-[0.3em] ${className}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, wIndex) => {
        const normalizedWord = word.replace(/[^\p{L}\p{N}]/gu, "");
        const isHighlighted = highlightWords.includes(normalizedWord);
        
        return (
            <span key={wIndex} className={`flex ${isHighlighted ? 'text-accent' : ''}`}>
                {word.split("").map((char, cIndex) => (
                    <motion.span
                        key={`${wIndex}-${cIndex}`}
                        variants={child}
                        className="inline-block"
                    >
                        {char}
                    </motion.span>
                ))}
            </span>
        );
      })}
    </motion.h2>
  );
}
