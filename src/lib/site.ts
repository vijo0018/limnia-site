// Single source of truth for site-wide identity, SEO, and download metadata.
//
// Anything that appears in more than one place (the version stamp in the nav
// and the hero, the canonical origin used by <link rel="canonical"> and the
// sitemap, the installer's size and hash) lives here so the surfaces can't
// drift apart. Before this file existed the nav and the OG image both still
// claimed v1.0.0 several weeks after v1.1.0 shipped.

import { releases } from '../data/changelog';

/** Origin the site is served from. No trailing slash. */
export const SITE_ORIGIN = 'https://vijo0018.github.io';

/** Base path the site is mounted at (GitHub Pages project page). No trailing slash. */
export const SITE_BASE = '/limnia-site';

/** Absolute origin + base, e.g. for canonical URLs. No trailing slash. */
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE}`;

export const SITE_NAME = 'Limnia';
export const SITE_TAGLINE = 'Draw on your screen, instantly.';
export const SITE_DESCRIPTION =
  'A 2 MB Windows overlay for presenters, educators, and creators. Press a hotkey, annotate any pixel, vanish.';

/** Where the product itself lives. */
export const REPO_URL = 'https://github.com/vijo0018/limnia';
export const RELEASES_URL = `${REPO_URL}/releases/latest`;

/**
 * Current shipping version, derived from the changelog rather than repeated
 * as a literal. The changelog lists newest first; the first `stable` entry is
 * what users can actually download today.
 */
export const APP_VERSION =
  releases.find((r) => r.status === 'stable')?.version ?? 'v1.0.0';

/**
 * The installer as served from `public/downloads/`.
 *
 * `sha256` lets users verify the download themselves — the honest answer to
 * "Windows says this is unsafe, how do I know it's really you?". Regenerate
 * both fields whenever the binary is replaced:
 *
 *   sha256sum public/downloads/LimniaSetup.exe
 *   stat -c%s  public/downloads/LimniaSetup.exe
 */
export const INSTALLER = {
  file: 'LimniaSetup.exe',
  bytes: 2678344,
  sha256: 'ab7ae851829be9a4877f348e6bb34132d1ef5f836395fc0fb57a0796a3cf048b',
} as const;

/** Human-readable installer size, e.g. "2.6 MB". */
export const INSTALLER_SIZE = `${(INSTALLER.bytes / 1_000_000).toFixed(1)} MB`;

/**
 * Whether the shipped installer carries an Authenticode signature.
 *
 * Flip to `true` only once `release.yml` is actually signing (see the product
 * repo's docs/CODE_SIGNING.md). The /install page reads this to decide
 * whether to explain the "Unknown publisher" wall or the milder
 * named-publisher prompt — getting it wrong makes the page dishonest, which
 * is worse than not having the page.
 */
export const INSTALLER_SIGNED = false;

/** Every routable page, used to emit the sitemap. Keep in sync with src/pages. */
export const ROUTES = [
  '/',
  '/install',
  '/changelog',
  '/buy',
  '/about',
  '/press',
  '/privacy',
  '/terms',
] as const;
