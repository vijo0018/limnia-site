import { describe, expect, test } from 'bun:test';
import { handleKey, type Deps, type Env } from '../src/index';

const env: Env = {
  SIGNING_SEED_HEX: '2a'.repeat(32),
  LS_API_KEY: 'test-api-key',
  LS_WEBHOOK_SECRET: 'test-webhook-secret',
  LS_VARIANT_ID: '987',
  ALLOWED_ORIGIN: 'https://vijo0018.github.io',
};

const IDENTIFIER = '104e18a2-d755-4d4b-80c4-a6c1dcbe1c10';

function depsReturning(order: unknown): Deps {
  return { fetchOrder: async () => order };
}

const paidOrder = {
  identifier: IDENTIFIER,
  status: 'paid',
  first_order_item: { variant_id: 987 },
};

function claimUrl(params: Record<string, string>): URL {
  const url = new URL('https://worker.example/key');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url;
}

describe('GET /key', () => {
  test('returns a key for an order the caller can prove they own', async () => {
    const res = await handleKey(
      claimUrl({ order: '12345', id: IDENTIFIER }),
      env,
      depsReturning(paidOrder),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { key: string };
    expect(body.key.startsWith('LIMNIA-')).toBe(true);
    expect(body.key.length).toBe(103);
  });

  test('returns the same key on every claim', async () => {
    const call = async () =>
      ((await (
        await handleKey(claimUrl({ order: '12345', id: IDENTIFIER }), env, depsReturning(paidOrder))
      ).json()) as { key: string }).key;
    expect(await call()).toBe(await call());
  });

  test('refuses when the UUID does not match the fetched order', async () => {
    const res = await handleKey(
      claimUrl({ order: '12345', id: 'ffffffff-0000-0000-0000-000000000000' }),
      env,
      depsReturning(paidOrder),
    );
    expect(res.status).toBe(403);
  });

  test('refuses an order for a different product', async () => {
    const other = { ...paidOrder, first_order_item: { variant_id: 5 } };
    const res = await handleKey(
      claimUrl({ order: '12345', id: IDENTIFIER }),
      env,
      depsReturning(other),
    );
    expect(res.status).toBe(403);
  });

  test('refuses an unknown order without leaking that it is unknown', async () => {
    const res = await handleKey(
      claimUrl({ order: '99999', id: IDENTIFIER }),
      env,
      depsReturning(null),
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: 'not_claimable' });
  });

  test('rejects malformed parameters before calling the API', async () => {
    let called = false;
    const spy: Deps = {
      fetchOrder: async () => {
        called = true;
        return paidOrder;
      },
    };
    expect((await handleKey(claimUrl({ id: IDENTIFIER }), env, spy)).status).toBe(400);
    expect((await handleKey(claimUrl({ order: '12345' }), env, spy)).status).toBe(400);
    expect((await handleKey(claimUrl({ order: 'abc', id: IDENTIFIER }), env, spy)).status).toBe(400);
    expect(called).toBe(false);
  });

  test('never caches a response carrying a key', async () => {
    const res = await handleKey(
      claimUrl({ order: '12345', id: IDENTIFIER }),
      env,
      depsReturning(paidOrder),
    );
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(env.ALLOWED_ORIGIN);
  });
});
