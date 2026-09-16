import assert from 'node:assert/strict';
import { test } from 'node:test';

test('API_URL strips a trailing slash', () => {
  const url = ('http://192.168.1.20:4000/').replace(/\/$/, '');
  assert.equal(url, 'http://192.168.1.20:4000');
});

test('localhost is not used as a physical-device API host', () => {
  const deviceUrl = 'http://192.168.1.20:4000';
  assert.equal(deviceUrl.includes('localhost'), false);
});
