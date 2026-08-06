/**
 * Lemon Squeezy integration: webhook authentication and order authorization.
 *
 * Both functions here are the security boundary of the worker — everything
 * downstream assumes they said yes — so they are pure and directly tested
 * rather than exercised only through the fetch handler.
 */

/** The subset of the LS order object this worker relies on. */
export interface ClaimExpectation {
  /** UUID from the claim link. The numeric order id is enumerable; this is not. */
  identifier: string;
  /** The Limnia Pro variant, so an order for something else cannot mint a key. */
  variantId: number;
}

export interface AuthorizationResult {
  ok: boolean;
  reason?: string;
}

/**
 * One opaque failure reason for every rejection. Distinguishing "no such
 * order" from "not paid" from "wrong product" would let someone probing the
 * endpoint map out orders that exist.
 */
const DENIED: AuthorizationResult = { ok: false, reason: 'not_claimable' };

/** Constant-time string compare, so the UUID cannot be recovered byte by byte. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null;
  const out = new Uint8Array(new ArrayBuffer(hex.length / 2));
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/**
 * Verify the `X-Signature` header Lemon Squeezy sends: HMAC-SHA256 of the raw
 * request body, hex encoded, keyed with the webhook signing secret.
 *
 * Must be given the *raw* body text — re-serializing the parsed JSON would
 * change the bytes and never match.
 */
export async function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  signature: string | null,
): Promise<boolean> {
  if (!signature) return false;
  const provided = hexToBytes(signature);
  if (!provided) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  // `verify` is constant-time and rejects a wrong-length MAC, so a truncated
  // signature cannot match on a prefix.
  return crypto.subtle.verify('HMAC', key, provided, new TextEncoder().encode(rawBody));
}

/**
 * Decide whether an order may mint a key.
 *
 * The claim link carries both the numeric order id (used to fetch the order)
 * and its UUID identifier. Checking the UUID against what the API returned is
 * what makes the endpoint safe to expose: numeric ids are sequential and
 * guessable, the UUID is not.
 */
export function authorizeOrder(order: unknown, expected: ClaimExpectation): AuthorizationResult {
  if (typeof order !== 'object' || order === null) return DENIED;
  const o = order as Record<string, unknown>;

  if (typeof o.identifier !== 'string') return DENIED;
  if (!timingSafeEqual(o.identifier, expected.identifier)) return DENIED;

  if (o.status !== 'paid') return DENIED;

  const item = o.first_order_item;
  if (typeof item !== 'object' || item === null) return DENIED;
  const variantId = (item as Record<string, unknown>).variant_id;
  if (variantId !== expected.variantId) return DENIED;

  return { ok: true };
}

/** Fetch an order from the Lemon Squeezy API. Returns null on any failure. */
export async function fetchOrder(apiKey: string, orderId: string): Promise<unknown | null> {
  const response = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { data?: { attributes?: unknown } };
  return body?.data?.attributes ?? null;
}
