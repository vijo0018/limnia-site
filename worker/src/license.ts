/**
 * Limnia Pro key minting — the JavaScript half of the format implemented in
 * the app at `screen_draw/src/license.rs`. Both sides must agree byte for
 * byte or every key this worker issues is worthless, so the format constants
 * are duplicated deliberately rather than inferred, and a cross-language test
 * vector pins them (see `test/license.test.ts` and the matching Rust test
 * `js_minted_key_verifies`).
 *
 * Nothing here is Cloudflare-specific: it uses only Web Crypto, so the same
 * code runs under `bun test`.
 */

export const FORMAT_VERSION_V2 = 2;
export const PRODUCT_LIMNIA_PRO = 1;
export const SERIAL_LEN_V2 = 6;

const KEY_PREFIX = 'LIMNIA-';

/**
 * Domain separator for serial derivation. Without it, a hash of a bare order
 * id could collide with any other use of the same id elsewhere in the system.
 * Changing this string re-derives every key, so it is effectively frozen.
 */
const SERIAL_DOMAIN = 'limnia-pro-serial-v2|';

/**
 * Serial for an order, derived rather than stored.
 *
 * Ed25519 signing is deterministic, so deriving the serial from the order id
 * makes the whole mint reproducible: the worker keeps no database, and
 * re-issuing a buyer's key always yields the identical string they already
 * have. Replaying a webhook is therefore harmless.
 */
export async function deriveSerial(orderId: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(SERIAL_DOMAIN + orderId);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(digest).slice(0, SERIAL_LEN_V2);
}

/** `version || product || serial` — 8 bytes, matching Rust's `encode_payload`. */
export function encodePayload(serial: Uint8Array): Uint8Array<ArrayBuffer> {
  if (serial.length !== SERIAL_LEN_V2) {
    throw new Error(`serial must be ${SERIAL_LEN_V2} bytes, got ${serial.length}`);
  }
  // Backed by an explicit ArrayBuffer so the result is a `BufferSource` Web
  // Crypto will accept without a cast.
  const out = new Uint8Array(new ArrayBuffer(2 + SERIAL_LEN_V2));
  out[0] = FORMAT_VERSION_V2;
  out[1] = PRODUCT_LIMNIA_PRO;
  out.set(serial, 2);
  return out;
}

/**
 * DER prefix that wraps a raw 32-byte Ed25519 seed as a PKCS#8 PrivateKeyInfo.
 * Web Crypto will not import a bare seed, but the Rust side (ed25519-compact)
 * takes exactly that seed — this is the adapter between the two, not a
 * different key.
 */
const PKCS8_ED25519_PREFIX = new Uint8Array([
  0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20,
]);

async function importSigningKey(seed: Uint8Array): Promise<CryptoKey> {
  if (seed.length !== 32) {
    throw new Error(`signing seed must be 32 bytes, got ${seed.length}`);
  }
  const pkcs8 = new Uint8Array(PKCS8_ED25519_PREFIX.length + seed.length);
  pkcs8.set(PKCS8_ED25519_PREFIX, 0);
  pkcs8.set(seed, PKCS8_ED25519_PREFIX.length);
  return crypto.subtle.importKey('pkcs8', pkcs8, { name: 'Ed25519' }, false, ['sign']);
}

export function base64urlNoPad(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Mint the Pro key for an order. 103 characters:
 * `LIMNIA-` + base64url(payload[8] ++ signature[64]).
 */
export async function mintKey(seed: Uint8Array, orderId: string): Promise<string> {
  const payload = encodePayload(await deriveSerial(orderId));
  const signingKey = await importSigningKey(seed);
  const signature = new Uint8Array(await crypto.subtle.sign('Ed25519', signingKey, payload));

  const raw = new Uint8Array(payload.length + signature.length);
  raw.set(payload, 0);
  raw.set(signature, payload.length);
  return KEY_PREFIX + base64urlNoPad(raw);
}

/** Parse a hex-encoded seed (how the secret is stored in Worker env). */
export function seedFromHex(hex: string): Uint8Array {
  const clean = hex.trim();
  if (!/^[0-9a-fA-F]{64}$/.test(clean)) {
    throw new Error('signing seed must be 64 hex characters (32 bytes)');
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}
