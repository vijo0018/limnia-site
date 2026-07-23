# Limnia Site Refresh — Design Spec

**Date:** 2026-07-23
**Branch:** `rename/limnia`
**Status:** Draft for review

## Context

The site was renamed OmniDraw → Limnia (commit `085c4fe`), but the rename only
reached the *text*. Two problems remain:

1. **The brand mark is still OmniDraw.** `public/icon.svg` is an "almost-closed
   **O**" (for **O**mniDraw) with a marker lifting off it; `public/og.svg` reuses
   the same mark. The product is now **Limnia** (Greek *límnē*, a still pool) and
   the O no longer connects to the name.
2. **The site describes an older, smaller product.** A source-of-truth scan of
   the product repo (`C:\dev\screen_draw`, Rust) shows the shipping binary has
   **12 drawing tools + Grid, Boards, Eyedropper, Orb layout, and a full Pro
   tier** — well beyond the 10 tools the site presents. Several site claims are
   now factually wrong (license, "coming soon" features that already ship).

The audience (developers, streamers, educators) will download and immediately
notice the gap. **Accuracy is the marketing here** — over-claiming or
under-claiming both cost credibility.

## Goals

- Make the site accurate to the current shipping build (confirmed live: full
  12-tool build + Pro features).
- Replace the OmniDraw mark with a Limnia ripple mark, unified across site and
  product repo.
- Make the site *itself* demonstrate the product (raise "intrigue") via a live,
  multi-tool on-page draw demo.
- Keep Pro deliberately downplayed; Free is the star.
- Stay inside the established design system (`CLAUDE.md`): restrained surfaces,
  expressive accent *moments*, palette locked to in-product tool colors,
  semantic tokens, light-theme-ready.

## Locked decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Scope | **Full refresh** — content sync + new icon + live playground demo + ripple motif |
| Icon | **Candidate A — "Still ripple"** (concentric almost-closed rings + pen-cyan center) |
| Pro presentation | **Downplayed** — dominant Free, slim Pro teaser |
| Pro price (when shown) | **$14.99 one-time** |
| Release status | **Full 12-tool build is live now** → present everything as "available now" |

## Non-goals (explicitly out of scope)

- Writing the personal narrative in `about.astro` (`[YOUR NAME]` / `[YOUR STORY]`)
  — that is the owner's voice. Only the *factual* "what it's made of" block is
  corrected.
- Wiring real Tally / Payhip form IDs (none provided).
- Generating product screenshots or the hero demo video. The existing
  build-time auto-swap placeholders in `InAction.astro` stay until real assets
  are dropped in `/public`.
- Flipping on the light theme. New work must be light-*ready* (semantic tokens,
  no hard-coded hex where avoidable), but the site stays `color-scheme: dark`.

---

## 1 · The icon — "Still ripple" (Candidate A)

**Concept:** concentric ripple rings on a still surface, each *almost closed*
with a gap — a deliberate bridge from the old almost-closed-O, reinterpreted as
ripples. A bright pen-cyan center reads as the point where a mark lands.

**Master SVG spec** (`public/icon.svg`, viewBox `0 0 256 256`):
- Rounded square, `rx=56`, background vertical gradient `#2c2c30 → #18181a`.
- Subtle top highlight band, white at `opacity 0.045`.
- Three concentric rings, `stroke` = cyan gradient `#1e9bff → #60cbff`,
  `stroke-linecap=round`, soft glow (`feGaussianBlur stdDeviation ≈ 5`):
  - r=108, width 6, opacity 0.20, single dash-gap, rotated ≈ −70°
  - r=78, width 8, opacity 0.48, single dash-gap, rotated ≈ −55°
  - r=46, width 11, opacity 0.92, single dash-gap, rotated ≈ −62°
- Center dot r≈14–15, cyan fill, with glow behind.

**Favicon variant** (`public/favicon.svg`, new): reduced to **1 ring
(r≈72, width 16) + center dot (r≈26)** so it stays crisp at 16px. `Layout.astro`
`<link rel="icon">` points at `favicon.svg`; the nav wordmark keeps using the
full `icon.svg`.

