# limnia-keys worker

Mints Limnia Pro license keys for Lemon Squeezy orders.

Stateless by design: a key is **derived** from the order id rather than stored.
Ed25519 signing is deterministic, so the same order always produces the same
key. There is no database, nothing to back up, replaying a webhook is harmless,
and a buyer who loses their key gets the identical one back.

## How a purchase becomes a key

1. Buyer checks out on Lemon Squeezy.
2. LS's receipt shows a button pointing at the site's claim page. The URL is
   built from [link variables](https://docs.lemonsqueezy.com/help/products/link-variables):
   `…/claim?order=[order_id]&id=[order_identifier]`. Note the **square
   brackets** — that is Lemon Squeezy's placeholder syntax, and curly braces
   are rejected by its URL validator.
3. The claim page calls `GET /key` on this worker with both values.
4. The worker fetches the order from the LS API by its numeric id, then checks
   the UUID matches, the order is `paid`, and it is for the Pro variant.
5. It mints the key and returns it. The buyer pastes it into Limnia.

The numeric order id is sequential and guessable; the UUID identifier is not.
Checking the UUID against what the API returned is what makes the endpoint safe
to expose without any login.

## Endpoints

| Route | Purpose |
| --- | --- |
| `GET /key?order=<id>&id=<uuid>` | Mint the key for an order the caller can prove they own |
| `POST /webhook` | Authenticated LS events (HMAC `X-Signature`). Delivery goes through the claim link, so this only acknowledges. |

Every rejection returns the same opaque `not_claimable` reason, so probing the
endpoint cannot reveal which orders exist.

## Setup

```sh
bun install
bun test
```

Fill `LS_VARIANT_ID` in `wrangler.toml`, then set the secrets (they are never
stored in this repo):

```sh
wrangler secret put SIGNING_SEED_HEX
wrangler secret put LS_API_KEY
wrangler secret put LS_WEBHOOK_SECRET
```

`SIGNING_SEED_HEX` is `limnia-signing-seed.bin` as 64 hex characters.

```sh
wrangler deploy
```

## Going live

Lemon Squeezy keeps test and live data completely separate. **Three values
change** when the product is copied to live mode, and every one of them fails
silently — orders succeed, then buyers cannot claim a key:

| Value | Where | Symptom if stale |
| --- | --- | --- |
| `LS_VARIANT_ID` | `wrangler.toml` | `authorizeOrder` rejects every order as `not_claimable` |
| `LS_API_KEY` | Worker secret | Order lookup returns nothing, so every claim is refused |
| `CHECKOUT_URL` | `src/lib/store.ts` | Buyers land on a test checkout that takes no real money |

Do them together, then buy once with a real card and refund yourself. Testing
only in test mode proves the plumbing, not the live configuration.

## The signing seed

This worker holds the private half of the key pair whose public half is
compiled into every shipped copy of Limnia.

- **Losing it** means never being able to mint a valid key again. Rotating
  requires a new key pair, a new embedded public key, and an app update —
  and every key already sold keeps working only on old builds.
- **Leaking it** means anyone can mint unlimited Pro keys, and there is no
  revocation because verification is offline.

Keep an encrypted offline backup. Never commit it, never paste it into a
dashboard field that echoes it back, and keep it out of build logs.

## Format compatibility

Keys minted here must verify in the app's Rust implementation
(`screen_draw/src/license.rs`). The two are pinned by a shared vector: `bun test`
mints a key from a throwaway seed, and the Rust test
`a_javascript_minted_key_verifies_in_rust` verifies that exact string. **If you
change the key format, regenerate both sides together** — nothing else will
catch them drifting apart, and the failure mode is selling keys that do not work.
