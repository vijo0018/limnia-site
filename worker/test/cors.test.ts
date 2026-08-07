import { describe, expect, test } from 'bun:test';
import { corsOrigin } from '../src/index';

const PROD = 'https://vijo0018.github.io';
const DEV = 'http://localhost:4321';

describe('CORS origin resolution', () => {
  test('echoes an origin that is on the allowlist', () => {
    expect(corsOrigin(`${PROD},${DEV}`, DEV)).toBe(DEV);
    expect(corsOrigin(`${PROD},${DEV}`, PROD)).toBe(PROD);
  });

  test('never echoes an origin that is not on the allowlist', () => {
    // Returning the attacker's origin would defeat the point of CORS, so an
    // unknown origin gets the first allowed value and the browser blocks it.
    expect(corsOrigin(`${PROD},${DEV}`, 'https://evil.example')).toBe(PROD);
  });

  test('falls back to the first allowed origin when the request has none', () => {
    expect(corsOrigin(`${PROD},${DEV}`, null)).toBe(PROD);
  });

  test('still works with a single configured origin', () => {
    expect(corsOrigin(PROD, PROD)).toBe(PROD);
    expect(corsOrigin(PROD, DEV)).toBe(PROD);
  });

  test('tolerates whitespace around entries', () => {
    expect(corsOrigin(`${PROD} , ${DEV}`, DEV)).toBe(DEV);
  });

  test('does not match on a prefix', () => {
    // "https://vijo0018.github.io.evil.com" must not pass as the prod origin.
    expect(corsOrigin(PROD, `${PROD}.evil.com`)).toBe(PROD);
  });
});
