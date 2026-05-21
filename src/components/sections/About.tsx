'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPin, Database, Layout, Server, Code, Palette, Terminal, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Music, Calendar, Github, ExternalLink } from 'lucide-react';
import { useGitHubActivity } from '@/hooks/useGitHubActivity';
import { useSpotifyPlayback } from '@/hooks/useSpotifyPlayback';
import { useNextAvailability } from '@/hooks/useNextAvailability';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

const BudapestClock = memo(function BudapestClock() {
  const [budapestTime, setBudapestTime] = useState('--:--');

  useEffect(() => {
    const updateTimes = () => {
      const budapest = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Europe/Budapest',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setBudapestTime(budapest);
    };

    updateTimes();
    const interval = window.setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{budapestTime}</>;
});

function formatTrackTime(value: number) {
  return `${Math.floor(value / 60000)}:${String(Math.floor((value % 60000) / 1000)).padStart(2, '0')}`;
}

function SpotifyProgress({
  isPlaying,
  progressMs,
  durationMs,
  progressUpdatedAt,
}: {
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  progressUpdatedAt: number | null;
}) {
  const elapsedRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval = 0;

    const update = () => {
      const elapsed = isPlaying && progressUpdatedAt ? Date.now() - progressUpdatedAt : 0;
      const current = Math.min(progressMs + elapsed, durationMs);
      const ratio = Math.max(0, Math.min(current / durationMs, 1));

      if (elapsedRef.current) {
        elapsedRef.current.textContent = formatTrackTime(current);
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    const start = () => {
      clearInterval(interval);
      update();
      if (isPlaying && document.visibilityState === 'visible') {
        interval = window.setInterval(update, 1000);
      }
    };

    start();
    document.addEventListener('visibilitychange', start);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', start);
    };
  }, [durationMs, isPlaying, progressMs, progressUpdatedAt]);

  return (
    <div className="flex items-center gap-1 mt-1">
      <span ref={elapsedRef} className="text-[9px] text-gray-500 w-6 text-right">
        {formatTrackTime(progressMs)}
      </span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full origin-left rounded-full bg-green-500 transition-transform duration-1000 ease-linear"
          style={{ transform: `scaleX(${Math.max(0, Math.min(progressMs / durationMs, 1))})` }}
        />
      </div>
      <span className="text-[9px] text-gray-500 w-6">
        {formatTrackTime(durationMs)}
      </span>
    </div>
  );
}

export default function About() {
  const t = useTranslations('About');
  const locale = useLocale();
  const { canUseAmbientMotion } = usePerformanceMode();

  // Switchable card state (0 = GitHub, 1 = Spotify, 2 = Calendar)
  const [activeInfoCard, setActiveInfoCard] = useState(0);

  // Expanded state for About section
  const [isExpanded, setIsExpanded] = useState(false);

  // Live data hooks
  const githubData = useGitHubActivity();
  const spotifyData = useSpotifyPlayback();
  const availabilityData = useNextAvailability({
    locale,
    todayLabel: t('availability.today'),
    tomorrowLabel: t('availability.tomorrow'),
  });
  const spotifyTitle = spotifyData.error
    ? t('live.spotifyNotConnected')
    : (spotifyData.track || t('live.spotifyNotPlaying'));

  // Extended Tech Stack Data
  const techStack = [
    {
      category: t('tech.frontend'), items: [
        { name: "Next.js", icon: <Layout className="w-4 h-4" />, color: "text-blue-400 bg-blue-500/10" },
        { name: "React", icon: <Code className="w-4 h-4" />, color: "text-cyan-400 bg-cyan-500/10" },
        { name: "Tailwind", icon: <Palette className="w-4 h-4" />, color: "text-sky-400 bg-sky-500/10" },
        { name: "Framer", icon: <Layout className="w-4 h-4" />, color: "text-purple-400 bg-purple-500/10" },
      ]
    },
    {
      category: t('tech.backend'), items: [
        { name: "Node.js", icon: <Server className="w-4 h-4" />, color: "text-green-400 bg-green-500/10" },
        { name: "PostgreSQL", icon: <Database className="w-4 h-4" />, color: "text-indigo-400 bg-indigo-500/10" },
        { name: "Firebase", icon: <Database className="w-4 h-4" />, color: "text-yellow-400 bg-yellow-500/10" },
      ]
    },
    {
      category: t('tech.tools'), items: [
        { name: "TypeScript", icon: <Code className="w-4 h-4" />, color: "text-blue-500 bg-blue-600/10" },
        { name: "Git", icon: <Terminal className="w-4 h-4" />, color: "text-orange-400 bg-orange-500/10" },
        { name: "Figma", icon: <Palette className="w-4 h-4" />, color: "text-pink-400 bg-pink-500/10" },
      ]
    }
  ];

  return (
    <section id="about" className="py-24 container mx-auto px-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* 1. Profile Photo (1 Col) */}
        <motion.div
          initial={canUseAmbientMotion ? { opacity: 0, scale: 0.97 } : false}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="md:col-span-1 relative rounded-3xl overflow-hidden min-h-[380px] md:min-h-[340px] group border border-white/5 order-1 cursor-pointer"
        >
          <Image
            src="/images/image.jpg"
            alt="Profile"
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-white/80 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full border border-white/10">
                {t('available')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. Bio & Stats (2 Cols) */}
        <motion.div
          initial={canUseAmbientMotion ? { opacity: 0, y: 16 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          className="md:col-span-2 bg-[#111] border border-white/5 p-4 rounded-3xl flex flex-col gap-4 group hover:border-white/10 transition-colors h-fit order-2"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('sectionLabel')}</p>
              <span className="text-xs text-gray-600 font-mono">{t('established')}</span>
            </div>
            <h3 className="text-3xl font-bold text-white leading-tight mb-3">
              {t('headingBefore')} <span className="text-accent">{t('headingAccent')}</span>{t('headingAfter')}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed text-balance">
              {t('body')}
            </p>
            {/* Personal Interests */}
            <p className="text-gray-500 text-xs mt-3 pt-3 border-t border-white/5">
              {t('interests')}
            </p>

            {/* More Toggle Button - Mobile Only */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden flex items-center gap-1 text-accent text-xs hover:text-accent/80 transition-colors mt-2 group/more"
            >
              <span>{isExpanded ? t('less') : t('more')}</span>
              {isExpanded ? (
                <ChevronUp className="w-3 h-3 group-hover/more:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown className="w-3 h-3 group-hover/more:translate-y-0.5 transition-transform" />
              )}
            </button>

            {/* Extended Text - Only visible when expanded */}
            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="text-gray-500 text-xs mt-2 overflow-hidden"
                >
                  {t('extended')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors group/stat relative cursor-pointer">
              <h4 className="text-2xl font-bold text-white">5+</h4>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">{t('stats.years')}</p>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-accent whitespace-nowrap opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300">({t('stats.yearsHint')})</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
              <a href="https://github.com/Misiix9" target="_blank" rel="noreferrer">
                <h4 className="text-2xl font-bold text-white">10+</h4>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">{t('stats.projects')}</p>
              </a>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
              <h4 className="text-2xl font-bold text-white">100%</h4>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">{t('stats.commitment')}</p>
            </div>
          </div>
        </motion.div>

        {/* 3. Extended Tech Stack (2 Cols) */}
        <motion.div
          initial={canUseAmbientMotion ? { opacity: 0, y: 16 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          className={`grid-tech md:col-span-2 bg-[#111] border border-white/5 p-6 rounded-3xl flex flex-col gap-4 group hover:border-white/10 transition-colors ${isExpanded ? 'order-3' : 'order-4'}`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('tech.title')}</h4>
            <Code className="w-4 h-4 text-gray-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {techStack.map((group, i) => (
              <div key={i} className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 mb-2 pl-1">{group.category}</p>
                <div className="flex flex-col gap-2">
                  {group.items.map((tech, j) => (
                    <div key={j} className={`flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-default`}>
                      {tech.icon}
                      <span className={`text-xs font-medium ${tech.color.split(" ")[0]}`}>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4. Location & Info Card Wrapper (1 Col) - stays together */}
        <div className={`md:col-span-1 flex flex-col gap-3 ${isExpanded ? 'order-4' : 'order-3'}`}>
          {/* Location Card */}
          <motion.div
            initial={canUseAmbientMotion ? { opacity: 0, x: 16 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
            className="bg-[#111] border border-white/5 p-4 rounded-3xl flex flex-col gap-3 group hover:border-white/10 transition-colors"
          >
            {/* Location Header with Pulsing Dot */}

            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <h4 className="text-white font-bold text-sm">{t('location.city')}</h4>
                </div>
                <p className="text-gray-500 text-xs pl-6">{t('location.based')}</p>
              </div>
              {/* Live Local Time */}
              <div className="p-2 rounded-lg bg-white/5 text-xs text-white font-mono flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-accent" />
                <BudapestClock />
              </div>
            </div>

            <div className="h-px w-full bg-white/5" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{t('location.language')}</span>
                <span className="text-white">{t('location.languages')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{t('location.relocation')}</span>
                <span className="text-white">{t('location.relocationValue')}</span>
              </div>
              {/* Response Time */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{t('location.reply')}</span>
                <span className="text-green-400">{t('location.replyValue')}</span>
              </div>
            </div>

          </motion.div>

          {/* Switchable Info Card */}
          <motion.div
            initial={canUseAmbientMotion ? { opacity: 0, y: 10 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="hidden md:flex md:flex-col bg-[#111] border border-white/5 px-4 py-2 rounded-2xl group/card hover:border-white/10 transition-colors h-[87px] relative overflow-hidden"
          >
            {/* Navigation Arrows - appear on hover */}
            <button
              onClick={() => setActiveInfoCard((prev) => (prev === 0 ? 2 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-white/20 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveInfoCard((prev) => (prev === 2 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-white/20 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Content based on active card */}
            <div className="flex-1 flex items-center overflow-hidden">
              {activeInfoCard === 0 && (
                /* GitHub Activity - 4 weeks grid */
                <div className="flex items-center gap-3 w-full">
                  <Github className="w-5 h-5 text-gray-400 shrink-0" />
                  <div className="flex-1">
                    <div className="grid grid-cols-7 gap-0.5">
                      {(githubData.levels.length >= 28 ? githubData.levels : Array(28).fill(0)).map((level, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm ${level === 3 ? 'bg-green-500'
                              : level === 2 ? 'bg-green-500/50'
                                : level === 1 ? 'bg-green-500/20'
                                  : 'bg-white/10'
                            }`}
                          title={`Day ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-white font-medium">
                      {githubData.isLoading ? '...' : githubData.total}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {githubData.metric === 'pushCommits' ? t('live.githubMetricCommits') : t('live.githubMetricContributions')}
                    </span>
                  </div>
                </div>
              )}

              {activeInfoCard === 1 && (
                /* Spotify - With artist, progress bar, and open button */
                <div className="flex items-center gap-2 w-full">
                  {spotifyData.albumArt ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={spotifyData.albumArt}
                      alt="Album art"
                      className="w-10 h-10 rounded shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                      <Music className={`w-5 h-5 ${spotifyData.isPlaying ? 'text-green-500' : 'text-gray-400'}`} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {spotifyData.url ? (
                      <a
                        href={spotifyData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 group/title"
                      >
                        <p className="text-white text-xs font-medium truncate group-hover/title:text-white/80 group-hover/title:underline transition-colors">
                          {spotifyData.isLoading ? t('live.spotifyLoading') : spotifyTitle}
                        </p>
                        <ExternalLink className="w-3 h-3 text-white shrink-0 group-hover/title:text-white/80 transition-colors" />
                      </a>
                    ) : (
                      <p className="text-white text-xs font-medium truncate">
                        {spotifyData.isLoading ? t('live.spotifyLoading') : spotifyTitle}
                      </p>
                    )}
                    {spotifyData.artist && (
                      <p className="text-gray-500 text-[10px] truncate">{spotifyData.artist}</p>
                    )}
                    {spotifyData.progressMs !== null && spotifyData.durationMs && (
                      <SpotifyProgress
                        isPlaying={spotifyData.isPlaying}
                        progressMs={spotifyData.progressMs}
                        durationMs={spotifyData.durationMs}
                        progressUpdatedAt={spotifyData.progressUpdatedAt}
                      />
                    )}
                  </div>
                </div>
              )}

              {activeInfoCard === 2 && (
                /* Availability - Enhanced */
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{t('live.nextAvailable')}</p>
                    <p className="text-white text-sm font-medium">
                      {availabilityData.isLoading ? t('live.spotifyLoading') : availabilityData.nextAvailable}
                    </p>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-green-500/20 shrink-0">
                    <span className="text-[10px] text-green-400 font-medium">{t('live.open')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Dots - Centered at bottom */}
            <div className="flex justify-center gap-1.5 mt-1">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveInfoCard(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${activeInfoCard === i ? 'bg-accent' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
