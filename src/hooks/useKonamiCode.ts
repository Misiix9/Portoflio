import { useEffect, useRef, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export function useKonamiCode() {
  const [triggered, setTriggered] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === KONAMI_CODE[indexRef.current]) {
        const nextIndex = indexRef.current + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setTriggered(true);
          indexRef.current = 0;
        } else {
          indexRef.current = nextIndex;
        }
      } else {
        indexRef.current = 0;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return { triggered, setTriggered };
}
