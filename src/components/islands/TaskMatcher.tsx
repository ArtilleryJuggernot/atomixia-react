import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { automations, type AutomationIcon } from '../../lib/tasks';

const DWELL = 5600;

const glyphs: Record<AutomationIcon, ReactNode> = {
  mail: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M4 7.5 12 13l8-5.5" />
    </>
  ),
  watch: (
    <>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  meet: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15.2 15.2 5 5" />
    </>
  ),
  send: (
    <>
      <path d="M3.5 11.5 20.5 4l-6.2 16-2.2-6.2L3.5 11.5Z" />
      <path d="M12.1 13.8 20.5 4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19.5V4.5M4 19.5h16" />
      <path d="M8 15.5v-4M12 15.5V8M16 15.5v-6" />
    </>
  ),
  file: (
    <>
      <path d="M7 3.5h7l5 5V20.5H7z" />
      <path d="M14 3.5V9h5" />
    </>
  ),
  route: (
    <>
      <circle cx="6.5" cy="6.5" r="2" />
      <circle cx="17.5" cy="17.5" r="2" />
      <path d="M8.5 6.5h5a4 4 0 0 1 4 4v5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="2.4" />
      <circle cx="16.2" cy="9" r="1.8" />
      <path d="M4.2 19.2c.7-3 2.8-4.4 4.8-4.4s4.1 1.4 4.8 4.4" />
      <path d="M14 15.4c1.1-.5 2.2-.7 3.3-.7 1.5 0 2.9.9 3.5 2.9" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 8.2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.6a2.1 2.1 0 0 0 0 4.2v1.8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.8a2.1 2.1 0 0 0 0-4.2z" />
      <path d="M12 7.2v9.6" />
    </>
  ),
};

function Glyph({ name }: { name: AutomationIcon }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {glyphs[name]}
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

export default function TaskMatcher() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [motion, setMotion] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const current = automations[index] ?? automations[0];
  const playing = motion && !paused && !held && !hidden;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMotion(!query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % automations.length);
    }, DWELL);
    return () => window.clearInterval(id);
  }, [playing, index]);

  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLLIElement>(`[data-index="${index}"]`);
    if (!list || !item) return;
    const top = item.offsetTop - (list.clientHeight - item.offsetHeight) / 2;
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    list.scrollTo({
      top: Math.max(0, top),
      left: Math.max(0, left),
      behavior: motion ? 'smooth' : 'auto',
    });
  }, [index, motion]);

  function hold(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') setHeld(true);
  }

  return (
    <div
      className={playing ? 'task-board is-playing' : 'task-board'}
      onPointerEnter={hold}
      onPointerLeave={() => setHeld(false)}
    >
      <div className="task-toolbar">
        <p className="meta text-cyan-flux">Sélection</p>
        <p className="task-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
          <span> / {String(automations.length).padStart(2, '0')}</span>
        </p>
        {motion && (
          <button
            type="button"
            className="task-play"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? 'Reprendre' : 'Pause'}
          </button>
        )}
        <p className="sr-only">
          {playing
            ? 'Le parcours défile tout seul. Le survol ou Pause l’arrête.'
            : 'Le défilement est arrêté. Choisissez une automatisation.'}
        </p>
      </div>
      <ul ref={listRef} className="task-picks" aria-label="Automatisations">
        {automations.map((item, itemIndex) => {
          const active = itemIndex === index;
          return (
            <li key={item.id} data-index={itemIndex}>
              <button
                type="button"
                className="task-pick"
                aria-pressed={active}
                aria-controls="parcours-automatisation"
                onClick={() => setIndex(itemIndex)}
              >
                <span className="task-pick-ico">
                  <Glyph name={item.icon} />
                </span>
                <span>
                  <span className="task-pick-label">{item.label}</span>
                  <span className="task-pick-blurb">{item.blurb}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div id="parcours-automatisation" className="stage-panel task-stage" key={current.id}>
        <div className="task-stage-head">
          <span className="task-pick-ico">
            <Glyph name={current.icon} />
          </span>
          <div>
            <p className="meta text-cyan-flux">{current.label}</p>
            <p className="display task-stage-title" aria-live="polite">
              {current.match.title}
            </p>
          </div>
        </div>
        <ol className="task-flow">
          {current.match.steps.map((step, stepIndex) => (
            <li key={step.label} className="task-step">
              <span className="task-step-mark">
                <Check />
                <span className="sr-only">Étape {stepIndex + 1}</span>
              </span>
              <span>
                <span className="task-step-label">{step.label}</span>
                <span className="task-step-detail">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="stage-result">{current.match.result}</p>
        <p className="task-hold">
          <span className="task-hold-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4.5l2.5 1.5" />
            </svg>
          </span>
          <span>{current.match.hold}</span>
        </p>
        <a className="btn btn-flux task-cta" href={`/contact?tache=${encodeURIComponent(current.label)}`}>
          Parler de cette automatisation
        </a>
        <div className="task-dwell-track" aria-hidden="true">
          <span className="task-dwell" />
        </div>
      </div>
    </div>
  );
}
