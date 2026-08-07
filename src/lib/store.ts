// Single source of truth for the Limnia Pro storefront.
//
// Deliberately processor-agnostic: the app's "Get Limnia Pro" button opens
// /buy on this site, never the checkout directly, so the store can change
// without shipping an app update. Today that checkout is Lemon Squeezy;
// a Microsoft Store listing is planned as a second channel.
//
// Paste the checkout link here (Lemon Squeezy dashboard → Products →
// Limnia Pro → Share → copy link).
//
// Deploying with this set flips the site to "on sale":
//   - /buy forwards visitors to the checkout. Shipped app builds send their
//     "Get Limnia Pro" button here, so this page must always resolve.
//   - The pricing card swaps its "soon" badge for a working buy button.
// While empty, /buy shows a holding page and pricing keeps the "soon" badge.
export const CHECKOUT_URL = 'https://limnia.lemonsqueezy.com/checkout/buy/d85e1b76-99d1-48c8-af2c-35654c43ee94';

// Shown on /buy and the pricing card. Keep in sync with the checkout's
// configured price - this is display-only, the checkout charges what the
// store says.
export const PRO_PRICE = '$14.99';

// Base URL of the key-minting worker (see worker/README.md), e.g.
// 'https://limnia-keys.<subdomain>.workers.dev'. /claim posts the order id and
// identifier from the buyer's receipt link here and shows the key it returns.
// While empty, /claim explains that claiming isn't live yet rather than failing
// with a network error.
export const WORKER_URL = 'https://limnia-keys.limnia-worker.workers.dev';
