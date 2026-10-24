import { useEffect, useState } from 'react';
import SystemField from './SystemField';

const steps = [
  {
    id: 'received',
    kicker: '01',
    label: 'Demande reçue',
    note: 'Un message entre dans la file. Rien n’est envoyé.',
    hot: ['mail'],
    edges: ['mail-core'],
  },
  {
    id: 'analysed',
    kicker: '02',
    label: 'Information analysée',
    note: 'L’agent lit l’objet et la pièce jointe.',
    hot: ['mail', 'agent'],
    edges: ['mail-core', 'agent-core'],
  },
  {
    id: 'retrieved',
    kicker: '03',
    label: 'Fiche retrouvée',
    note: 'Les données déjà présentes sont rapprochées.',
    hot: ['crm', 'agent'],
    edges: ['crm-core', 'agent-core'],
  },
  {
    id: 'prepared',
    kicker: '04',
    label: 'Document préparé',
    note: 'Un brouillon de facture apparaît. Il n’est pas émis.',
    hot: ['invoice', 'agent'],
    edges: ['invoice-core', 'agent-core'],
  },
  {
    id: 'validation',
    kicker: '05',
    label: 'Validation affichée',
    note: 'Une personne doit confirmer avant toute suite.',
    hot: ['invoice', 'output'],
    edges: ['invoice-core', 'output-core'],
  },
  {
    id: 'queued',
    kicker: '06',
    label: 'Sortie préparée',
    note: 'Le message est prêt. Il reste dans la file.',
    hot: ['mail', 'output'],
    edges: ['mail-core', 'output-core'],
  },
  {
    id: 'done',
    kicker: '07',
    label: 'Tâche préparée',
    note: 'La scène se stabilise. Aucune action réelle n’a eu lieu.',
    hot: ['mail', 'agent', 'crm', 'invoice', 'output', 'request'],
    edges: ['mail-core', 'agent-core', 'crm-core', 'invoice-core', 'output-core', 'request-core'],
  },
] as const;

const nodes = [
  { id: 'mail', kicker: 'E-mail', title: 'Demande entrante', x: 'node-mail' },
  { id: 'request', kicker: 'Pièce', title: 'Document joint', x: 'node-request' },
  { id: 'crm', kicker: 'Client', title: 'Fiche existante', x: 'node-crm' },
  { id: 'agent', kicker: 'Agent', title: 'Prépare le dossier', x: 'node-agent' },
  { id: 'invoice', kicker: 'Facture', title: 'Brouillon simulé', x: 'node-invoice' },
  { id: 'output', kicker: 'Sortie', title: 'À valider', x: 'node-output' },
] as const;

const edges = [
  { id: 'mail-core', d: 'M22 16 C34 18 42 30 50 42' },
  { id: 'request-core', d: 'M18 38 C32 38 40 40 50 42' },
  { id: 'crm-core', d: 'M22 58 C34 54 42 48 50 42' },
  { id: 'agent-core', d: 'M82 16 C68 20 58 30 50 42' },
  { id: 'invoice-core', d: 'M82 38 C68 38 58 40 50 42' },
  { id: 'output-core', d: 'M78 58 C66 52 58 48 50 42' },
] as const;

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
    }, 2600);
    return () => window.clearInterval(timer);
  }, [paused]);

  const hot = new Set<string>(current.hot);
  const liveEdges = new Set<string>(current.edges);

  return (
    <div className="system-stage" data-step={current.id}>
      <SystemField />
      <p className="system-sim meta">Scène simulée · aucun e-mail envoyé · aucune facture émise</p>
      <div className="system-core">
        <span className="orbit" aria-hidden="true">
          <span className="orbit-dot" />
        </span>
        <span className="mark-sheen">
          <img
            className="system-mark"
            src="/brand/mark.webp"
            alt=""
            width="720"
            height="474"
          />
        </span>
      </div>
      <ol className="system-nodes">
        {nodes.map((node) => (
          <li key={node.id} className={node.x}>
            <article className="system-node" data-hot={hot.has(node.id) ? 'true' : 'false'}>
              <p className="meta text-cyan-flux">{node.kicker}</p>
              <p className="system-node-title">{node.title}</p>
            </article>
          </li>
        ))}
      </ol>
      <svg className="system-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {edges.map((edge) => (
          <path key={edge.id} d={edge.d} data-hot={liveEdges.has(edge.id) ? 'true' : 'false'} />
        ))}
      </svg>
      <div className="system-status">
        <p className="meta text-cyan-flux">{current.kicker} / 07</p>
        <p className="system-status-label">{current.label}</p>
        <p className="system-note">{current.note}</p>
        <ol className="system-rail" aria-hidden="true">
          {steps.map((item, index) => (
            <li key={item.id} className={index <= step ? 'is-on' : undefined} />
          ))}
        </ol>
        <button
          type="button"
          className="system-pause"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? 'Reprendre' : 'Pause'}
        </button>
      </div>
      <p className="sr-only">
        Démonstration en sept temps : demande, analyse, fiche client, brouillon, validation, sortie préparée, tâche prête.
        Aucune donnée réelle n’est traitée.
      </p>
    </div>
  );
}
