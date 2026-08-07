// Use-case landing pages.
//
// These exist for search intent the homepage can't serve: one page can't rank
// for "annotate screen while presenting" AND "draw on screen while teaching"
// AND "annotate stream live" - each needs its own H1 in the audience's own
// vocabulary. See docs/MARKETING.md in the product repo for the target terms.
//
// Rule: no competitor is named on any of these pages, ever. Comparison copy
// goes stale the moment someone else changes their pricing, and a claim we've
// stopped maintaining is the opposite of the brand. State facts about Limnia
// and let readers do their own arithmetic.
//
// Everything asserted here must be true of the shipping build. Anything Pro
// is labelled Pro.

export type Step = { key: string; body: string };

export type UseCase = {
  slug: string;
  /** Browser/tab title. */
  title: string;
  /** Page H1 - this is the search-intent match, keep it literal. */
  heading: string;
  /** Meta description. */
  description: string;
  /** Short label for the eyebrow. */
  eyebrow: string;
  /** Opening paragraph - the problem, in their words. */
  intro: string;
  /** Screenshot from public/screenshots/. */
  shot: string;
  shotAlt: string;
  /** The workflow, as keystroke + what happens. */
  steps: Step[];
  /** Why it fits this audience specifically. */
  points: { title: string; body: string }[];
  /** Honest caveat. Every page has one - it's the brand. */
  caveat: string;
};

