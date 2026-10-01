import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function HeroStage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        root.current?.classList.add('is-shown');
        return;
      }
      const mark = root.current?.querySelector('.hero-mark');
      const glow = root.current?.querySelector('.hero-glow');
      const sweep = root.current?.querySelector('.hero-sweep');
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(mark, { y: 36, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.15 })
        .fromTo(sweep, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, '-=0.45')
        .fromTo(glow, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, '-=0.9');
      gsap.to(glow, {
        scale: 1.06,
        opacity: 0.72,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="hero-stage relative mx-auto w-full max-w-xl">
      <div className="hero-glow pointer-events-none absolute inset-[8%_6%_18%] rounded-full" aria-hidden="true" />
      <img
        className="hero-mark relative z-10 h-auto w-full"
        src="/brand/lockup.webp"
        alt="Atomixia. Intelligence, automatiser, impact."
        width="1242"
        height="871"
      />
      <div className="hero-sweep relative z-10 mt-2 h-px w-full origin-left" aria-hidden="true" />
    </div>
  );
}