**OG image** (`public/og.svg`): replace the "mini marker O" brand mark
(top-left) with the ripple mark; retune the hand-drawn cyan underline so it
reads with the new mark. Keep the poster headline and metadata strip.

**Product repo hand-off:** deliver the identical master SVG for the owner to
drop into `screen_draw/assets/icon.svg`. Its `build.rs` regenerates the
multi-size `.ico` (16/24/32/48/64/128/256). This keeps app, tray, and site one
mark. *(Editing the product repo is out of scope for this site pass — the SVG is
handed over, not committed there by us.)*

## 2 · Ripple motif (restrained accent)

Personality lives in *moments*, not everywhere (`CLAUDE.md` principle 2):
- Faint, low-opacity ripple rings behind the hero right-column diagram / near
  the "live" status dot.
- A ripple pulse at the pointer when a stroke starts in the on-page demo.
- Reuse existing `pulse` keyframe language; all motion respects
  `prefers-reduced-motion` (static fallback).

## 3 · Content accuracy sync (authoritative data)

Source of truth = product Rust source. Apply to these components:

### `ToolsToolbar.astro`
- Headline "Ten tools, one toolbar." → **"Twelve tools, one toolbar."**
- Add tools: **Ruler** (`M`, live distance + angle; ephemeral, accent cyan
  `#7fd4ff`) and **Magnifier** (`Z`, Pro; live lens; mark it Pro).
- Add a **utilities** row/legend: **Grid** (`G`), **Eyedropper** (`I`),
  **Whiteboard/Blackboard** (`W`/`B`, Pro).
- Add a short note on the **Orb** layout — a draggable radial tool menu as an
  alternative to the classic bar (distinctive, currently unmentioned).
- Palette swatch count stays 14 (correct).

### `ShortcutsTable.astro`
- Tools group: add `M` Ruler, `Z` Magnifier (Pro), `I` Eyedropper, `G` Grid
  toggle, `W` Whiteboard (Pro), `B` Blackboard (Pro).
- Global group: add `Ctrl+Shift+R` Record MP4 (Pro), `Ctrl+Shift+G` Record GIF
  (Pro); add `Ctrl+C` copy (draw mode); note the cascading `Esc`.
- Mark Pro shortcuts with a small "Pro" affordance.
- **Verify** the "All shortcuts are remappable in v1.2" line — the scan found no
  remapping shipped. Default: remove or soften to avoid a false roadmap claim.

### `FreeVsPro.astro` (rebuild the split; downplay Pro)
Authoritative split:

**Free (available now):**
- 11 drawing tools: Pen, Highlighter, Eraser, Line, Arrow (single/double/dashed),
  Rectangle, Circle, Text, Laser, Spotlight, Ruler
- Grid overlay, Eyedropper
- 14-color palette + native custom picker + 4 custom preset slots
- 4 brush sizes, 20-step undo/redo
- PNG export + clipboard copy (canvas or composited with screen)
- Multi-monitor capture with picker (All / Primary / per-monitor)
- Named style presets
- Classic **and** Orb (radial) toolbar layouts
- System tray, single-instance, per-monitor DPI, auto-start option, first-run
  onboarding

**Pro (one-time $14.99):**
- Magnifier (live lens)
- Screen recording (MP4, H.264, on-screen REC timer)
- GIF recording
- Region capture (drag-select)
- System / mic audio capture
- Whiteboard / Blackboard canvases

