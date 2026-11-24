import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { emptyOptout, hasOptoutErrors, normalizeEmail, validateOptout, type OptOutDraft, type OptOutErrors } from '../../lib/optout-fields';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StopForm() {
  const [fields, setFields] = useState<OptOutDraft>(emptyOptout);
  const [errors, setErrors] = useState<OptOutErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const baseId = useId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email') ?? '';
    const token = params.get('jeton') ?? params.get('token') ?? '';
    if (!email && !token) return;
    setFields((current) => ({
      ...current,
      email: EMAIL.test(email.trim()) ? email.trim() : current.email,
      token,
    }));
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  function update<K extends keyof OptOutDraft>(key: K, value: OptOutDraft[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateOptout(fields);
    setErrors(nextErrors);
    if (hasOptoutErrors(nextErrors)) {
      setFormError('L’adresse n’a pas pu être enregistrée.');
      setStatus('idle');
      const first = Object.keys(nextErrors)[0];
      if (first) document.getElementById(`${baseId}-${first}`)?.focus();
      return;
    }

    setStatus('sending');
    setFormError('');
    try {
      const response = await fetch('/api/desinscription', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          email: normalizeEmail(fields.email),
          phone: fields.phone,
          fax_number: fields.website,
          jeton: fields.token,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        errors?: OptOutErrors;
        message?: string;
      };
      if (response.status === 422 && data.errors) {
        setErrors(data.errors);
        setFormError('L’adresse n’a pas pu être enregistrée.');
        setStatus('idle');
        return;
      }
      if (!response.ok) {
        setFormError(data.message || 'L’opposition n’a pas pu être enregistrée.');
        setStatus('error');
        return;
      }
      setConfirmation(
        data.message || 'C’est enregistré. Atomixia ne vous écrira plus à cette adresse pour de la prospection.',
      );
      setStatus('success');
    } catch {
      setFormError('L’opposition n’a pas pu être enregistrée. Réessayez, ou écrivez directement.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="glass px-6 py-10 sm:px-8" role="status">
        <p className="meta text-cyan-flux">Opposition enregistrée</p>
        <h2 id="confirmation" ref={successRef} tabIndex={-1} className="display mt-4 text-4xl outline-none">
          C’est enregistré.
        </h2>
        <p className="mt-4 max-w-xl text-parchment-dim">{confirmation}</p>
      </div>
    );
  }

  return (
    <form id="stop" className="relative space-y-5" method="post" action="/api/desinscription" onSubmit={onSubmit} noValidate>
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

      <input type="hidden" name="jeton" value={fields.token} />

      <div>
        <label htmlFor={`${baseId}-email`} className="mb-2 flex items-baseline justify-between gap-3 text-sm text-parchment">
          <span>E-mail</span>
        </label>
        <input
          id={`${baseId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field"
          value={fields.email}
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? `${baseId}-email-error` : undefined}
          onChange={(event) => update('email', event.target.value)}
        />
        {errors.email && (
          <p id={`${baseId}-email-error`} className="field-error">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${baseId}-phone`} className="mb-2 flex items-baseline justify-between gap-3 text-sm text-parchment">
          <span>Téléphone</span>
          <span className="meta">Facultatif</span>
        </label>
        <input
          id={`${baseId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          className="field"
          value={fields.phone}
          aria-invalid={errors.phone ? 'true' : undefined}
          aria-describedby={errors.phone ? `${baseId}-phone-error` : undefined}
          onChange={(event) => update('phone', event.target.value)}
        />
        {errors.phone && (
          <p id={`${baseId}-phone-error`} className="field-error">
            {errors.phone}
          </p>
        )}
      </div>

      <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enregistrement…' : 'Je ne veux plus être contacté'}
      </button>
    </form>
  );
}
