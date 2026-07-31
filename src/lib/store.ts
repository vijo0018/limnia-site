// Single source of truth for the Limnia Pro storefront.
//
// After creating the Lemon Squeezy product, paste its checkout link here
// (Lemon Squeezy dashboard → Products → Limnia Pro → Share → copy link,
// e.g. 'https://limnia.lemonsqueezy.com/buy/xxxxxxxx-xxxx-xxxx').
//
// Deploying with this set flips the site to "on sale":
//   - /buy forwards visitors to the checkout. Shipped app builds send their
//     "Get Limnia Pro" button here, so this page must always resolve.
//   - The pricing card swaps its "soon" badge for a working buy button.
// While empty, /buy shows a holding page and pricing keeps the "soon" badge.
export const LS_CHECKOUT_URL = '';

// Shown on /buy and the pricing card. Keep in sync with the Lemon Squeezy
// product price — this is display-only, the checkout charges what LS says.
export const PRO_PRICE = '$14.99';
