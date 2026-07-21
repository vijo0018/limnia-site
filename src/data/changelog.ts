// Release history. Keep in sync with ../../../screen_draw/CHANGELOG.md
// whenever a new version ships. (The site is a separate public repo; the
// app's private repo is the canonical source of truth.)

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
    version: 'Unreleased',
    date: '',
    status: 'unreleased',
    groups: [
      {
        label: 'Added',
        items: [
          'Monitor picker for Save/Copy capture on multi-monitor setups.',
          'Spotlight tool: dims the screen except around the cursor.',
          'Single-key tool shortcuts in draw mode (P, H, E, L, A, R, C, T, X, S).',
        ],
      },
      {
        label: 'Changed',
        items: [
          'Toolbar rewritten as a separate layered window so buttons never get stamped over by laser / shape previews.',
          'Save and Copy now share the composite-capture path; the standalone Screenshot action was removed.',
          'Upgraded to Rust edition 2024 and the windows crate 0.62.',
        ],
      },
      {
        label: 'Fixed',
        items: [
          'Toolbar is re-raised after laser frames so buttons stay clickable during laser animation.',
          'Laser trail is cleared when switching away from the Laser Pointer tool.',
        ],
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-04-17',
    status: 'stable',
    groups: [
      {
        label: 'Added',
        items: [
          'Transparent, click-through overlay for drawing anywhere on screen.',
          'Tools: Pen, Highlighter, Eraser, Line, Arrow, Rectangle, Circle, Text, Laser Pointer.',
          '14-color palette plus a native Windows custom color picker.',
          '20-step undo / redo history.',
          'PNG export (Ctrl+Shift+S), clipboard copy, and screenshot-with-annotations.',
          'System tray icon with right-click menu and single-instance enforcement.',
          'Per-monitor DPI awareness spanning the full virtual desktop.',
          'Inno Setup installer with optional desktop shortcut and auto-start-with-Windows.',
          'Crash hook writing fatal errors to %APPDATA%\\Limnia\\crash.log.',
        ],
      },
    ],
  },
];
