// Rasterizes public/og.svg -> public/og.png (1200x630).
//
// Why this exists: X, LinkedIn, Facebook, Slack and Discord all refuse to
// render an SVG og:image. Pointing og:image at the SVG made every shared
// Limnia link preview as a bare text card with no artwork. The PNG is
// committed (social crawlers fetch it directly, so it must exist as a static
// file), and this script keeps it regenerable instead of a hand-exported blob.
//
//   bun run og
//
// Re-run it after any edit to public/og.svg — CI does not do this for you.

import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = resolve(root, 'public/og.svg');
const out = resolve(root, 'public/og.png');

const svg = readFileSync(src, 'utf8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    // The SVG asks for system UI / mono stacks. Load whatever the host has
    // plus the site's own bundled families so the render is as close to the
    // browser as we can get headlessly.
    fontDirs: [
      resolve(root, 'node_modules/@fontsource-variable/bricolage-grotesque/files'),
      resolve(root, 'node_modules/@fontsource-variable/geist/files'),
      resolve(root, 'node_modules/@fontsource-variable/geist-mono/files'),
    ],
    loadSystemFonts: true,
  },
});

writeFileSync(out, resvg.render().asPng());

const kb = (readFileSync(out).byteLength / 1024).toFixed(0);
console.log(`og.png written — 1200x630, ${kb} KB`);
