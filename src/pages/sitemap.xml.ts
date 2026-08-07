// Hand-rolled sitemap.
//
// @astrojs/sitemap would work, but it wants to own `site` + `base` handling
// and this site is mounted at a GitHub Pages subpath, which is exactly where
// that integration's URL joining gets fiddly. Eight static routes don't
// justify the dependency - the route list lives in lib/site.ts.

import type { APIRoute } from 'astro';
import { SITE_URL, ROUTES } from '../lib/site';

export const GET: APIRoute = () => {
  const urls = ROUTES.map((route) => {
    const loc = `${SITE_URL}${route === '/' ? '/' : route}`;
    // The homepage is the entry point; /install is the conversion page.
    const priority = route === '/' ? '1.0' : route === '/install' ? '0.9' : '0.6';
    return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
