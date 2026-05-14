const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', patterns: [/\b(function|const|let|var|import|export|require|=>)\s/, /\.js$/] },
  { id: 'typescript', label: 'TypeScript', patterns: [/\b(interface|type|as|enum)\s/, /:\s*(string|number|boolean)\b/, /\.tsx?$/] },
  { id: 'python', label: 'Python', patterns: [/\b(def |class |import |from |print\()/, /\.py$/] },
  { id: 'html', label: 'HTML', patterns: [/<\/?[a-z][\s\S]*>/i, /\.html?$/] },
  { id: 'css', label: 'CSS', patterns: [/[.#][\w-]+\s*\{/, /@media/, /\.css$/] },
  { id: 'json', label: 'JSON', patterns: [/^\s*[{"\[]/, /\.json$/] },
  { id: 'xml', label: 'XML', patterns: [/<[\w]+[\s\S]*<\/[\w]+>/, /\.xml$/] },
  { id: 'markdown', label: 'Markdown', patterns: [/^#{1,6}\s/, /\[.*\]\(.*\)/, /\.md$/] },
  { id: 'sql', label: 'SQL', patterns: [/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE)\s/i, /\.sql$/] },
  { id: 'java', label: 'Java', patterns: [/\b(public|private|class|static|void|String)\s/, /\.java$/] },
  { id: 'cpp', label: 'C++', patterns: [/#include\s/, /\b(int|void|cout|cin|std::)/, /\.(cpp|cxx|cc|hpp)$/] },
  { id: 'csharp', label: 'C#', patterns: [/\b(using|namespace|class|async|await)\s/, /\.cs$/] },
  { id: 'go', label: 'Go', patterns: [/\b(package|import|func|fmt\.)\s/, /\.go$/] },
  { id: 'rust', label: 'Rust', patterns: [/\b(fn|let|mut|impl|pub|crate)\s/, /\.rs$/] },
  { id: 'php', label: 'PHP', patterns: [/<?php/, /\.php$/] },
  { id: 'yaml', label: 'YAML', patterns: [/^[\w-]+:\s/, /\.ya?ml$/] },
];

let diffEditor;
let mobileEditor;
let originalModel;
let modifiedModel;
let isDark = false;
let isMobileLayout = false;
let autoDetectEnabled = true;
let currentLang = 'javascript';
const debounceTimers = {};
const MOBILE_BREAKPOINT = 768;
const mobileMq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
const STORAGE_ORIGINAL = 'diff-checker-original';
const STORAGE_MODIFIED = 'diff-checker-modified';
const STORAGE_TAB = 'diff-checker-tab';

const $ = (sel) => document.querySelector(sel);
const langSelect = $('#lang-select');
const autoDetectCheckbox = $('#auto-detect');
const themeToggle = $('#theme-toggle');
const clearBtn = $('#clear-btn');

function populateLanguages() {
  const fragment = document.createDocumentFragment();
  LANGUAGES.forEach(({ id, label }) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = label;
    fragment.appendChild(opt);
  });
  langSelect.appendChild(fragment);
  langSelect.value = currentLang;
}

function detectLanguage(text) {
  const firstLine = text.slice(0, 500);
  for (const lang of LANGUAGES) {
    for (const pattern of lang.patterns) {
      if (pattern.test(firstLine)) return lang.id;
    }
  }
  return 'javascript';
}

function updateLanguage(lang) {
  if (!originalModel) return;

  currentLang = lang;
  langSelect.value = lang;

  if (originalModel.getLanguageId() !== lang) {
    monaco.editor.setModelLanguage(originalModel, lang);
    monaco.editor.setModelLanguage(modifiedModel, lang);
  }
}

function handleContentChange() {
  if (!autoDetectEnabled) return;

  const originalText = originalModel.getValue();
  const modifiedText = modifiedModel.getValue();
  const textToCheck = originalText || modifiedText;

  if (!textToCheck) return;

  const detected = detectLanguage(textToCheck);
  if (detected !== currentLang) {
    updateLanguage(detected);
  }
}

function saveContent() {
  if (!originalModel || !modifiedModel) return;
  localStorage.setItem(STORAGE_ORIGINAL, originalModel.getValue());
  localStorage.setItem(STORAGE_MODIFIED, modifiedModel.getValue());
}

const DEFAULT_ORIGINAL = '// original code\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n';
const DEFAULT_MODIFIED = '// modified code\nfunction greet(name, greeting = "Hello") {\n  return `${greeting}, ${name}!`;\n}\n\nconsole.log(greet("World"));\nconsole.log(greet("World", "Hi"));\n';

function loadContent() {
  return {
    original: localStorage.getItem(STORAGE_ORIGINAL) ?? DEFAULT_ORIGINAL,
    modified: localStorage.getItem(STORAGE_MODIFIED) ?? DEFAULT_MODIFIED,
  };
}

function debounce(fn, delay, key) {
  clearTimeout(debounceTimers[key]);
  debounceTimers[key] = setTimeout(fn, delay);
}

function init() {
  populateLanguages();

  require.config({
    paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' },
  });

  require(['vs/editor/editor.main'], () => {
    document.querySelectorAll('.monaco-editor').forEach((el) => el.remove());

    const saved = loadContent();

    originalModel = monaco.editor.createModel(saved.original, currentLang);
    modifiedModel = monaco.editor.createModel(saved.modified, currentLang);

    originalModel.onDidChangeContent(() => {
      debounce(handleContentChange, 300, 'autoDetect');
      debounce(saveContent, 500, 'save');
    });

    modifiedModel.onDidChangeContent(() => {
      debounce(handleContentChange, 300, 'autoDetect');
      debounce(saveContent, 500, 'save');
    });

    setupEditors();
    restoreTheme();
  });
}

langSelect.addEventListener('change', () => {
  const lang = langSelect.value;
  autoDetectEnabled = false;
  autoDetectCheckbox.checked = false;
  updateLanguage(lang);
});

autoDetectCheckbox.addEventListener('change', () => {
  autoDetectEnabled = autoDetectCheckbox.checked;
  if (autoDetectEnabled) {
    handleContentChange();
  }
});

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
});

clearBtn.addEventListener('click', () => {
  if (!originalModel || !modifiedModel) return;
  originalModel.setValue('');
  modifiedModel.setValue('');
  localStorage.removeItem(STORAGE_ORIGINAL);
  localStorage.removeItem(STORAGE_MODIFIED);
});

function applyTheme() {
  const theme = isDark ? 'vs-dark' : 'vs';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  monaco.editor.setTheme(theme);
  localStorage.setItem('diff-checker-theme', isDark ? 'dark' : 'light');
}

function restoreTheme() {
  const saved = localStorage.getItem('diff-checker-theme');
  if (saved === 'dark') {
    isDark = true;
    applyTheme();
  } else {
    isDark = false;
    applyTheme();
  }
}

function setupEditors() {
  isMobileLayout = mobileMq.matches;

  if (isMobileLayout) {
    createMobileEditor();
  } else {
    createDiffEditor();
  }

  mobileMq.addEventListener('change', onBreakpointChange);
}

function createDiffEditor() {
  const editorEl = document.getElementById('diff-editor');
  diffEditor = monaco.editor.createDiffEditor(editorEl, {
    enableSplitViewResizing: true,
    renderSideBySide: true,
    originalEditable: true,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    renderIndicators: true,
    diffCodeLens: true,
    ignoreTrimWhitespace: false,
    renderOverviewRuler: true,
    overviewRulerLanes: 3,
    diffAlgorithm: 'advanced',
    theme: isDark ? 'vs-dark' : 'vs',
  });

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel,
  });
}

function createMobileEditor() {
  const editorEl = document.getElementById('diff-editor');
  mobileEditor = monaco.editor.create(editorEl, {
    model: originalModel,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    theme: isDark ? 'vs-dark' : 'vs',
  });

  const savedTab = localStorage.getItem(STORAGE_TAB) || 'before';
  setActiveTab(savedTab);
  mobileEditor.setModel(savedTab === 'before' ? originalModel : modifiedModel);
}

function onBreakpointChange(e) {
  const shouldBeMobile = e.matches;
  if (shouldBeMobile === isMobileLayout) return;
  isMobileLayout = shouldBeMobile;

  if (diffEditor) {
    diffEditor.dispose();
    diffEditor = null;
  }
  if (mobileEditor) {
    mobileEditor.dispose();
    mobileEditor = null;
  }

  if (isMobileLayout) {
    createMobileEditor();
  } else {
    createDiffEditor();
  }
}

function setActiveTab(tab) {
  document.querySelectorAll('.mobile-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}

document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('.mobile-tab');
  if (tabBtn && mobileEditor) {
    const tab = tabBtn.dataset.tab;
    setActiveTab(tab);
    mobileEditor.setModel(tab === 'before' ? originalModel : modifiedModel);
    localStorage.setItem(STORAGE_TAB, tab);
  }
});

document.addEventListener('DOMContentLoaded', init);
