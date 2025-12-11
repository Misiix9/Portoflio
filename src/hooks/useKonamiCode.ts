import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export function useKonamiCode() {
  const [triggered, setTriggered] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === KONAMI_CODE[index]) {
        const nextIndex = index + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setTriggered(true);
          setIndex(0);
        } else {
          setIndex(nextIndex);
        }
      } else {
        setIndex(0);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index]);

  return { triggered, setTriggered };
}
