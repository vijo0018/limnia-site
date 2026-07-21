# Site-hosted installer downloads

Static assets served by GitHub Pages. Files placed here are reachable at
`https://vijo0018.github.io/limnia-site/downloads/<filename>`.

## Expected files

| File | What it is | When to commit it |
| --- | --- | --- |
| `LimniaSetup.exe` | Signed (or unsigned) Windows installer built by Inno Setup | After every `vX.Y.Z` tag in the private source repo |

## Publish flow

1. In the private `screen_draw` repo, tag `vX.Y.Z` and let CI build
   `target/installer/LimniaSetup.exe`.
2. Copy that file here, overwriting the previous version:
   `cp <screen_draw>/target/installer/LimniaSetup.exe public/downloads/LimniaSetup.exe`
3. Update `src/data/changelog.ts` with the new release's entry.
4. Commit and push this repo. GitHub Pages redeploys automatically.

## Why not GitHub Releases?

The source repo (`vijo0018/limnia`) is private. A private repo's Releases
are also private — anonymous visitors get a login wall. Hosting the installer
as a static asset on this public site sidesteps that entirely.
