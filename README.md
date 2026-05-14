# Diff Checker

A code diff checker powered by Monaco Editor. Compare original and modified code side-by-side with syntax highlighting, auto-language detection, and dark/light theme.

**Live:** https://diff-checker.miftahafina.com

## Features

- **Side-by-Side Diff** — real-time diff with Monaco Editor
- **Mobile Friendly** — Before/After tabs on screens ≤768px
- **Auto Language Detection** — detects language from code content
- **Dark/Light Theme** — toggle with persistent preference
- **Sticky Footer Controls** — language switcher & auto-detect always at bottom
- **Persistent Data** — editor content saved to localStorage across sessions
- **Clear All** — reset both editors instantly

## Usage

Open `index.html` in any browser. No build step required.

- Type code in Original (left) and Modified (right) panels
- Select language manually or keep auto-detect enabled
- Click theme toggle to switch dark/light mode
- Click **Clear** to reset both editors

## Tech

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) v0.45 — same engine as VS Code
- Vanilla JavaScript (no frameworks, no build tools)
- CSS Custom Properties for theming
- localStorage for persistence

## Author

[miftahafina](https://github.com/miftahafina)
