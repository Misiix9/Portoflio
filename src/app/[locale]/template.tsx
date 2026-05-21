'use client';

import { motion } from 'framer-motion';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

export default function Template({ children }: { children: React.ReactNode }) {
  const { canUseAmbientMotion, mode } = usePerformanceMode();

  return (
    <>
      <motion.div
        initial={canUseAmbientMotion ? { opacity: 0, y: mode === 'full' ? 12 : 6 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={canUseAmbientMotion ? { opacity: 0, y: -6 } : undefined}
        transition={{ ease: "easeOut", duration: mode === 'full' ? 0.32 : 0.2 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  );
}
