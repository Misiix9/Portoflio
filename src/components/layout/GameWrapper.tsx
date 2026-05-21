'use client';

import dynamic from 'next/dynamic';
import { useKonamiCode } from '@/hooks/useKonamiCode';

const GameOverlay = dynamic(() => import('@/components/ui/GameOverlay'), { ssr: false });

export default function GameWrapper() {
  const { triggered, setTriggered } = useKonamiCode();

  if (!triggered) {
    return null;
  }
  
  return (
    <GameOverlay 
      isOpen={triggered} 
      onClose={() => setTriggered(false)} 
    />
  );
}
