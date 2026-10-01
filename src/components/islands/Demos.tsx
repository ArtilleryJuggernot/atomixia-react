import { useState, type KeyboardEvent } from 'react';

export type DemoScene = {
  id: string;
  order: number;
  layout: 'citation' | 'letter' | 'timeline' | 'ledger';
  kicker: string;
  title: string;
  href: string;
  sourceLabel: string;
  source: string;
  outputLabel: string;
  output: string[];
  hold: string;
};

function Source({ demo }: { demo: DemoScene }) {
  if (demo.layout === 'citation') {
    return <p className="editorial text-[clamp(1.45rem,2vw,1.9rem)]">{demo.source}</p>;
  }
  if (demo.layout === 'letter') {
    return <p className="glass max-w-xl p-5 text-[0.98rem] leading-relaxed text-parchment-dim">{demo.source}</p>;
  }
  if (demo.layout === 'timeline') {
    return (
      <div>
        <p className="font-display text-5xl tracking-tight text-gold-300">J+12</p>
        <p className="mt-4 max-w-md text-parchment-dim">{demo.source}</p>
      </div>
    );
  }
  return (
    <p className="border-l border-gold-500/50 pl-4 text-parchment-dim">{demo.source}</p>
  );
}

function Scene({ demo }: { demo: DemoScene }) {
  const [step, setStep] = useState(0);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? step + 1 : step - 1;
    const bounded = (next + demo.output.length) % demo.output.length;
    setStep(bounded);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
    buttons[bounded]?.focus();
  };

  return (
    <article className="grid gap-8 border-t border-parchment/10 py-12 lg:grid-cols-12" aria-labelledby={`demo-${demo.id}`}>
      <div className={demo.order % 2 === 0 ? 'lg:col-span-5 lg:col-start-8 lg:row-start-1' : 'lg:col-span-5'}>
        <p className="meta">
          {String(demo.order).padStart(2, '0')} — {demo.kicker}
        </p>
        <h3 id={`demo-${demo.id}`} className="display mt-3 text-3xl sm:text-4xl">
          {demo.title}
        </h3>
        <div className="demo-rule mt-5 w-24" />
        <p className="meta mt-6">{demo.sourceLabel}</p>
        <div className="mt-3">
          <Source demo={demo} />
        </div>
      </div>
      <div className={demo.order % 2 === 0 ? 'lg:col-span-6 lg:col-start-1 lg:row-start-1' : 'lg:col-span-6 lg:col-start-7'}>
        <p className="meta">{demo.outputLabel}</p>
        <div role="group" aria-label={`Étapes de ${demo.title}`} className="mt-4 space-y-2" onKeyDown={onKeyDown}>
          {demo.output.map((line, index) => {
            const current = step === index;
            return (
              <button
                key={line}
                type="button"
                aria-current={current ? 'step' : undefined}
                onClick={() => setStep(index)}
                className={`flex w-full gap-4 border px-4 py-3 text-left ${
                  current ? 'border-cyan-flux/70 text-parchment' : 'border-parchment/10 text-parchment-dim'
                }`}
              >
                <span className="meta mt-1 text-gold-400">{String(index + 1).padStart(2, '0')}</span>
                <span>{line}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-sm text-parchment">{demo.hold}</p>
        <a href={demo.href} className="mt-4 inline-flex text-sm text-gold-300 underline decoration-gold-500/40 underline-offset-4">
          L’agent {demo.kicker.toLowerCase()}
        </a>
      </div>
    </article>
  );
}

export default function Demos({ scenes }: { scenes: DemoScene[] }) {
  return (
    <div>
      {scenes.map((scene) => (
        <Scene key={scene.id} demo={scene} />
      ))}
    </div>
  );
}
