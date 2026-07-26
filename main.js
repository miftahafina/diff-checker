const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' }, { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' }, { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' }, { id: 'json', label: 'JSON' },
  { id: 'xml', label: 'XML' }, { id: 'markdown', label: 'Markdown' },
  { id: 'sql', label: 'SQL' }, { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' }, { id: 'csharp', label: 'C#' },
  { id: 'go', label: 'Go' }, { id: 'rust', label: 'Rust' },
  { id: 'php', label: 'PHP' }, { id: 'yaml', label: 'YAML' },
];

const DEFAULTS = {
  original: `// original\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
  modified: `// modified\nfunction greet(name, greeting = "Hello") {\n  return \`\${greeting}, \${name}!\`;\n}\n\nconsole.log(greet("World"));\nconsole.log(greet("World", "Hi"));`,
};

let editor, origModel, modModel;

const sel = document.getElementById('lang-select');
const toggle = document.getElementById('theme-toggle');
const clearBtn = document.getElementById('clear-btn');

LANGUAGES.forEach(({ id, label }) => {
  const o = document.createElement('option');
  o.value = id; o.textContent = label;
  sel.appendChild(o);
});

function save() {
  localStorage.setItem('dc-original', origModel.getValue());
  localStorage.setItem('dc-modified', modModel.getValue());
}

function restoreTheme() {
  const t = localStorage.getItem('dc-theme');
  if (t === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    monaco.editor.setTheme('vs-dark');
  }
}

toggle.addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = dark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  monaco.editor.setTheme(next === 'dark' ? 'vs-dark' : 'vs');
  localStorage.setItem('dc-theme', next);
});

clearBtn.addEventListener('click', () => {
  origModel.setValue('');
  modModel.setValue('');
  localStorage.removeItem('dc-original');
  localStorage.removeItem('dc-modified');
});

sel.addEventListener('change', () => {
  const lang = sel.value;
  monaco.editor.setModelLanguage(origModel, lang);
  monaco.editor.setModelLanguage(modModel, lang);
});

require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
require(['vs/editor/editor.main'], () => {
  const lang = sel.value;
  origModel = monaco.editor.createModel(localStorage.getItem('dc-original') ?? DEFAULTS.original, lang);
  modModel = monaco.editor.createModel(localStorage.getItem('dc-modified') ?? DEFAULTS.modified, lang);

  origModel.onDidChangeContent(save);
  modModel.onDidChangeContent(save);

  editor = monaco.editor.createDiffEditor(document.getElementById('diff-editor'), {
    enableSplitViewResizing: true,
    renderSideBySide: true,
    originalEditable: true,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    diffAlgorithm: 'advanced',
  });

  editor.setModel({ original: origModel, modified: modModel });
  restoreTheme();
});