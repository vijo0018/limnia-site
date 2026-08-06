import { describe, expect, test } from 'bun:test';
import { authorizeOrder, verifyWebhookSignature } from '../src/lemonsqueezy';

const SECRET = 'test-signing-secret';

/** Produce the header Lemon Squeezy would send for a body. */
async function sign(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

describe('webhook signature verification', () => {
  test('accepts a correctly signed body', async () => {
    const body = '{"meta":{"event_name":"order_created"}}';
    expect(await verifyWebhookSignature(SECRET, body, await sign(SECRET, body))).toBe(true);
  });

  test('rejects a tampered body', async () => {
    const body = '{"meta":{"event_name":"order_created"}}';
    const signature = await sign(SECRET, body);
    expect(await verifyWebhookSignature(SECRET, body + ' ', signature)).toBe(false);
  });

  test('rejects a signature made with a different secret', async () => {
    const body = '{"a":1}';
    expect(await verifyWebhookSignature(SECRET, body, await sign('other-secret', body))).toBe(false);
  });

  test('rejects a missing or malformed signature', async () => {
    const body = '{"a":1}';
    expect(await verifyWebhookSignature(SECRET, body, null)).toBe(false);
    expect(await verifyWebhookSignature(SECRET, body, '')).toBe(false);
    expect(await verifyWebhookSignature(SECRET, body, 'nothex')).toBe(false);
  });

  test('rejects a truncated signature rather than matching on a prefix', async () => {
    const body = '{"a":1}';
    const signature = await sign(SECRET, body);
    expect(await verifyWebhookSignature(SECRET, body, signature.slice(0, 32))).toBe(false);
  });
});

function paidOrder(overrides: Record<string, unknown> = {}) {
  return {
    identifier: '104e18a2-d755-4d4b-80c4-a6c1dcbe1c10',
    status: 'paid',
    first_order_item: { variant_id: 987 },
    ...overrides,
  };
}

const CLAIM = {
  identifier: '104e18a2-d755-4d4b-80c4-a6c1dcbe1c10',
  variantId: 987,
};

describe('order authorization', () => {
  test('authorizes a paid order whose identifier and variant match', () => {
    expect(authorizeOrder(paidOrder(), CLAIM).ok).toBe(true);
  });

  test('rejects when the identifier does not match', () => {
    // The numeric order id is enumerable; the UUID is the actual capability.
    const result = authorizeOrder(paidOrder(), { ...CLAIM, identifier: 'wrong-uuid' });
    expect(result.ok).toBe(false);
  });

  test('rejects an unpaid order', () => {
    expect(authorizeOrder(paidOrder({ status: 'pending' }), CLAIM).ok).toBe(false);
    expect(authorizeOrder(paidOrder({ status: 'refunded' }), CLAIM).ok).toBe(false);
  });

  test('rejects an order for a different product', () => {
    const other = paidOrder({ first_order_item: { variant_id: 12345 } });
    expect(authorizeOrder(other, CLAIM).ok).toBe(false);
  });

  test('rejects a malformed order rather than throwing', () => {
    expect(authorizeOrder(null, CLAIM).ok).toBe(false);
    expect(authorizeOrder({}, CLAIM).ok).toBe(false);
    expect(authorizeOrder(paidOrder({ first_order_item: null }), CLAIM).ok).toBe(false);
  });

  test('does not leak which check failed', () => {
    // One opaque reason for every rejection: a caller probing the endpoint
    // should not learn whether an order exists, is unpaid, or is another product.
    const reasons = new Set([
      authorizeOrder(paidOrder(), { ...CLAIM, identifier: 'wrong' }).reason,
      authorizeOrder(paidOrder({ status: 'pending' }), CLAIM).reason,
      authorizeOrder(paidOrder({ first_order_item: { variant_id: 1 } }), CLAIM).reason,
      authorizeOrder(null, CLAIM).reason,
    ]);
    expect(reasons.size).toBe(1);
  });
});
