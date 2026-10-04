import { useEffect, useState } from 'react';

export default function PhraseCycle({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [phrases]);

  return (
    <span className="phrase-swap" key={phrases[index]} aria-hidden="true">
      {phrases[index]}
    </span>
  );
}
