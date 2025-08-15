# Quarterly Earnings — RevealJS Presentation

An interactive presentation (Markdown, fragments, code highlighting, math, charts, notes).

## Quick Start
```bash
npm i
npm run start   # serves at http://localhost:8000
```

## Deploy to GitHub Pages
1. Create a new public repo on GitHub (e.g., `quarterly-earnings`).
2. Push these files to the repo's `main` branch.
3. Configure Pages: **Settings → Pages → Deploy from branch → main / root**.
4. Then run:
```bash
npm run deploy
```
It will publish to the `gh-pages` branch automatically.  
Your URL will be:
```
https://<your-github-username>.github.io/<repository-name>/
```
To bust cache, append `?v=1`, `?v=2`, etc.

## Keyboard Shortcuts
- F: Fullscreen
- S: Speaker notes
- O / ESC: Overview
- B or . : Pause (black/blank)

## Print/PDF Export
```bash
npx decktape reveal http://localhost:8000 slides.pdf
```

## Notes
- Images and iframes use lazy loading where possible.
- Plugins are loaded before initialization (deferred) for performance.
- Charts are responsive SVG with `viewBox` + container scaling.

