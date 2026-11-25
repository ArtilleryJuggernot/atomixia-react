import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  emptyContact,
  fieldsFromRecord,
  hasErrors,
  isHoneypotTripped,
  validateContact,
  type ContactFields,
} from '../src/lib/contact.ts';
import { site } from '../src/lib/site.ts';

function valid(): ContactFields {
  return {
    ...emptyContact(),
    projectType: 'site',
    name: 'Camille Martin',
    email: 'camille@example.fr',
    project: 'Créer un site clair pour présenter notre activité.',
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
    project: 'trop court',
  });
  assert.equal(errors.projectType, 'Choisissez un type de projet.');
  assert.equal(errors.name, 'Indiquez votre nom.');
  assert.equal(errors.email, 'Indiquez une adresse e-mail valide.');
  assert.equal(errors.phone, 'Ce numéro ne semble pas complet.');
  assert.equal(errors.project, 'Décrivez votre projet (20 caractères minimum).');
  assert.equal(errors.consent, 'Cochez la case pour autoriser la réponse à votre demande.');
});

test('le téléphone vide est accepté', () => {
  const errors = validateContact(valid());
  assert.equal(errors.phone, undefined);
});

test('accepte les six types de projet prescrits', () => {
  for (const projectType of ['site', 'automation', 'software', 'systems', 'cyber', 'other'] as const) {
    assert.equal(validateContact({ ...valid(), projectType }).projectType, undefined);
  }
  const invalid = fieldsFromRecord({
    projectType: 'inconnu',
    name: 'Camille Martin',
    email: 'camille@example.fr',
    project: 'Créer un site clair pour présenter notre activité.',
    consent: 'oui',
  });
  assert.equal(validateContact(invalid).projectType, 'Choisissez un type de projet.');
});

test('le projet contient entre 20 et 2 000 caractères', () => {
  assert.equal(validateContact({ ...valid(), project: 'a'.repeat(20) }).project, undefined);
  assert.equal(validateContact({ ...valid(), project: 'a'.repeat(2000) }).project, undefined);
  assert.equal(validateContact({ ...valid(), project: 'a'.repeat(19) }).project, 'Décrivez votre projet (20 caractères minimum).');
  assert.equal(validateContact({ ...valid(), project: 'a'.repeat(2001) }).project, 'Raccourcissez votre projet (2 000 caractères maximum).');
});

test('le champ invisible n’est pas une erreur de formulaire', () => {
  const fields = { ...valid(), website: 'https://spam.example' };
  assert.equal(hasErrors(validateContact(fields)), false);
  assert.equal(isHoneypotTripped(fields), true);
});

test('le mail de devis contient l’objet et le corps préremplis encodés', () => {
  assert.equal(
    site.quoteMailto,
    'mailto:hugo.jacquel@atomixia.fr?subject=Demande%20de%20devis%20gratuit&body=Type%20de%20projet%20%3A%0AD%C3%A9lai%20souhait%C3%A9%20%3A%0AT%C3%A9l%C3%A9phone%20%3A',
  );
  assert.equal(site.quoteCta, 'Demander un devis gratuit');
});

test('la réponse HTML serveur ne contient aucun attribut style', () => {
  const apiSource = readFileSync(fileURLToPath(new URL('../src/pages/api/contact.ts', import.meta.url)), 'utf8');
  assert.doesNotMatch(apiSource, /\sstyle\s*=/i);
});
