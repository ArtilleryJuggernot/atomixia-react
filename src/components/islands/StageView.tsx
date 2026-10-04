import { useState, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export type UsageCase = {
  id: string;
  order: number;
  featured: boolean;
  family: string;
  title: string;
  pain: string;
  kind: 'inbox' | 'pipeline' | 'watch' | 'question' | 'timeline' | 'brief' | 'status';
  intake: string[];
  logs: string[];
  buckets?: { label: string; count: string; tone: string }[];
  highlights?: string[];
  lines?: string[];
  sources?: string[];
  question?: string;
  beats?: { at: string; text: string }[];
  meters?: { label: string; value: string }[];
  result: string;
  hold: string;
};

function prefersReduce() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function CountUp({ value, active }: { value: string; active: boolean }) {
  const numeric = Number(value.replace(/\s/g, ''));
  const [shown, setShown] = useState(value);

  useGSAP(
    () => {
      if (!Number.isFinite(numeric) || !active) return;
      if (prefersReduce()) {
        setShown(value);
        return;
      }
      const proxy = { n: 0 };
      setShown('0');
      const tween = gsap.to(proxy, {
        n: numeric,
        duration: 0.7,
        ease: 'power2.out',
        onUpdate: () => setShown(String(Math.round(proxy.n))),
      });
      return () => tween.kill();
    },
    { dependencies: [value, active] },
  );

  return <>{shown}</>;
}

function useSequence(playKey: string, total: number) {
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        setStep(total - 1);
        return;
      }
      setStep(0);
      const timeline = gsap.timeline();
      for (let index = 1; index < total; index += 1) {
        timeline.call(() => setStep(index), [], '+=0.8');
      }
      return () => timeline.kill();
    },
    { dependencies: [playKey, total], revertOnUpdate: true },
  );

  return step;
}

function Reveal({ at, step, children }: { at: number; step: number; children: ReactNode }) {
  const on = step >= at;
  return (
    <div className={on ? 'stage-in' : 'stage-out'} aria-hidden={on ? undefined : true}>
      {children}
    </div>
  );
}

function AgentMark({ live }: { live: boolean }) {
  return (
    <div className={`stage-agent ${live ? 'is-live' : 'is-done'}`}>
      <span className="status-dot" aria-hidden="true" />
      <span className="meta">{live ? 'Agent actif' : 'Terminé'}</span>
    </div>
  );
}

