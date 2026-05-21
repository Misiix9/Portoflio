'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

export default function Navbar() {
  const t = useTranslations('Nav');
  const { canUseSmoothScroll, canUseAmbientMotion } = usePerformanceMode();
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll();
  
  // Smart Scroll Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const nextHidden = Boolean(canUseAmbientMotion && latest > previous && latest > 150);
    if (nextHidden !== hiddenRef.current) {
      hiddenRef.current = nextHidden;
      setHidden(nextHidden);
    }
  });

  const navItems = [
    { id: 'about', label: t('about') },
    { id: 'projects', label: t('projects') },
    { id: 'skills', label: t('skills') },
    { id: 'contact', label: t('contact') },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header if needed
      const yOffset = -50; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: canUseSmoothScroll ? 'smooth' : 'auto' });
    }
  };

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-110%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: canUseAmbientMotion ? 0.28 : 0, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none"
      >
        <div className="pointer-events-auto mx-4 flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 overflow-x-auto rounded-full border border-white/5 bg-black/50 px-3 py-3 shadow-lg backdrop-blur-xl sm:gap-8 sm:px-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400 transition-colors hover:text-white sm:text-sm sm:tracking-widest group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Persistent Progress Line */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </>
  );
}
