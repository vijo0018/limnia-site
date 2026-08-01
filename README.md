# Limnia · marketing site

[![Deploy to GitHub Pages](https://github.com/vijo0018/limnia-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/vijo0018/limnia-site/actions/workflows/deploy.yml)

The website for **[Limnia](https://vijo0018.github.io/limnia-site/)**, a tiny screen-overlay drawing tool for Windows. Press a hotkey, draw on whatever is on screen, press it again and it's gone.

This repo is the site only: the storefront, the docs surface, and the download page. The app itself is written in Rust against the raw Win32 API (~2 MB, no telemetry, no GPU) and is closed source; its [changelog](https://vijo0018.github.io/limnia-site/changelog) is public here.

**Live site: [vijo0018.github.io/limnia-site](https://vijo0018.github.io/limnia-site/)**

## Stack

- [Astro 6](https://astro.build) with MDX
- [Tailwind CSS 4](https://tailwindcss.com)
- Deployed to GitHub Pages by [`deploy.yml`](.github/workflows/deploy.yml) on every push to `main`

## Development

Bun is the package manager.

```sh
bun install
bun dev        # local dev server at localhost:4321
bun build      # production build to ./dist/
bun preview    # preview the production build
```

## Issues

Found a problem with the site, or with Limnia itself? [Open an issue](https://github.com/vijo0018/limnia-site/issues). This tracker is the public contact channel for both.

## Support

If Limnia earns a place in your workflow, tips fund the code-signing certificate and future releases: [Ko-fi](https://ko-fi.com/vijo0018) · [GitHub Sponsors](https://github.com/sponsors/vijo0018).
