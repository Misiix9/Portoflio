'use client';

import { motion } from 'framer-motion';

export default function DecayText({ text, className = "", highlightWords = [] }: { text: string, className?: string, highlightWords?: string[] }) {
  // OPTIMIZATION: Removed scroll-linked animation. It was causing severe lag due to 
  // hundreds of active event listeners (one per character).
  // Now using a staggered entry animation which is much lighter.

  const words = text.split(" ");
  
  const container: any = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child: any = {
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
        const isHighlighted = highlightWords.includes(word.replace(/[^a-zA-Z]/g, "")); 
        
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
