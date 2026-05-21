'use client';

import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(() => import('@/components/ui/ParticlesBackground'), { ssr: false });
const NeuralCursor = dynamic(() => import('@/components/ui/NeuralCursor'), { ssr: false });
const MuteButton = dynamic(() => import('@/components/ui/MuteButton'), { ssr: false });
const GameWrapper = dynamic(() => import('@/components/layout/GameWrapper'), { ssr: false });
const StoryLine = dynamic(() => import('@/components/ui/StoryLine'), { ssr: false });

export default function VisualEffects() {
  return (
    <>
      <ParticlesBackground />
      <NeuralCursor />
      <MuteButton />
      <GameWrapper />
      <StoryLine />
    </>
  );
}
