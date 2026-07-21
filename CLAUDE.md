# Limnia Site

Marketing landing site for **Limnia**, a tiny Windows screen-overlay drawing tool (Rust + Win32). Astro 6 + Tailwind 4 + MDX. Deployed to GitHub Pages at `vijo0018.github.io/limnia-site`.

The **product** lives at `github.com/vijo0018/limnia`. This **site** is the storefront, the docs surface, and the funnel toward Free download / Pro waitlist / sponsorship.

## Design Context

### Users

Three audiences sit side-by-side, none dominant:

- **Presenters & educators** — circling a slide, calling out a bug in a code review, drawing on a lecture screen. Need it to feel calm, reliable, ready in one keystroke.
- **Streamers & creators** — annotating live on Twitch/YouTube, drawing over gameplay or tutorials. Need it to feel responsive and visually expressive.
- **Developers & technical users** — pairing, demoing, debugging. Need it to feel honest about what it is (Win32, Rust, ~2 MB, no telemetry) — credibility comes from the seams showing.

The unifying job-to-be-done across all three: **"I need to draw on my screen *right now*, then disappear."** Every design decision should reinforce immediacy and click-through invisibility — the product is invisible until needed, the site should make that feel obvious.

### Brand Personality

**Playful & bold, on a precise foundation.** Three words: *immediate, expressive, honest*.

Not "calm minimalism" alone — that would underplay the product. Not "loud SaaS energy" — that would betray its indie-dev honesty. The synthesis: **restrained surfaces with expressive accent moments.**

- **Voice**: direct, slightly opinionated, technically literal. "Press a hotkey, annotate, vanish." No hedging, no marketing fluff.
- **Tone**: confident without being smug. Willing to show implementation details (alpha = 0 click-through, pure Win32, no GPU) as proof of craft, not as gatekeeping.
- **Emotional goal**: the user feels they've found a *small sharp tool* — like a great keyboard, a great CLI, a great pen. Not impressed by the marketing, impressed by the thing.

### Aesthetic Direction

**References (lean into):**
- **Linear / Vercel / Tailscale** — discipline of the foundation: tight typography, generous whitespace, restrained accent color, technical credibility, no visual noise.
- **Raycast / Arc / Cron** — energy of the moments: expressive accent use, playful gradients in *specific* spots (the Pro card already does this well), animated demos, hover states with personality.
- **Obsidian / classic indie-dev** — honesty of the framing: README-feeling sections, real screenshots over hero illustrations, "Made in Rust" badges shown without irony.

**Anti-references (avoid at all costs):**
- Corporate SaaS landing pages — no "Trusted by..." logo walls, no stock illustrations of diverse people pointing at laptops, no vague gradient hero behind generic copy.
- Over-designed hero sections that hide what the product *is*. The demo GIF should land above the fold or close to it.
- Marketing-speak: "elevate your workflow", "unlock your potential", "the future of...". Cut on sight.

**Theme:** Currently dark-only (`color-scheme: dark`). Goal is **proper light + dark support, soon** — so all new design tokens should be defined semantically (`--color-surface`, `--color-surface-elevated`, `--color-text-primary`, `--color-border-subtle`) rather than as raw hex aliases (`--color-bg`, `--color-chrome`). Today's tokens are raw-hex-named; treat any large styling work as an opportunity to introduce the semantic layer alongside.

**Palette anchors (already established, do not drift):**
- Accent cyan `#32b4ff` — this is also the Pen tool's color in-product. The site's primary action color *is* the product's primary tool. Preserve this link.
- Accent yellow `#ffdc28` — the Highlighter color. Use for secondary highlights, not primary actions.
- Danger red `#ff3c3c` — the Laser Pointer. Use for destructive actions and the laser/danger metaphor only.
- Text purple `#b48cff` — the Text tool. Reserved for text-related affordances if needed.

The tool palette in `ToolsGrid.astro` is the brand palette. Pulling marketing accents from product tool colors keeps the two surfaces unified.

### Design Principles

1. **Show, then tell.** The hero demo GIF/video matters more than the headline. If a section can be replaced with a screenshot of the product doing the thing, do that instead. Anti-pattern: paragraphs of feature copy with no visual proof.

2. **Restrained chrome, expressive accents.** Surfaces, borders, and typography stay disciplined (Linear-style). Personality lives in the *moments*: the accent glow on the Limnia dot in the nav, the Pro card's gradient and blur orb, the kbd elements styled like physical keys, hover states that nod to the tool colors. Pick where to be playful — don't spread it thin.

3. **Honesty is a feature.** "Pure Win32, no GPU, no framework", "~2 MB install", "No telemetry", "Made in Rust" — these are not technical asides, they are core brand. Surface them, don't bury them. The "Support development" section's mention of the code-signing certificate is *exactly* the right tone — keep that voice everywhere.

4. **Free is forever, and the site must feel that way.** The Free/Pro split is ethically structured (every shipped feature stays free; Pro is genuinely additive). The pricing section should never feel like a paywall trap. The Free card should look as desirable as the Pro card — different, not lesser.

5. **Build for the theme switch we haven't shipped yet.** New components should use semantic tokens, accept color via CSS variables, and avoid hard-coding hex values inline (the few remaining inline `style="background:..."` cases in `ToolsGrid.astro` and `index.astro` are the exceptions, not the model). Anything that won't survive a light-theme switch needs a second look before merging.
