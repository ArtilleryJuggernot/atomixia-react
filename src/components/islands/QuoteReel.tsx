import { useEffect, useState } from 'react';
import type { StoicQuote } from '../../lib/stoic';

const DWELL = 7500;

export default function QuoteReel({ quotes }: { quotes: StoicQuote[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [motion, setMotion] = useState(true);
  const current = quotes[index] ?? quotes[0];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMotion(!media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!motion || paused || held || quotes.length < 2) return;
    let timer = 0;
    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      if (document.hidden) return;
      timer = window.setInterval(() => {
        setIndex((value) => (value + 1) % quotes.length);
      }, DWELL);
    };
    const onHide = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onHide);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [held, motion, paused, quotes.length]);

  if (!current) return null;

  return (
    <div
      className="quote-reel"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <div className="quote-stack">
        {quotes.map((quote, i) => {
          const on = i === index;
          return (
            <figure className={on ? 'quote-band is-on' : 'quote-band'} key={quote.text} aria-hidden={on ? undefined : true}>
              <span className="geo-diamond" aria-hidden="true" />
              <blockquote>
                <p>« {quote.text} »</p>
              </blockquote>
              <figcaption>
                <span className="meta text-cyan-flux">{quote.author}</span>
                <span className="meta">{quote.work}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {current.text} {current.author}, {current.work}
      </p>
      <div className="quote-reel-nav">
        {motion ? (
          <button
            type="button"
            className="quote-play"
            aria-pressed={paused}
            data-cursor={paused ? 'Lire' : 'Pause'}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? 'Lecture' : 'Pause'}
          </button>
        ) : null}
        <div className="quote-dots" role="group" aria-label="Choisir une citation">
          {quotes.map((quote, i) => (
            <button
              key={quote.text}
              type="button"
              className="quote-dot"
              aria-label={`${quote.author}, ${quote.work}`}
              aria-pressed={i === index}
              data-cursor={quote.author}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
