# Diff Checker

A side-by-side code comparison tool powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/). No build step, no dependencies — just open and use.

## Features

- **Side-by-side diff** — original & modified editors, both editable
- **16 languages** — JavaScript, TypeScript, Python, HTML, CSS, JSON, XML, Markdown, SQL, Java, C++, C#, Go, Rust, PHP, YAML
- **Dark/light theme** — toggle with one click, persists across sessions
- **Auto-save** — content saved to `localStorage` on every change
- **Clear all** — reset both editors instantly

## Usage

Open `index.html` in any browser:

```bash
open index.html
```

Or serve locally:

```bash
npx serve .
```

## Tech Stack

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) v0.45 — CDN-loaded
- Vanilla JavaScript — zero framework, zero build tools
- CSS Custom Properties — theming via `[data-theme]`
- `localStorage` — content & theme persistence

## Author

**Miftah Afina** — [GitHub](https://github.com/miftahafina)

Live at [diff-checker.miftahafina.com](https://diff-checker.miftahafina.com)