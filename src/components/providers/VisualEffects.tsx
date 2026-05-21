'use client';

import dynamic from 'next/dynamic';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

const ParticlesBackground = dynamic(() => import('@/components/ui/ParticlesBackground'), { ssr: false });
const NeuralCursor = dynamic(() => import('@/components/ui/NeuralCursor'), { ssr: false });
const MuteButton = dynamic(() => import('@/components/ui/MuteButton'), { ssr: false });
const GameWrapper = dynamic(() => import('@/components/layout/GameWrapper'), { ssr: false });
const StoryLine = dynamic(() => import('@/components/ui/StoryLine'), { ssr: false });

export default function VisualEffects() {
  const { canUseHeavyVisuals, canUsePointerEffects, mode } = usePerformanceMode();

  return (
    <>
      <MuteButton />
      <GameWrapper />
      {canUseHeavyVisuals ? <ParticlesBackground /> : null}
      {canUsePointerEffects ? <NeuralCursor /> : null}
      {mode === 'full' ? <StoryLine /> : null}
    </>
  );
}
