'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSound from 'use-sound';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Short placeholder sounds (base64 or URLs would ideally be used here).
// For now, we'll try to use a simple online URL if possible, or just setup the structure.
// NOTE: use-sound requires actual audio files. 
// I will use a placeholder URL for a "pop" sound.
// Local sound files
const HOVER_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; // Keep hover as is for now
const CLICK_SOUND = '/sounds/click.mp3'; // User provided file

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  
  const [playHoverSfx] = useSound(HOVER_SOUND, { volume: 0.1, soundEnabled: !isMuted });
  const [playClickSfx] = useSound(CLICK_SOUND, { volume: 0.1, soundEnabled: !isMuted });

  const playClick = () => {
    if (!isMuted) {
      // Small random pitch variation for realism
      playClickSfx({ playbackRate: 0.95 + Math.random() * 0.1 });
    }
  };

  const playHover = () => {
    if (!isMuted) playHoverSfx();
  };

  // Global Click Listener
  useEffect(() => {
    const handleGlobalClick = () => {
      playClick();
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [isMuted, playClickSfx]); // Re-bind if mute state changes or recreate listener

  const toggleMute = () => setIsMuted(!isMuted);

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
