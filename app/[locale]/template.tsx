'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ filter: "blur(20px)", opacity: 0, scale: 0.98 }}
        animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
        exit={{ filter: "blur(20px)", opacity: 0, scale: 0.98 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
      
      {/* "Liquid" Overlay simulation using a distinct colored wipe if wanted, 
          but blur/scale is cleaner/safer for performance */ }
    </>
  );
}
