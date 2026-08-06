/**
 * Limnia Pro key worker.
 *
 * One job: given a Lemon Squeezy order the caller can prove they own, return
 * the Ed25519 key that unlocks Pro. Stateless — the key is derived from the
 * order id (see `license.ts`), so there is no database, nothing to back up,
 * and re-claiming always returns the same key.
 *
 * Secrets (set with `wrangler secret put`, never in this repo):
 *   SIGNING_SEED_HEX   32-byte Ed25519 seed, hex. The irreplaceable one.
 *   LS_API_KEY         Lemon Squeezy API key, to look orders up.
 *   LS_WEBHOOK_SECRET  Shared secret for X-Signature on webhooks.
 */

import { mintKey, seedFromHex } from './license';
import { authorizeOrder, fetchOrder, verifyWebhookSignature } from './lemonsqueezy';

export interface Env {
  SIGNING_SEED_HEX: string;
  LS_API_KEY: string;
  LS_WEBHOOK_SECRET: string;
  /** Variant id of the Limnia Pro product, so other orders cannot mint keys. */
  LS_VARIANT_ID: string;
  /** Origin allowed to call /key from a browser (the site's claim page). */
  ALLOWED_ORIGIN: string;
}

export interface Deps {
  fetchOrder: typeof fetchOrder;
}

const DEFAULT_DEPS: Deps = { fetchOrder };

function json(body: unknown, status: number, env: Env): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * GET /key?order=<numeric id>&id=<uuid identifier>
 *
 * Both values come from Lemon Squeezy link variables in the receipt button, so
 * the buyer's own receipt email is the claim link. The numeric id fetches the
 * order; the UUID proves the caller is the buyer.
 */
export async function handleKey(url: URL, env: Env, deps: Deps = DEFAULT_DEPS): Promise<Response> {
  const orderId = url.searchParams.get('order');
  const identifier = url.searchParams.get('id');

  // Reject before spending an API call on obviously malformed input.
  if (!orderId || !/^\d+$/.test(orderId) || !identifier) {
    return json({ error: 'not_claimable' }, 400, env);
  }

  const order = await deps.fetchOrder(env.LS_API_KEY, orderId);
  const decision = authorizeOrder(order, {
    identifier,
    variantId: Number(env.LS_VARIANT_ID),
  });
  if (!decision.ok) {
    return json({ error: decision.reason }, 403, env);
  }

  const key = await mintKey(seedFromHex(env.SIGNING_SEED_HEX), orderId);
  return json({ key }, 200, env);
}

/**
 * POST /webhook — Lemon Squeezy order events.
 *
 * Delivery runs through the claim link, so this exists to authenticate and
 * acknowledge events rather than to hand out keys. Replay is harmless: minting
 * is deterministic and writes nothing.
 */
export async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get('X-Signature');
  if (!(await verifyWebhookSignature(env.LS_WEBHOOK_SECRET, rawBody, signature))) {
    return new Response('invalid signature', { status: 401 });
  }
  return new Response('ok', { status: 200 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (url.pathname === '/key' && request.method === 'GET') {
      return handleKey(url, env);
    }

    if (url.pathname === '/webhook' && request.method === 'POST') {
      return handleWebhook(request, env);
    }

    return new Response('not found', { status: 404 });
  },
};
