import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import {
  emptyContact,
  hasErrors,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from '../../lib/contact';

const inputClass = 'field';

export default function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const baseId = useId();

  useEffect(() => {
    const task = new URLSearchParams(window.location.search).get('tache');
    if (!task) return;
    setFields((current) => ({ ...current, process: task.slice(0, 500) }));
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  function update<K extends keyof ContactFields>(key: K, value: ContactFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContact(fields);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setFormError('Certains champs empêchent l’envoi.');
      setStatus('idle');
      const first = Object.keys(nextErrors)[0];
      if (first) document.getElementById(`${baseId}-${first}`)?.focus();
      return;
    }

    setStatus('sending');
    setFormError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          ...fields,
          consent: fields.consent ? 'oui' : '',
          fax_number: fields.website,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        errors?: ContactErrors;
        message?: string;
      };
      if (response.status === 422 && data.errors) {
        setErrors(data.errors);
        setFormError('Certains champs empêchent l’envoi.');
        setStatus('idle');
        return;
      }
      if (!response.ok) {
        setFormError(data.message || 'Le message n’a pas pu être enregistré.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setFormError('Le message n’a pas pu être enregistré. Réessayez, ou écrivez directement.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="glass px-6 py-10 sm:px-8" role="status">
        <p className="meta text-cyan-flux">Demande enregistrée</p>
        <h2 id="confirmation" ref={successRef} tabIndex={-1} className="display mt-4 text-4xl outline-none">
          Votre message est bien reçu.
        </h2>
        <p className="mt-4 max-w-xl text-parchment-dim">
          Atomixia vous répond sous 24 à 48 h, à l’adresse indiquée. Le message reste sur cette page.
        </p>
      </div>
    );
  }

  return (
    <form id="demande" className="relative space-y-5" method="post" action="/api/contact" onSubmit={onSubmit} noValidate>
      {formError && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="field-error outline-none">
          {formError}
        </p>
      )}

      <div className="hp" aria-hidden="true">
        <label htmlFor={`${baseId}-fax`}>Fax</label>
        <input
          id={`${baseId}-fax`}
          className="hp"
          name="fax_number"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={(event) => update('website', event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${baseId}-name`}
          name="name"
          label="Nom"
          value={fields.name}
          error={errors.name}
          autoComplete="name"
          required
          onChange={(value) => update('name', value)}
        />
        <Field
          id={`${baseId}-email`}
          name="email"
          type="email"
          label="E-mail"
          value={fields.email}
          error={errors.email}
          autoComplete="email"
          required
          onChange={(value) => update('email', value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${baseId}-phone`}
          name="phone"
          type="tel"
          label="Téléphone"
          hint="Facultatif"
          value={fields.phone}
          error={errors.phone}
          autoComplete="tel"
          onChange={(value) => update('phone', value)}
        />
        <Field
          id={`${baseId}-company`}
          name="company"
          label="Entreprise"
          value={fields.company}
          error={errors.company}
          autoComplete="organization"
          required
          onChange={(value) => update('company', value)}
        />
      </div>

      <Field
        id={`${baseId}-process`}
        name="process"
        label="Processus à automatiser"
        value={fields.process}
        error={errors.process}
        required
        multiline
        onChange={(value) => update('process', value)}
      />
      <Field
        id={`${baseId}-tools`}
        name="tools"
        label="Outils déjà utilisés"
        hint="Facultatif"
        value={fields.tools}
        error={errors.tools}
        onChange={(value) => update('tools', value)}
      />
      <Field
        id={`${baseId}-message`}
        name="message"
        label="Message"
        value={fields.message}
        error={errors.message}
        required
        multiline
        onChange={(value) => update('message', value)}
      />

      <div>
        <label className="flex items-start gap-3 text-sm text-parchment-dim" htmlFor={`${baseId}-consent`}>
          <input
            id={`${baseId}-consent`}
            name="consent"
            type="checkbox"
            value="oui"
            checked={fields.consent}
            required
            aria-invalid={errors.consent ? 'true' : undefined}
            aria-describedby={errors.consent ? `${baseId}-consent-error` : undefined}
            className="mt-1 size-4 accent-gold-400"
            onChange={(event) => update('consent', event.target.checked)}
          />
          <span>J’accepte qu’Atomixia utilise ces informations pour répondre à ma demande.</span>
        </label>
        {errors.consent && (
          <p id={`${baseId}-consent-error`} className="field-error">
            {errors.consent}
          </p>
        )}
        <p className="mt-2 text-sm">
          <a className="text-gold-300 underline underline-offset-4" href="/confidentialite">
            Politique de confidentialité
          </a>
        </p>
      </div>

      <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi…' : 'Envoyer la demande'}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  value,
  error,
  onChange,
  type = 'text',
  hint,
  required,
  autoComplete,
  multiline = false,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    required,
    autoComplete,
    'aria-invalid': error ? ('true' as const) : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: inputClass,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm text-parchment">
        <span>{label}</span>
        {hint && <span className="meta">{hint}</span>}
      </label>
      {multiline ? <textarea {...shared} rows={5} /> : <input {...shared} type={type} />}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
