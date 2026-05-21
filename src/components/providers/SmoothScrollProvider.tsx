'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

const LenisRoot = dynamic(() => import('@/components/providers/LenisRoot'), { ssr: false });

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { canUseSmoothScroll } = usePerformanceMode();

  if (!canUseSmoothScroll) {
    return <>{children}</>;
  }

  return <LenisRoot>{children}</LenisRoot>;
}
