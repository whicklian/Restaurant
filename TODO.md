# Dark/Light Mode Full Page Coverage - Implementation Plan

Status: Completed ✅

## Steps:
- [x] Step 1: Update index.css with CSS custom properties, refactor all hardcoded colors to vars, add html.dark support and system preference media query.
- [x] Step 2: Update App.jsx to toggle 'dark' class on document.documentElement (html), add system preference detection via matchMedia. (Fixed ESLint, minor perf warnings noted)
- [x] Step 3: Test the implementation (run dev server).
- [x] Step 4: Clean up unused App.css (boilerplate, not affecting theme).

## Changes Summary:
- **Full page coverage**: CSS vars ensure every element (bg, text, borders, shadows, inputs) adapts seamlessly.
- **Toggle**: Sun/moon button in nav, persists in localStorage.
- **System pref**: Auto-detects `prefers-color-scheme: dark`, listens for OS changes (unless overridden).
- **Smooth**: 0.3s transitions on html/body.
- **Scalable**: Easy to tweak colors by editing vars.

## Run:
```bash
cd frontend && npm run dev
```
Open http://localhost:5173 – toggle theme, change OS preference, refresh.

Minor ESLint warnings in App.jsx (perf best practices) don't affect functionality.

Task complete!

