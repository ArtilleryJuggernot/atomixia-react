import { useMemo, useState } from 'react';
import StageView, { type UsageCase } from './StageView';

export type UsageGroup = {
  id: string;
  label: string;
  intro: string;
  cases: UsageCase[];
};

export default function AgentTheater({ groups }: { groups: UsageGroup[] }) {
  const [groupId, setGroupId] = useState(groups[0]?.id ?? '');
  const group = groups.find((item) => item.id === groupId) ?? groups[0];
  const families = useMemo(() => {
    const names = [...new Set(group?.cases.map((item) => item.family) ?? [])];
    return names;
  }, [group]);
  const [family, setFamily] = useState('Toutes');
  const [caseId, setCaseId] = useState(group?.cases[0]?.id ?? '');
  const [run, setRun] = useState(0);

  const visible = (group?.cases ?? []).filter((item) => family === 'Toutes' || item.family === family);
  const current = visible.find((item) => item.id === caseId) ?? visible[0];

  function selectGroup(id: string) {
    const next = groups.find((item) => item.id === id);
    setGroupId(id);
    setFamily('Toutes');
    setCaseId(next?.cases[0]?.id ?? '');
    setRun((value) => value + 1);
  }

  function selectCase(id: string) {
    setCaseId(id);
    setRun((value) => value + 1);
  }

  if (!group || !current) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Profils">
        {groups.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === group.id}
            className={item.id === group.id ? 'stage-tab is-on' : 'stage-tab'}
            onClick={() => selectGroup(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-4 max-w-3xl text-parchment-dim">{group.intro}</p>

      {group.id === 'bibliotheque' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {['Toutes', ...families].map((name) => (
            <button
              key={name}
              type="button"
              className={name === family ? 'stage-tab is-on' : 'stage-tab'}
              onClick={() => {
                setFamily(name);
                const first = group.cases.find((item) => name === 'Toutes' || item.family === name);
                if (first) setCaseId(first.id);
                setRun((value) => value + 1);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ul className="max-h-[34rem] space-y-2 overflow-auto pr-1">
            {visible.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={item.id === current.id}
                  className="usecase-btn"
                  onClick={() => selectCase(item.id)}
                >
                  <span className="meta text-cyan-flux">{item.family}</span>
                  <span className="mt-1 block font-display text-lg tracking-tight">{item.title}</span>
                  <span className="usecase-pain">{item.pain}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl tracking-tight">{current.title}</h3>
            <button type="button" className="stage-tab" onClick={() => setRun((value) => value + 1)}>
              Rejouer
            </button>
          </div>
          <StageView key={`${current.id}-${run}`} item={current} playKey={`${current.id}-${run}`} />
        </div>
      </div>
    </div>
  );
}