function Inbox({ item, step }: { item: UsageCase; step: number }) {
  return (
    <div className="space-y-4">
      <Reveal at={0} step={step}>
        <ul className="space-y-2">
          {item.intake.map((line) => (
            <li key={line} className="stage-chip">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal at={1} step={step}>
        <AgentMark live={step < 3} />
        <ul className="mt-3 space-y-1">
          {item.logs.map((line) => (
            <li key={line} className="stage-log meta text-parchment-dim">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal at={2} step={step}>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(item.buckets ?? []).map((bucket) => (
            <li key={bucket.label} className={`stage-badge tone-${bucket.tone}`}>
              <span className="font-display text-2xl tracking-tight">
                <CountUp value={bucket.count} active={step >= 2} />
              </span>
              <span className="meta">{bucket.label}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal at={3} step={step}>
        <ul className="space-y-2">
          {(item.highlights ?? []).map((line) => (
            <li key={line} className="stage-result">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

function Pipeline({ item, step }: { item: UsageCase; step: number }) {
  return (
    <div className="stage-pipeline grid items-start gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <Reveal at={0} step={step}>
        <ul className="space-y-2">
          {item.intake.map((line) => (
            <li key={line} className="stage-chip">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal at={1} step={step}>
        <div className="flex flex-col items-center gap-3 px-2 py-2">
          <AgentMark live={step < 2} />
          <ul className="space-y-1 text-center">
            {item.logs.map((line) => (
              <li key={line} className="stage-log meta">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal at={2} step={step}>
        <div className="stage-sheet">
          <p className="meta text-cyan-flux">Résultat</p>
          <ul className="mt-3 space-y-2">
            {(item.lines ?? []).map((line) => (
              <li key={line} className="stage-line">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

function Watch({ item, step }: { item: UsageCase; step: number }) {
  const rows = [
    { at: 0, title: 'Sources', body: item.intake.join(' · ') },
    { at: 1, title: 'Analyse', body: item.logs.join(' · ') },
    { at: 2, title: 'Détection', body: (item.lines ?? []).join(' · ') },
  ];
  return (
    <ol className="space-y-3 border-l border-cyan-flux/25 pl-4">
      {rows.map((row) => (
        <li key={row.title} className="stage-node">
          <Reveal at={row.at} step={step}>
            <div className="stage-chip">
              <p className="meta text-cyan-flux">{row.title}</p>
              <p className="mt-1">{row.body}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function Question({ item, step }: { item: UsageCase; step: number }) {
  return (
    <div className="space-y-4">
      <Reveal at={0} step={step}>
        <p className="stage-sheet font-display text-2xl tracking-tight">{item.question}</p>
      </Reveal>
      <Reveal at={1} step={step}>
        <AgentMark live={step < 2} />
        <ul className="mt-3 flex flex-wrap gap-2">
          {item.intake.map((line) => (
            <li key={line} className="stage-chip">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal at={2} step={step}>
        <div className="stage-sheet">
          <ul className="space-y-2">
            {(item.lines ?? []).map((line) => (
              <li key={line} className="stage-line">
                {line}
              </li>
            ))}
          </ul>
          {(item.sources ?? []).length > 0 && (
            <p className="meta mt-4 text-cyan-flux">Sources · {(item.sources ?? []).join(' · ')}</p>
          )}
        </div>
      </Reveal>
    </div>
  );
}

function Timeline({ item, step }: { item: UsageCase; step: number }) {
  return (
    <ol className="space-y-3 border-l border-cyan-flux/30 pl-4">
      {(item.beats ?? []).map((beat, index) => (
        <li key={beat.at}>
          <Reveal at={index} step={step}>
            <p className="meta text-cyan-flux">{beat.at}</p>
            <p className="mt-1">{beat.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function Brief({ item, step }: { item: UsageCase; step: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Reveal at={0} step={step}>
        <ul className="space-y-2">
          {item.intake.map((line) => (
            <li key={line} className="stage-chip">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal at={1} step={step}>
        <AgentMark live={step < 2} />
        <ul className="mt-3 space-y-1">
          {item.logs.map((line) => (
            <li key={line} className="stage-log meta">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal at={2} step={step}>
        <div className="stage-sheet lg:col-span-2">
          <p className="meta text-cyan-flux">Briefing</p>
          <ul className="mt-3 space-y-2">
            {(item.lines ?? []).map((line) => (
              <li key={line} className="stage-line">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

function Status({ item, step }: { item: UsageCase; step: number }) {
  return (
    <div className="space-y-4">
      <Reveal at={0} step={step}>
        <AgentMark live={step < 2} />
      </Reveal>
      <Reveal at={1} step={step}>
        <dl className="grid gap-2 sm:grid-cols-3">
          {(item.meters ?? []).map((meter) => (
            <div key={meter.label} className="stage-badge tone-ok">
              <dt className="meta">{meter.label}</dt>
              <dd className="font-display text-2xl tracking-tight">
                <CountUp value={meter.value} active={step >= 1} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal at={2} step={step}>
        <ul className="space-y-2">
          {(item.highlights ?? []).map((line) => (
            <li key={line} className="stage-result">
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

const STEPS: Record<UsageCase['kind'], number> = {
  inbox: 4,
  pipeline: 3,
  watch: 4,
  question: 3,
  timeline: 3,
  brief: 3,
  status: 3,
};

export default function StageView({ item, playKey }: { item: UsageCase; playKey: string }) {
  const total = item.kind === 'timeline' ? Math.max(item.beats?.length ?? 1, 1) : STEPS[item.kind];
  const step = useSequence(playKey, total);
  const phase = step === 0 ? 'Réception' : step < total - 1 ? 'Agent actif' : 'Terminé';
  const scanning = step > 0 && step < total - 1;
  const log =
    step === 0
      ? 'Réception des éléments'
      : step < total - 1
        ? item.logs[Math.min(step - 1, Math.max(item.logs.length - 1, 0))] ?? 'Analyse en cours'
        : 'Résultat prêt';

  return (
    <div className="stage-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="meta text-cyan-flux">Exemple de fonctionnement</p>
        <p className="stage-phase">{phase}</p>
      </div>
      <div className="stage-rail" aria-hidden="true">
        <span className={`stage-rail-fill n${Math.min(10, Math.max(1, Math.round(((step + 1) / total) * 10)))}`} />
      </div>
      <p className="stage-logline">{log}</p>
      <div className={scanning ? 'is-scanning mt-5' : 'mt-5'}>
        {item.kind === 'inbox' && <Inbox item={item} step={step} />}
        {item.kind === 'pipeline' && <Pipeline item={item} step={step} />}
        {item.kind === 'watch' && <Watch item={item} step={step} />}
        {item.kind === 'question' && <Question item={item} step={step} />}
        {item.kind === 'timeline' && <Timeline item={item} step={step} />}
        {item.kind === 'brief' && <Brief item={item} step={step} />}
        {item.kind === 'status' && <Status item={item} step={step} />}
      </div>
      <Reveal at={total - 1} step={step}>
        <div className="mt-5 border-t border-cyan-flux/20 pt-4" aria-live="polite">
          <p className="text-parchment">{item.result}</p>
          <p className="mt-2 text-sm text-parchment-dim">{item.hold}</p>
        </div>
      </Reveal>
    </div>
  );
}

export function sequenceLength(item: UsageCase): number {
  return item.kind === 'timeline' ? Math.max(item.beats?.length ?? 1, 1) : STEPS[item.kind];
}
