'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type PerformanceMode = 'full' | 'balanced' | 'lite';

export interface PerformanceProfile {
  mode: PerformanceMode;
  isHydrated: boolean;
  isVisible: boolean;
  isFinePointer: boolean;
  isCoarsePointer: boolean;
  shouldReduceMotion: boolean;
  isSaveData: boolean;
  isLowPowerDevice: boolean;
  canUseAmbientMotion: boolean;
  canUseHeavyVisuals: boolean;
  canUsePointerEffects: boolean;
  canUseSmoothScroll: boolean;
  maxDpr: number;
  particleCount: number;
  globeSamples: number;
}

type NetworkInformationLike = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: EventTarget['addEventListener'];
  removeEventListener?: EventTarget['removeEventListener'];
};

type NavigatorWithPerformanceHints = Navigator & {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
};

const DEFAULT_PROFILE: PerformanceProfile = {
  mode: 'lite',
  isHydrated: false,
  isVisible: true,
  isFinePointer: false,
  isCoarsePointer: true,
  shouldReduceMotion: true,
  isSaveData: false,
  isLowPowerDevice: true,
  canUseAmbientMotion: false,
  canUseHeavyVisuals: false,
  canUsePointerEffects: false,
  canUseSmoothScroll: false,
  maxDpr: 1,
  particleCount: 0,
  globeSamples: 1200,
};

const PerformanceContext = createContext<PerformanceProfile>(DEFAULT_PROFILE);

function mediaMatches(query: string) {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

function getConnection() {
  return (navigator as NavigatorWithPerformanceHints).connection;
}

function readPerformanceProfile(): PerformanceProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_PROFILE;
  }

  const nav = navigator as NavigatorWithPerformanceHints;
  const isVisible = document.visibilityState !== 'hidden';
  const isFinePointer = mediaMatches('(hover: hover) and (pointer: fine)');
  const isCoarsePointer = mediaMatches('(hover: none), (pointer: coarse)');
  const shouldReduceMotion = mediaMatches('(prefers-reduced-motion: reduce)');
  const isNarrowViewport = mediaMatches('(max-width: 767px)');
  const connection = getConnection();
  const effectiveType = connection?.effectiveType ?? '';
  const isSaveData = Boolean(connection?.saveData || /(^|-)2g$/.test(effectiveType));
  const lowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const isLowPowerDevice = lowCpu || lowMemory;

  let mode: PerformanceMode = 'balanced';
  if (
    shouldReduceMotion ||
    isSaveData ||
    isNarrowViewport ||
    isCoarsePointer ||
    isLowPowerDevice
  ) {
    mode = 'lite';
  } else if (
    isFinePointer &&
    (nav.hardwareConcurrency ?? 0) >= 8 &&
    (nav.deviceMemory ?? 8) >= 6
  ) {
    mode = 'full';
  }

  const canUseAmbientMotion = isVisible && !shouldReduceMotion && mode !== 'lite';
  const canUseHeavyVisuals = canUseAmbientMotion && mode !== 'lite';
  const canUsePointerEffects = canUseAmbientMotion && mode === 'full' && isFinePointer;
  const canUseSmoothScroll = canUseAmbientMotion && mode !== 'lite' && isFinePointer;

  return {
    mode,
    isHydrated: true,
    isVisible,
    isFinePointer,
    isCoarsePointer,
    shouldReduceMotion,
    isSaveData,
    isLowPowerDevice,
    canUseAmbientMotion,
    canUseHeavyVisuals,
    canUsePointerEffects,
    canUseSmoothScroll,
    maxDpr: mode === 'full' ? 1.5 : mode === 'balanced' ? 1.15 : 1,
    particleCount: mode === 'full' ? 900 : mode === 'balanced' ? 420 : 0,
    globeSamples: mode === 'full' ? 9000 : mode === 'balanced' ? 5200 : 1200,
  };
}

function observeMedia(query: string, update: () => void) {
  const media = window.matchMedia(query);
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }

  media.addListener(update);
  return () => media.removeListener(update);
}

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PerformanceProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setProfile(readPerformanceProfile()));
    };

    update();

    const cleanupMedia = [
      observeMedia('(hover: hover) and (pointer: fine)', update),
      observeMedia('(hover: none), (pointer: coarse)', update),
      observeMedia('(prefers-reduced-motion: reduce)', update),
      observeMedia('(max-width: 767px)', update),
    ];

    const connection = getConnection();
    connection?.addEventListener?.('change', update);
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('pageshow', update);
    document.addEventListener('visibilitychange', update);

    return () => {
      cancelAnimationFrame(frame);
      cleanupMedia.forEach((cleanup) => cleanup());
      connection?.removeEventListener?.('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('pageshow', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.performanceMode = profile.mode;
    root.dataset.reducedMotion = String(profile.shouldReduceMotion);
    root.dataset.cursorEffects = String(profile.canUsePointerEffects);
  }, [profile]);

  const value = useMemo(() => profile, [profile]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceMode() {
  return useContext(PerformanceContext);
}
