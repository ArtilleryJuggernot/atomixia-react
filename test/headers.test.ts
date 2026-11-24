import assert from 'node:assert/strict';
import test from 'node:test';
import { applySecurityHeaders } from '../src/lib/headers.ts';

test('la page de désinscription ne se met pas en cache', () => {
  const headers = new Headers();
  applySecurityHeaders(headers, '/desinscription');
  assert.equal(headers.get('Cache-Control'), 'no-store');
});
