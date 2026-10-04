import assert from 'node:assert/strict';
import test from 'node:test';
import { matchTask } from '../src/lib/tasks.ts';

test('un texte trop court ne lance pas de parcours', () => {
  assert.equal(matchTask('mails'), null);
});

test('les e-mails ouvrent le tri', () => {
  const match = matchTask('Je passe une heure à trier mes e-mails.');
  assert.ok(match);
  assert.equal(match?.title, 'Tri et préparation des messages');
  assert.equal(match?.steps.length, 4);
});

test('une tâche inconnue reste un parcours avec validation', () => {
  const match = matchTask('Je recolle les étiquettes des caisses chaque soir.');
  assert.equal(match?.title, 'Préparation de cette tâche');
  assert.match(match?.hold ?? '', /décision humaine/);
});
