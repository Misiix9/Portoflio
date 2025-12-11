'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useSoundEffects } from '@/components/providers/SoundProvider';
import { motion } from 'framer-motion';

export default function MuteButton() {
  const { isMuted, toggleMute } = useSoundEffects();

  return (
    <motion.button
      onClick={toggleMute}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
      title={isMuted ? "Unmute Sound" : "Mute Sound"}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </motion.button>
  );
}
