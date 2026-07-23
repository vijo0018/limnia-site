// Release history. Keep in sync with ../../../screen_draw/CHANGELOG.md
// whenever a new version ships. (The site is a separate public repo; the
// app's private repo is the canonical source of truth.)
//
// NOTE: the full 12-tool build + Pro features are live now. They're listed under
// the current stable release below. If you cut a tagged release beyond v1.0.0,
// split this into a new entry (version + ISO date) rather than growing v1.0.0.

export type ChangeGroup = {
  label: 'Added' | 'Changed' | 'Fixed' | 'Removed' | 'Security';
  items: string[];
};

export type Release = {
  version: string;
  date: string; // ISO yyyy-mm-dd, or '' for unreleased
  status: 'stable' | 'unreleased' | 'planned';
  groups: ChangeGroup[];
};

export const releases: Release[] = [
  {
    version: 'v1.0.0',
    date: '2026-04-17',
    status: 'stable',
    groups: [
      {
        label: 'Added',
        items: [
          'Transparent, click-through overlay for drawing anywhere on screen: `alpha = 0` hit-testing, spanning the full multi-monitor virtual desktop.',
          '12 tools: Pen, Highlighter, Eraser, Line, Arrow (single / double / dashed), Rectangle, Circle, Text, Laser Pointer, Spotlight, Ruler, and Magnifier.',
          'Grid overlay, Eyedropper (pick any pixel on screen), and named style presets.',
          '14-color palette, native Windows custom color picker, and 4 custom-color preset slots.',
          '4 brush sizes and 20-step undo / redo.',
          'PNG export (Ctrl+Shift+S), clipboard copy (canvas alone or composited with the screen), and multi-monitor capture with a monitor picker.',
          'Single-key tool shortcuts in draw mode (P H E L A R C T X S M Z I G W B).',
          'Two toolbar layouts: a Classic bar and a draggable Orb radial menu.',
          'System tray icon with right-click menu, single-instance enforcement, per-monitor DPI awareness, and an optional start-with-Windows setting.',
          'First-run onboarding card; crash hook writing fatal errors to `%APPDATA%\\Limnia\\crash.log`.',
          'Inno Setup installer with optional desktop shortcut and auto-start.',
          'Limnia Pro (one-time unlock, verified offline via Ed25519, with no server or phone-home): Magnifier, MP4 screen recording, GIF recording, region capture, system / mic audio capture, and Whiteboard / Blackboard canvases.',
        ],
      },
    ],
  },
];
