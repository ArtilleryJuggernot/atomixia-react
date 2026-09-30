import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyContact, hasErrors, isHoneypotTripped, validateContact, type ContactFields } from '../src/lib/contact.ts';

function valid(): ContactFields {
  return {
    ...emptyContact(),
    name: 'Camille Martin',
    email: 'camille@example.fr',
    company: 'Atelier Nord',
    process: 'Relancer les devis restés sans réponse.',
    message: 'Nous oublions les relances après l’envoi du devis.',
    consent: true,
  };
}

test('accepte une demande complète', () => {
  const errors = validateContact(valid());
  assert.equal(hasErrors(errors), false);
});

test('signale les champs utiles', () => {
  const errors = validateContact({
    ...emptyContact(),
    email: 'pas-un-email',
    phone: '12',
    process: 'court',
    message: 'trop court',
  });
  assert.equal(errors.name, 'Indiquez votre nom.');
  assert.equal(errors.email, 'Indiquez une adresse e-mail valide.');
  assert.equal(errors.phone, 'Ce numéro ne semble pas complet.');
  assert.equal(errors.company, 'Indiquez l’entreprise ou la structure.');
  assert.equal(errors.process, 'Décrivez le processus en une ou deux phrases.');
  assert.equal(errors.message, 'Écrivez quelques mots de contexte (20 caractères minimum).');
  assert.equal(errors.consent, 'Cochez la case pour autoriser la réponse à votre demande.');
});

test('le téléphone vide est accepté', () => {
  const errors = validateContact(valid());
  assert.equal(errors.phone, undefined);
});

test('le champ invisible n’est pas une erreur de formulaire', () => {
  const fields = { ...valid(), website: 'https://spam.example' };
  assert.equal(hasErrors(validateContact(fields)), false);
  assert.equal(isHoneypotTripped(fields), true);
});
