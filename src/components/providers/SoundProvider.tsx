'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import useSound from 'use-sound';

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
  
  const [playHoverSfx] = useSound(HOVER_SOUND, { volume: 0.1, soundEnabled: !isMuted });
  const [playClickSfx] = useSound(CLICK_SOUND, { volume: 0.1, soundEnabled: !isMuted });

  const playClick = useCallback(() => {
    if (!isMuted) {
      // Small random pitch variation for realism
      playClickSfx({ playbackRate: 0.95 + Math.random() * 0.1 });
    }
  }, [isMuted, playClickSfx]);

  const playHover = useCallback(() => {
    if (!isMuted) playHoverSfx();
  }, [isMuted, playHoverSfx]);

  // Global Click Listener
  useEffect(() => {
    const handleGlobalClick = () => {
      playClick();
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [playClick]);

  const toggleMute = useCallback(() => setIsMuted((current) => !current), []);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playHover, playClick }}>
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
