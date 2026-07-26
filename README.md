# Diff Checker

A side-by-side code comparison tool powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/).

## Features

- **Side-by-side diff** — original & modified editors, both editable
- **16 languages** — JavaScript, TypeScript, Python, HTML, CSS, JSON, XML, Markdown, SQL, Java, C++, C#, Go, Rust, PHP, YAML
- **Dark/light theme** — toggle with one click, persists across sessions
- **Auto-save** — content saved to `localStorage` on every change
- **Clear all** — reset both editors instantly

## Usage

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Tech Stack

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — bundled via Vite
- [Vite](https://vitejs.dev/) — dev server & build
- Vanilla JavaScript — zero framework
- CSS Custom Properties — theming via `[data-theme]`
- `localStorage` — content & theme persistence

## Author

**Miftah Afina** — [GitHub](https://github.com/miftahafina)

Live at [diff-checker.miftahafina.com](https://diff-checker.miftahafina.com)