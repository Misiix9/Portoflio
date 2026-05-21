'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DecayText from '@/components/ui/DecayText';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';
import { showcaseItems, type ShowcaseFilter, type ShowcaseItem } from '@/data/showcase';

const filters: ShowcaseFilter[] = ['all', 'project', 'study'];

function Card({
  item,
  enableTilt,
  enableMotion,
}: {
  item: ShowcaseItem;
  enableTilt: boolean;
  enableMotion: boolean;
}) {
  const t = useTranslations('Showcase');
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 140, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 140, damping: 18 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [-5, 5]);
  const title = t(`items.${item.id}.title`);
  const description = t(`items.${item.id}.description`);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!enableTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('open', { title })}
      initial={enableMotion ? { opacity: 0, y: 18 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={enableTilt ? { y: -8 } : undefined}
      whileTap={enableTilt ? { scale: 0.985 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onBlur={resetTilt}
      className="group/card block w-full perspective-1000 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <motion.div
        style={
          enableTilt
            ? {
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 transition-colors duration-300 group-hover/card:border-accent/50 ${enableTilt ? 'shadow-[0_24px_70px_rgba(0,0,0,0.28)]' : 'shadow-lg'} ${item.imageBg}`}
      >
        <div className="absolute inset-0">
          <Image
            src={item.image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`${item.imageFit === 'contain' ? 'object-contain p-8' : 'object-cover'} ${enableMotion ? 'transition duration-500 ease-out group-hover/card:scale-[1.04]' : ''}`}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/0" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-6 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
              {t(`kinds.${item.kind}`)}
            </span>
            <span className="font-mono text-xs text-white/60">{item.year}</span>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-2xl font-bold leading-tight text-white md:text-3xl">
              {title}
              <ArrowUpRight className="h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-hover/card:translate-x-1 group-hover/card:-translate-y-1" />
            </h3>
            <p className="mt-3 max-w-[92%] text-sm leading-relaxed text-gray-300">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
}

export default function MagneticGallery() {
  const t = useTranslations('Showcase');
  const [filter, setFilter] = useState<ShowcaseFilter>('all');
  const profile = usePerformanceMode();
  const enableTilt = Boolean(profile.mode === 'full' && profile.isFinePointer && profile.canUseAmbientMotion);

  const filteredProjects = useMemo(
    () =>
      showcaseItems.filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'project') return item.kind !== 'study';
        return item.kind === 'study';
      }),
    [filter],
  );

  const heading = `${t('headingBefore')} ${t('headingAccent')}`;

  return (
    <section id="projects" className="relative z-10 mx-auto min-h-screen w-full max-w-7xl px-6 py-32">
      <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <DecayText
          text={heading}
          highlightWords={[t('headingAccent')]}
          className="justify-start text-5xl font-bold text-white md:text-8xl"
        />

        <div className="flex w-full overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm md:w-auto">
          {filters.map((currentFilter) => (
            <button
              key={currentFilter}
              type="button"
              onClick={() => setFilter(currentFilter)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 md:px-6 ${
                filter === currentFilter ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t(`filters.${currentFilter}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-14">
        {filteredProjects.map((item) => (
          <Card
            key={item.id}
            item={item}
            enableTilt={enableTilt}
            enableMotion={profile.canUseAmbientMotion}
          />
        ))}
      </div>
    </section>
  );
}
