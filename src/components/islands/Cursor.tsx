import { useEffect, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], summary, label, [data-cursor]';
const TEXT = 'input, textarea, select, [contenteditable="true"]';

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches && window.matchMedia('(hover: hover)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = document.querySelector<HTMLElement>('.cursor-dot');
    const ring = document.querySelector<HTMLElement>('.cursor-ring');
    const label = document.querySelector<HTMLElement>('.cursor-label');
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add('has-cursor');

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let frame = 0;
    let moving = false;

    const tick = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      if (Math.abs(x - ringX) + Math.abs(y - ringY) < 0.2) {
        moving = false;
        frame = 0;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      dot.classList.remove('is-out');
      ring.classList.remove('is-out');
      if (!moving) {
        moving = true;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const text = target.closest(TEXT);
      dot.classList.toggle('is-text', Boolean(text));
      ring.classList.toggle('is-text', Boolean(text));
      const interactive = target.closest<HTMLElement>(INTERACTIVE);
      ring.classList.toggle('is-hover', Boolean(interactive));
      const named = target.closest<HTMLElement>('[data-cursor]');
      const value = named?.dataset.cursor ?? '';
      label.textContent = value;
      ring.classList.toggle('has-label', value.length > 0);
    };

    const onOut = (event: MouseEvent) => {
      if (event.relatedTarget) return;
      dot.classList.add('is-out');
      ring.classList.add('is-out');
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-dot is-out" aria-hidden="true" />
      <div className="cursor-ring is-out" aria-hidden="true">
        <span className="cursor-label" />
      </div>
    </>
  );
}
