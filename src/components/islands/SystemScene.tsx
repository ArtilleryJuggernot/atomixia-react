import { useEffect, useState } from 'react';
import SystemField from './SystemField';

type Phase = 'wait' | 'run' | 'ok' | 'hold';
type IconName = 'mail' | 'file' | 'user' | 'spark' | 'invoice' | 'gate';

const steps = [
  {
    id: 'received',
    kicker: '01',
    label: 'Demande reçue',
    note: 'Un message entre dans la file. Rien n’est envoyé.',
  },
  {
    id: 'attached',
    kicker: '02',
    label: 'Pièce lue',
    note: 'Le document joint est rapproché du message.',
  },
  {
    id: 'retrieved',
    kicker: '03',
    label: 'Fiche retrouvée',
    note: 'Les données déjà présentes sont rapprochées.',
  },
  {
    id: 'prepared',
    kicker: '04',
    label: 'Dossier préparé',
    note: 'L’agent rassemble. Il ne décide pas à la place d’une personne.',
  },
  {
    id: 'draft',
    kicker: '05',
    label: 'Brouillon prêt',
    note: 'Un brouillon de facture apparaît. Il n’est pas émis.',
  },
  {
    id: 'validation',
    kicker: '06',
    label: 'Validation affichée',
    note: 'Une personne doit confirmer avant toute suite.',
  },
] as const;

const nodes: {
  id: string;
  kicker: string;
  title: string;
  x: string;
  icon: IconName;
  edge: string;
  reveal: number;
  done: number | null;
  hold: boolean;
  runLabel: string;
  okLabel: string;
}[] = [
  {
    id: 'mail',
    kicker: 'E-mail',
    title: 'Demande entrante',
    x: 'node-mail',
    icon: 'mail',
    edge: 'mail-core',
    reveal: 0,
    done: 1,
    hold: false,
    runLabel: 'Dans la file',
    okLabel: 'Reçue',
  },
  {
    id: 'request',
    kicker: 'Pièce',
    title: 'Document joint',
    x: 'node-request',
    icon: 'file',
    edge: 'request-core',
    reveal: 1,
    done: 2,
    hold: false,
    runLabel: 'Jointe',
    okLabel: 'Lue',
  },
  {
    id: 'crm',
    kicker: 'Client',
    title: 'Fiche existante',
    x: 'node-crm',
    icon: 'user',
    edge: 'crm-core',
    reveal: 2,
    done: 3,
    hold: false,
    runLabel: 'Recherche',
    okLabel: 'Retrouvée',
  },
  {
    id: 'agent',
    kicker: 'Agent',
    title: 'Prépare le dossier',
    x: 'node-agent',
    icon: 'spark',
    edge: 'agent-core',
    reveal: 3,
    done: 4,
    hold: false,
    runLabel: 'En cours',
    okLabel: 'Dossier prêt',
  },
  {
    id: 'invoice',
    kicker: 'Facture',
    title: 'Brouillon simulé',
    x: 'node-invoice',
    icon: 'invoice',
    edge: 'invoice-core',
    reveal: 4,
    done: 5,
    hold: false,
    runLabel: 'Simulation',
    okLabel: 'Non émise',
  },
  {
    id: 'output',
    kicker: 'Sortie',
    title: 'À valider',
    x: 'node-output',
    icon: 'gate',
    edge: 'output-core',
    reveal: 5,
    done: null,
    hold: true,
    runLabel: 'En attente',
    okLabel: 'Décision humaine',
  },
];

const edges = [
  { id: 'mail-core', d: 'M22 16 C34 18 42 30 50 42' },
  { id: 'request-core', d: 'M18 38 C32 38 40 40 50 42' },
  { id: 'crm-core', d: 'M22 58 C34 54 42 48 50 42' },
  { id: 'agent-core', d: 'M82 16 C68 20 58 30 50 42' },
  { id: 'invoice-core', d: 'M82 38 C68 38 58 40 50 42' },
  { id: 'output-core', d: 'M78 58 C66 52 58 48 50 42' },
] as const;

function phaseOf(node: (typeof nodes)[number], step: number): Phase {
  if (step < node.reveal) return 'wait';
  if (node.hold) return 'hold';
  if (node.done !== null && step >= node.done) return 'ok';
  return 'run';
}

