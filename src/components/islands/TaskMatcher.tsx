import { useState } from 'react';
import { matchTask, type TaskMatch } from '../../lib/tasks';

const EXAMPLES = [
  'Je passe 1 h par jour à trier mes e-mails.',
  'Je dois surveiller 20 sites chaque semaine.',
  'Je dois lire 50 pages avant chaque réunion.',
  'Je dois chercher des informations dans 300 documents.',
  'Je dois relancer mes prospects manuellement.',
  'Chaque lundi je compile les chiffres et j’envoie un rapport.',
];

export default function TaskMatcher() {
  const [text, setText] = useState('');
  const [match, setMatch] = useState<TaskMatch | null>(null);
  const [notice, setNotice] = useState('');
  const [play, setPlay] = useState(0);

  function run(value: string) {
    const next = matchTask(value);
    if (!next) {
      setMatch(null);
      setNotice('Décrivez la tâche en une phrase : ce que vous refaites, et à quelle fréquence.');
      return;
    }
    setNotice('');
    setMatch(next);
    setPlay((current) => current + 1);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <label htmlFor="tache-libre" className="meta text-cyan-flux">
          La tâche
        </label>
        <textarea
          id="tache-libre"
          className="field mt-3 min-h-36"
          value={text}
          placeholder="Chaque lundi je dois compiler les chiffres de l’équipe et envoyer un rapport."
          onChange={(event) => setText(event.target.value)}
        />
        <button type="button" className="btn btn-flux mt-4" onClick={() => run(text)}>
          Voir comment un agent s’en charge
        </button>
        {notice && (
          <p className="field-error" role="status">
            {notice}
          </p>
        )}
        <ul className="mt-6 space-y-2">
          {EXAMPLES.map((example) => (
            <li key={example}>
              <button
                type="button"
                className="usecase-btn"
                onClick={() => {
                  setText(example);
                  run(example);
                }}
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-7" aria-live="polite">
        {match ? (
          <div className="stage-panel">
            <p className="meta text-cyan-flux">Résultat</p>
            <p className="display mt-3 text-3xl">Cette tâche peut être automatisée.</p>
            <p className="mt-3 text-parchment-dim">{match.title}</p>
            <ol key={play} className="task-flow mt-6 space-y-3 border-l border-cyan-flux/30 pl-3">
              {match.steps.map((step, index) => (
                <li key={step.label} className="task-step stage-chip grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="meta text-cyan-flux">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="font-display text-lg tracking-tight">{step.label}</span>
                    <span className="mt-1 block text-sm text-parchment-dim">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="stage-result mt-5">{match.result}</p>
            <p className="mt-2 text-sm text-parchment-dim">{match.hold}</p>
            <a className="btn btn-flux mt-6" href={`/contact?tache=${encodeURIComponent(text)}`}>
              Décrivez-nous cette tâche
            </a>
          </div>
        ) : (
          <div className="stage-panel text-parchment-dim">
            <p className="meta text-cyan-flux">En attente</p>
            <p className="mt-4 font-display text-2xl tracking-tight text-parchment">Choisissez un exemple, ou écrivez la vôtre.</p>
            <p className="mt-3">Le parcours s’affiche ici : la tâche, l’agent, le résultat, et ce qui reste à valider.</p>
          </div>
        )}
      </div>
    </div>
  );
}
