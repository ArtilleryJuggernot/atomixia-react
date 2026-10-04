import { useEffect, useState, type FocusEvent, type KeyboardEvent } from 'react';
import type { Illustration } from '../../lib/illustrations';

type Props = {
  slides: Illustration[];
  label: string;
};

export default function IllustrationCarousel({ slides, label }: Props) {
  const [index, setIndex] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [hoverPause, setHoverPause] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || manualPause || hoverPause) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [count, manualPause, hoverPause]);

  function go(next: number) {
    setIndex((next + count) % count);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index - 1);
    }
  }

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
      onFocus={() => setHoverPause(true)}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setHoverPause(false);
      }}
    >
      <div className="carousel-frame">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          return (
            <figure
              key={slide.id}
              className={active ? 'carousel-slide is-active' : 'carousel-slide'}
              aria-hidden={active ? undefined : true}
            >
              <img
                src={slide.src}
                srcSet={slide.srcSet}
                sizes="(min-width: 1024px) 40rem, 100vw"
                alt={active ? slide.alt : ''}
                width={1400}
                height={1050}
                decoding={slideIndex === 0 ? 'sync' : 'async'}
                fetchPriority={slideIndex === 0 ? 'high' : 'low'}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
              />
              <figcaption>
                <span className="meta text-cyan-flux">{slide.kicker}</span>
                <span className="carousel-title">{slide.title}</span>
              </figcaption>
            </figure>
          );
        })}
        <button
          type="button"
          className="carousel-pause"
          aria-pressed={manualPause}
          aria-label={manualPause ? 'Reprendre le défilement' : 'Mettre le défilement en pause'}
          onClick={() => setManualPause((value) => !value)}
        >
          {manualPause ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6v12l10-6z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 6v12M16 6v12" />
            </svg>
          )}
        </button>
      </div>
      <div className="carousel-bar">
        <button type="button" className="carousel-nav" aria-label="Image précédente" onClick={() => go(index - 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
        <ul className="carousel-thumbs">
          {slides.map((slide, slideIndex) => (
            <li key={slide.id}>
              <button
                type="button"
                className={slideIndex === index ? 'is-active' : undefined}
                aria-label={slide.title}
                aria-current={slideIndex === index ? 'true' : undefined}
                onClick={() => go(slideIndex)}
              >
                <img src={slide.thumb} alt="" width={720} height={540} />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="carousel-nav" aria-label="Image suivante" onClick={() => go(index + 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