function Glyph({ name }: { name: IconName }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (name === 'mail') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (name === 'file') {
    return (
      <svg {...common}>
        <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" />
        <path d="M14 3.5V8h4.5" />
        <path d="M8.5 12.5h7" />
        <path d="M8.5 16h5" />
      </svg>
    );
  }
  if (name === 'user') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 19.5c1.2-3 3.5-4.5 6.5-4.5s5.3 1.5 6.5 4.5" />
      </svg>
    );
  }
  if (name === 'spark') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3.5v3" />
        <path d="M12 17.5v3" />
        <path d="M3.5 12h3" />
        <path d="M17.5 12h3" />
        <path d="m6 6 2 2" />
        <path d="m16 16 2 2" />
        <path d="m18 6-2 2" />
        <path d="m8 16-2 2" />
      </svg>
    );
  }
  if (name === 'invoice') {
    return (
      <svg {...common}>
        <path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15L16 18l-2.2 2-2.3-2L9 20l-2.5-2V5A1.5 1.5 0 0 1 8 3.5Z" />
        <path d="M9 8.5h6" />
        <path d="M9 12h6" />
        <path d="M9 15.5h3.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8v4.2l2.6 1.6" />
    </svg>
  );
}

function Mark({ phase }: { phase: Phase }) {
  if (phase === 'ok') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.2 8.3 6.4 11.4 12.8 4.6" />
      </svg>
    );
  }
  if (phase === 'hold') {
    return <span className="system-hold" />;
  }
  if (phase === 'run') {
    return <span className="system-pulse" />;
  }
  return null;
}

export default function SystemScene() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = steps[step];

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(steps.length - 1);
      return;
    }
    const timer = window.setInterval(() => {
      setStep((value) => (value + 1) % steps.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const phases = new Map(nodes.map((node) => [node.edge, phaseOf(node, step)]));

  return (
    <div className="system-stage" data-step={current.id}>
      <SystemField />
      <p className="system-sim meta">Scène simulée · aucun e-mail envoyé · aucune facture émise</p>
      <div className="system-core">
        <span className="orbit" aria-hidden="true">
          <span className="orbit-dot" />
        </span>
        <span className="mark-sheen">
          <img className="system-mark" src="/brand/mark.webp" alt="" width="720" height="474" />
        </span>
      </div>
      <ol className="system-nodes">
        {nodes.map((node) => {
          const phase = phaseOf(node, step);
          const caption = phase === 'ok' || phase === 'hold' ? node.okLabel : node.runLabel;
          return (
            <li key={node.id} className={`${node.x}${phase === 'wait' ? ' is-wait' : ' is-in'}`}>
              <article className="system-node" data-state={phase}>
                <span className="system-ico">
                  <Glyph name={node.icon} />
                </span>
                <span className="system-copy">
                  <p className="meta">{node.kicker}</p>
                  <p className="system-node-title">{node.title}</p>
                  <p className="system-node-state">{caption}</p>
                </span>
                <span className="system-mark" aria-hidden="true">
                  <Mark phase={phase} />
                </span>
              </article>
            </li>
          );
        })}
      </ol>
      <svg className="system-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {edges.map((edge) => (
          <path key={edge.id} d={edge.d} data-state={phases.get(edge.id) ?? 'wait'} />
        ))}
      </svg>
      <div className="system-status" aria-live="polite">
        <p className="meta text-cyan-flux">
          {current.kicker} / 0{steps.length}
        </p>
        <p className="system-status-label">{current.label}</p>
        <p className="system-note">{current.note}</p>
        <ol className="system-rail" aria-label="Étapes de la scène">
          {steps.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={index === step ? 'is-on' : index < step ? 'is-done' : undefined}
                aria-pressed={index === step}
                aria-label={item.label}
                data-cursor={item.kicker}
                onClick={() => {
                  setPaused(true);
                  setStep(index);
                }}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="system-pause"
          aria-pressed={paused}
          data-cursor={paused ? 'Lire' : 'Pause'}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? 'Reprendre' : 'Pause'}
        </button>
      </div>
      <p className="sr-only">
        {current.label}. {current.note} Démonstration simulée : aucune donnée réelle n’est traitée.
      </p>
    </div>
  );
}
