import { useId, useState } from 'react';
import type { OptOutRecord } from '../../lib/optout-fields';

type ListResponse = {
  ok?: boolean;
  message?: string;
  total?: number;
  personnes?: OptOutRecord[];
  errors?: Record<string, string>;
};

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function originLabel(source: OptOutRecord['source']): string {
  return source === 'lien' ? 'Lien' : 'Formulaire';
}

export default function OptoutList() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [people, setPeople] = useState<OptOutRecord[]>([]);
  const fieldId = useId();

  async function load(event: { preventDefault: () => void }) {
    event.preventDefault();
    const key = token.trim();
    if (!key) {
      setStatus('error');
      setMessage('Indiquez la clé de lecture.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/desinscription', {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${key}`,
        },
      });
      const data = (await response.json().catch(() => ({}))) as ListResponse;
      if (!response.ok) {
        setPeople([]);
        setStatus('error');
        setMessage(data.message || 'La liste n’a pas pu être lue.');
        return;
      }
      setPeople(data.personnes ?? []);
      setStatus('ready');
    } catch {
      setPeople([]);
      setStatus('error');
      setMessage('La liste n’a pas pu être lue.');
    }
  }

  return (
    <div>
      <form className="max-w-xl space-y-5" onSubmit={load}>
        <div>
          <label htmlFor={fieldId} className="mb-2 block text-sm text-parchment">
            Clé de lecture
          </label>
          <input
            id={fieldId}
            className="field"
            type="password"
            autoComplete="current-password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
        </div>
        <button className="btn btn-gold" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Lecture…' : 'Afficher la liste'}
        </button>
      </form>

      {message && (
        <p role="alert" className="field-error mt-6">
          {message}
        </p>
      )}

      {status === 'ready' && people.length === 0 && (
        <p className="mt-10 text-parchment-dim" role="status">
          Aucune opposition enregistrée.
        </p>
      )}

      {status === 'ready' && people.length > 0 && (
        <div className="mt-10 overflow-x-auto">
          <p className="meta text-gold-400">
            {people.length} {people.length > 1 ? 'personnes' : 'personne'}
          </p>
          <table className="mt-4 w-full min-w-[44rem] border-collapse text-left text-sm">
            <caption className="sr-only">Personnes désinscrites de la prospection</caption>
            <thead>
              <tr className="border-b border-white/10 text-parchment-dim">
                <th scope="col" className="py-3 pr-4 font-normal">Date</th>
                <th scope="col" className="py-3 pr-4 font-normal">E-mail</th>
                <th scope="col" className="py-3 pr-4 font-normal">Téléphone</th>
                <th scope="col" className="py-3 pr-4 font-normal">Nom</th>
                <th scope="col" className="py-3 pr-4 font-normal">Entreprise</th>
                <th scope="col" className="py-3 font-normal">Origine</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id} className="border-b border-white/10 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap text-parchment-dim">{formatWhen(person.at)}</td>
                  <td className="py-3 pr-4 break-all">{person.email}</td>
                  <td className="py-3 pr-4">{person.phone || '—'}</td>
                  <td className="py-3 pr-4">{person.name || '—'}</td>
                  <td className="py-3 pr-4">{person.company || '—'}</td>
                  <td className="py-3">{originLabel(person.source)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