**Layout change:** collapse the two equal cards into a **dominant Free card +
a slim Pro teaser strip** ("heavier tools, one-time $14.99, coming to the store
soon"). Remove the fictional `v2.0 / v2.1` roadmap version tags — those features
exist now as Pro. Drop the large email waitlist form (Pro is downplayed);
supporter-perk messaging moves entirely to the Support section.

### `Footer.astro`
- **license: MIT → Proprietary** (© 2026 Vidar). This is the most important
  factual correction.
- Keep version `v1.0.0` / `~2 MB` unless the owner confirms a version bump
  (see Open Items).

### `HowItWorks.astro`
- Keep the software-rendered / layered-window / alpha=0 explanation (accurate
  for the free overlay).
- Add one honest line: Pro screen recording *does* use the GPU (DXGI Desktop
  Duplication + Direct3D 11 + Media Foundation). Showing the seam is on-brand.
- Facts list can add: `edition 2024`, `licensing: offline (Ed25519)`,
  `telemetry: never`.

### `Hero.astro` / stats strip
- Keep "Draw on your screen." headline.
- The "**No GPU**" badge stays but is scoped to the drawing overlay; the nuance
  lives in HowItWorks so the badge isn't a blanket claim.
- Subhead may broaden slightly to reflect the fuller toolset without bloating.

### `changelog.ts`
- Full build is live → fold the current "Unreleased" items (Spotlight, grid,
  ruler, arrow variants, single-key shortcuts, monitor picker, layered toolbar)
  into the shipped release list. Add the previously-missing shipped features
  (Magnifier, Eyedropper, Boards, Orb layout, Pro recording/GIF/region/audio,
  offline licensing).
- Version label to confirm (see Open Items) — default: list the full feature set
  under the current stable release rather than inventing a new version/date.

### `about.astro` (factual block only)
- "what it's made of" section: confirm Rust **edition 2024**, offline Ed25519
  licensing, **Proprietary** license (the page already says source is closed —
  good). Leave all `[YOUR ...]` narrative untouched.

## 4 · The intrigue engine — live mini-Limnia demo

Upgrade the on-page demo in `Layout.astro` (today: a single cyan pen) into a
small tool switcher that mirrors the product.

**Tools (4):**
- **Pen** — solid cyan `#32b4ff`, ~3px.
- **Highlighter** — yellow `#ffdc28`, wide (~16px), translucent (alpha ≈ 0.35).
- **Laser** — red `#ff3c3c`, glowing dot with a **fading trail** (points fade
  ~800ms), never persisted.
- **Spotlight** — dims the page except a radius around the cursor.

**Interaction:**
- `Ctrl+Shift+D` toggles draw mode (existing). In draw mode a minimal floating
  toolbar (bottom-center) shows the 4 tools + a Clear button.
- Single keys **`P` `H` `X` `S`** switch tools live — *the same keys as the
  product* — reinforcing "keyboard-first."
- `Esc` exits (existing). `data-demo-trigger` buttons still toggle.

**Quality bars:**
- `prefers-reduced-motion`: disable laser fade / spotlight smoothing; tools still
  function statically.
- Pointer events (mouse + touch) as today; laser/spotlight rendered on
  `requestAnimationFrame`, cleaned up on exit.
- Toolbar buttons have accessible labels; canvas stays `aria-hidden`; the
  existing `role="status"` live region announces mode.
- No layout shift; demo chrome uses existing tokens.

## Data / architecture notes

- The site is fully static (Astro components + one client script per interactive
  piece). No new dependencies. The playground stays vanilla Canvas 2D in
  `Layout.astro`'s inline module script, extended — not a framework.
- Tool/shortcut/feature data stays in the component frontmatter arrays (the
  existing pattern), so the content is co-located with its markup.
- Icon is a static asset; `favicon.svg` is additive.

## Verification

- `npm run build` completes with no Astro/TS errors.
- Local preview (`npm run dev`): new icon renders in tab + nav; demo tool
  switching works via `P/H/X/S`; laser fades; spotlight dims; reduced-motion
  path is sane.
- Grep sweep for stale strings: `OmniDraw`, `MIT`, `Ten tools` / `10 tools`,
  `v1.1`/`v2.0`/`v2.1` roadmap tags, "signature O".
- Cross-check every tool/shortcut/feature line against this spec's authoritative
  lists.

## Open items to confirm during spec review

1. **Version label for the changelog** — keep `v1.0.0` as the live release
   listing the full feature set, or have you cut a `v1.1.0`? If bumping, give the
   version + date and the changelog will be split accordingly.
2. **"~2 MB"** — the release binary wasn't built during the scan (debug is
   2.43 MB). Keep "~2 MB" or update once the release size is known.
3. **"Remappable in v1.2"** shortcut note — remove (no remapping found shipped),
   or is it a real roadmap item to keep?
4. **Sponsors / Ko-fi links** — the product repo's `FUNDING.yml` has them
   commented out. Keep the site links live (default), or hide until enabled?
