import { describe, expect, test } from 'bun:test';
import {
  base64urlNoPad,
  deriveSerial,
  encodePayload,
  mintKey,
  seedFromHex,
  SERIAL_LEN_V2,
} from '../src/license';

/**
 * A throwaway seed used only by tests. NOT the production signing seed — that
 * one lives as an encrypted Worker secret and never touches this repo.
 */
const TEST_SEED_HEX = '2a'.repeat(32);

describe('serial derivation', () => {
  test('is 6 bytes', async () => {
    expect((await deriveSerial('12345')).length).toBe(SERIAL_LEN_V2);
  });

  test('is deterministic for the same order', async () => {
    expect(await deriveSerial('12345')).toEqual(await deriveSerial('12345'));
  });

  test('differs between orders', async () => {
    expect(await deriveSerial('12345')).not.toEqual(await deriveSerial('12346'));
  });
});

describe('payload encoding', () => {
  test('is version, product, then serial', () => {
    const serial = new Uint8Array([1, 2, 3, 4, 5, 6]);
    expect(Array.from(encodePayload(serial))).toEqual([2, 1, 1, 2, 3, 4, 5, 6]);
  });

  test('rejects a serial of the wrong width', () => {
    expect(() => encodePayload(new Uint8Array([1, 2, 3]))).toThrow();
  });
});

describe('key minting', () => {
  test('produces a 103-character LIMNIA- key', async () => {
    const key = await mintKey(seedFromHex(TEST_SEED_HEX), '12345');
    expect(key.startsWith('LIMNIA-')).toBe(true);
    expect(key.length).toBe(103);
  });

  test('is deterministic — re-issuing gives the buyer the same string', async () => {
    const seed = seedFromHex(TEST_SEED_HEX);
    expect(await mintKey(seed, '12345')).toBe(await mintKey(seed, '12345'));
  });

  test('gives different orders different keys', async () => {
    const seed = seedFromHex(TEST_SEED_HEX);
    expect(await mintKey(seed, '12345')).not.toBe(await mintKey(seed, '12346'));
  });

  test('a different seed produces a different key for the same order', async () => {
    const other = seedFromHex('3b'.repeat(32));
    expect(await mintKey(seedFromHex(TEST_SEED_HEX), '12345')).not.toBe(
      await mintKey(other, '12345'),
    );
  });
});

describe('seed parsing', () => {
  test('rejects anything that is not 32 hex bytes', () => {
    expect(() => seedFromHex('abc')).toThrow();
    expect(() => seedFromHex('zz'.repeat(32))).toThrow();
    expect(() => seedFromHex('2a'.repeat(31))).toThrow();
  });

  test('round-trips a known seed', () => {
    expect(seedFromHex('00ff'.repeat(16))[0]).toBe(0x00);
    expect(seedFromHex('00ff'.repeat(16))[1]).toBe(0xff);
  });
});

describe('base64url', () => {
  test('is unpadded and url-safe', () => {
    const encoded = base64urlNoPad(new Uint8Array([251, 255, 190]));
    expect(encoded).not.toContain('=');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
  });
});

/**
 * The vector the Rust side verifies. Printed so it can be pasted into the
 * matching Rust test when the format changes — see `js_minted_key_verifies`
 * in screen_draw/tests/license_e2e.rs.
 */
test('cross-language vector is stable', async () => {
  const key = await mintKey(seedFromHex(TEST_SEED_HEX), 'order-1');
  expect(key).toBe(
    'LIMNIA-AgEgpuBF9p-1KFrwPMILn5VCKLmidX0NHC2xZZfUox5Bw4wdy-edMJFfZdYVf_ObC77uOp0Klvlk_eUdLv68Lx8q2ff9NpAG',
  );
});