export const useCases: UseCase[] = [
  {
    slug: 'presenting',
    title: 'Annotate your screen while presenting · Limnia',
    heading: 'Annotate your screen while presenting.',
    description:
      'Circle a bullet, draw an arrow, and clear it again without leaving your slides. A 2 MB Windows overlay that sits on top of any app.',
    eyebrow: 'presenting',
    intro:
      "You're mid-slide and you need to point at one line. Switching to a whiteboard app loses the room, and your laser pointer doesn't exist on a shared screen. Limnia puts a pen on top of whatever is already there.",
    shot: 'screenshots/in-slides.png',
    shotAlt: 'Limnia circling a bullet on a slide, with its toolbar above',
    steps: [
      { key: 'Ctrl+Shift+D', body: 'The toolbar appears and the screen becomes drawable. Your slides keep running underneath.' },
      { key: 'P', body: 'Pen. Circle the bullet you are talking about.' },
      { key: 'A', body: 'Arrow. Point at the thing that matters.' },
      { key: 'Ctrl+Shift+C', body: 'Clear the canvas but stay in draw mode, ready for the next slide.' },
      { key: 'Ctrl+Shift+D', body: 'Gone. Back to clicking through your deck as normal.' },
    ],
    points: [
      {
        title: 'It works over any app',
        body: 'PowerPoint, Google Slides in a browser, a PDF, a Figma board. Limnia draws on the screen, not inside a document, so it never cares what it is sitting on top of.',
      },
      {
        title: 'It disappears completely',
        body: 'Outside draw mode every pixel is fully transparent, so clicks pass straight through to the app underneath. There is no window to move out of the way.',
      },
      {
        title: 'Nothing to set up mid-talk',
        body: 'One hotkey in, one hotkey out, and single letters to switch tools. Your last-used tool, color, and brush size are remembered between sessions.',
      },
      {
        title: 'Multi-monitor aware',
        body: 'The overlay spans every display, so it still works when your deck is on the projector and your notes are on the laptop.',
      },
    ],
    caveat:
      'Limnia draws on the screen, not into your slides, so annotations are not saved back into the deck. Press Ctrl+Shift+S to keep one as a PNG before you clear it.',
  },
  {
    slug: 'teaching',
    title: 'Draw on your screen while teaching online · Limnia',
    heading: 'Draw on your screen while teaching.',
    description:
      'Mark up anything you are sharing in Zoom, Teams, or Meet. Every drawing tool is free forever, with no account and no telemetry.',
    eyebrow: 'teaching',
    intro:
      "Screen-share annotation is built into some meeting tools, missing from others, and different in all of them. Limnia is the same pen in every one of them, because it draws on your screen rather than inside the call.",
    shot: 'screenshots/in-slides.png',
    shotAlt: 'Limnia circling a line of teaching material, with its toolbar above',
    steps: [
      { key: 'Ctrl+Shift+D', body: 'Draw mode on. Whatever you are sharing keeps playing underneath.' },
      { key: 'H', body: 'Highlighter. Sweep the line the class should be looking at.' },
      { key: 'T', body: 'Text. Label a diagram without opening an editor.' },
      { key: 'Ctrl+Z', body: 'Undo, up to 20 steps. Nobody sees a stray stroke for long.' },
      { key: 'Ctrl+Shift+S', body: 'Save the annotated screen as a PNG to post afterwards.' },
    ],
    points: [
      {
        title: 'Same tool in every meeting app',
        body: 'Because it sits above the screen, it behaves identically in Zoom, Teams, Meet, or a recorded lecture. Nothing to relearn per platform.',
      },
      {
        title: 'Free forever, for the whole class',
        body: 'All 11 drawing tools, the full palette, undo/redo and PNG export are free, permanently. There is no per-seat licence and no account to create.',
      },
      {
        title: 'No telemetry',
        body: 'Limnia makes no network requests in normal use. Nothing about your lesson, your screen, or your students leaves the machine.',
      },
      {
        title: 'Readable on anything',
        body: 'High-contrast colors and dark chrome stay legible over white worksheets, dark slides, photographs, and video alike.',
      },
    ],
    caveat:
      'Whiteboard and blackboard modes (a solid canvas to draw on rather than an overlay) are Pro. Drawing over what is already on screen is free.',
  },
  {
    slug: 'streaming',
    title: 'Annotate your stream live · Limnia',
    heading: 'Annotate your stream, live.',
    description:
      'Draw over gameplay or a tutorial while you stream. Click-through means the overlay never eats an input, and it captures cleanly in OBS.',
    eyebrow: 'streaming',
    intro:
      "Explaining something on stream usually means pointing with your mouse and hoping. Limnia lets you actually draw on it, then clear it and keep playing without the overlay ever swallowing a click.",
    shot: 'screenshots/in-video.png',
    shotAlt: 'Limnia circling a detail on a paused video frame, with its toolbar above',
    steps: [
      { key: 'Ctrl+Shift+D', body: 'Draw mode on, mid-stream. No window pops up, no scene switch.' },
      { key: 'X', body: 'Laser pointer. A fading trail for pointing at something quickly.' },
      { key: 'S', body: 'Spotlight. Dim everything except the part you are talking about.' },
      { key: 'Ctrl+Shift+C', body: 'Clear and carry on.' },
      { key: 'Esc', body: 'Out of draw mode, straight back to your inputs.' },
    ],
    points: [
      {
        title: 'It never eats an input',
        body: 'Outside draw mode the overlay is fully transparent and clicks pass through it. Nothing is intercepted between you and the game.',
      },
      {
        title: 'It shows up in Display Capture',
        body: 'Limnia composites onto the desktop, so OBS Display Capture picks it up with no extra setup. Game Capture hooks the game directly and will not include it, so use a display or window source for the annotated view.',
      },
      {
        title: 'No GPU cost',
        body: 'Rendering is pure software on the CPU, so it takes nothing from the GPU budget you are already spending on the game and the encoder.',
      },
      {
        title: 'Expressive without being heavy',
        body: 'A 14-color palette, four brush sizes, laser trails and spotlight, in a 1.2 MB app with no runtime to load.',
      },
    ],
    caveat:
      'Limnia annotates; it does not stream. Screen recording to MP4 or GIF, and region capture, are Pro tools. For live streaming you still want OBS.',
  },
  {
    slug: 'code-review',
    title: 'Mark up code in a review or pairing session · Limnia',
    heading: 'Mark up code while you pair.',
    description:
      'Circle the line, draw the arrow, move on. A 2 MB Windows overlay in Rust that draws over any editor, terminal, or diff.',
    eyebrow: 'code review',
    intro:
      '"The bug is on the line above the one you are looking at" is a sentence nobody should have to say. Draw on it instead: over your editor, a terminal, a diff in a browser, or someone else\'s shared screen.',
    shot: 'screenshots/in-code.png',
    shotAlt: 'Limnia highlighting a line of code with an arrow pointing at it, toolbar above',
    steps: [
      { key: 'Ctrl+Shift+D', body: 'Draw mode on, over whatever editor or terminal is in front of you.' },
      { key: 'H', body: 'Highlighter. Sweep the line in question.' },
      { key: 'A', body: 'Arrow. Point from your comment to the code.' },
      { key: 'Ctrl+Shift+S', body: 'Save it as a PNG to drop into the PR thread.' },
      { key: 'Esc', body: 'Out, and back to typing.' },
    ],
    points: [
      {
        title: 'Honest about what it is',
        body: 'Pure Win32, software-rendered, no GPU, no framework, no runtime beyond the Windows API. The app is 1.2 MB. Written in Rust.',
      },
      {
        title: 'Click-through by construction',
        body: 'A fullscreen layered window where alpha = 0 is genuinely transparent to input. Not a heuristic, not a hit-test hack: the compositor simply routes the click past it.',
      },
      {
        title: 'Nothing phones home',
        body: 'No telemetry, no analytics, no crash reporter, no auto-update check. Settings are a JSON file in %APPDATA%.',
      },
      {
        title: 'Copy straight to the clipboard',
        body: 'Copy the canvas on its own, or composited with the screen behind it, and paste it into the review thread.',
      },
    ],
    caveat:
      'It draws on pixels, not on your code, so there is no editor integration and no link back to a line number. That is the point: it works the same over vim, an IDE, a terminal, or a screenshot someone pasted in chat.',
  },
];
