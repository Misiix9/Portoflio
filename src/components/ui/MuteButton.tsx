'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useSoundEffects } from '@/components/providers/SoundProvider';

export default function MuteButton() {
  const { isMuted, toggleMute } = useSoundEffects();

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white transition-colors hover:bg-white/10 active:scale-95"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      title={isMuted ? "Unmute Sound" : "Mute Sound"}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
