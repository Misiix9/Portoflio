'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Local sound files
const HOVER_SOUND = '/sounds/click.mp3';
const CLICK_SOUND = '/sounds/click.mp3'; // User provided file

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback((kind: 'click' | 'hover') => {
    if (typeof window === 'undefined') return null;

    const ref = kind === 'click' ? clickAudioRef : hoverAudioRef;
    if (!ref.current) {
      const audio = new Audio(kind === 'click' ? CLICK_SOUND : HOVER_SOUND);
      audio.preload = 'auto';
      audio.volume = 0.1;
      ref.current = audio;
    }

    return ref.current;
  }, []);

  const playClick = useCallback(() => {
    if (!isMuted) {
      const audio = getAudio('click');
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
      audio.playbackRate = 0.95 + Math.random() * 0.1;
      void audio.play().catch(() => {});
    }
  }, [getAudio, isMuted]);

  const playHover = useCallback(() => {
    if (!isMuted) {
      const audio = getAudio('hover');
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    }
  }, [getAudio, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((current) => {
      if (current) {
        getAudio('click')?.load();
        getAudio('hover')?.load();
      }
      return !current;
    });
  }, [getAudio]);

  useEffect(() => {
    if (isMuted) return;

    window.addEventListener('click', playClick);
    return () => window.removeEventListener('click', playClick);
  }, [isMuted, playClick]);

  const value = useMemo(
    () => ({ isMuted, toggleMute, playHover, playClick }),
    [isMuted, playClick, playHover, toggleMute],
  );

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSoundEffects = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundEffects must be used within a SoundProvider');
  }
  return context;
};
