'use client';

import { useKonamiCode } from '@/hooks/useKonamiCode';
import GameOverlay from '@/components/ui/GameOverlay';

export default function GameWrapper() {
  const { triggered, setTriggered } = useKonamiCode();
  
  return (
    <GameOverlay 
      isOpen={triggered} 
      onClose={() => setTriggered(false)} 
    />
  );
}
