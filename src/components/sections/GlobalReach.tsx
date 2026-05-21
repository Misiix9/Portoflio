'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

const GlobeCanvas = dynamic(() => import('@/components/ui/GlobeCanvas'), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

function GlobeFallback() {
  return (
    <div
      className="h-[min(600px,80vw)] w-[min(600px,80vw)] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.14),rgba(86,2,10,0.18)_40%,rgba(10,10,10,0.7)_72%)]"
      aria-hidden="true"
    />
  );
}

export default function GlobalReach() {
  const t = useTranslations('GlobalReach');
  const { canUseHeavyVisuals, canUseAmbientMotion } = usePerformanceMode();

  return (
    <section className="w-full py-24 container mx-auto px-6 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Content */}
        <motion.div 
            initial={canUseAmbientMotion ? { opacity: 0, x: -28 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col gap-6"
        >
            <h2 className="text-4xl font-bold text-white mb-2">
                {t('heading')} <br />
                <span className="text-accent">{t('headingAccent')}</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
                {t('body')}
            </p>
            
            <div className="flex gap-4 mt-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex-1 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white">{t('remoteValue')}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{t('remoteLabel')}</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex-1 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white">{t('asyncValue')}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{t('asyncLabel')}</p>
                </div>
            </div>
        </motion.div>

        {/* Right: Globe */}
        <motion.div 
            initial={canUseAmbientMotion ? { opacity: 0, scale: 0.92 } : false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative h-[500px] w-full flex items-center justify-center"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-20" />
            {canUseHeavyVisuals ? <GlobeCanvas /> : <GlobeFallback />}
        </motion.div>

      </div>
    </section>
  );
}
