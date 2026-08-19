const FALLBACK_SKILLS = [
  {
    name: 'skill-installer',
    title: 'Skill Installer',
    category: '系統工具',
    description: '從官方精選清單或 GitHub 儲存庫搜尋、安裝與管理 Codex Skills。',
    source: 'System',
    version: 'Built-in',
    tags: ['安裝', 'GitHub', '管理'],
    featured: true,
  },
  {
    name: 'skill-creator',
    title: 'Skill Creator',
    category: '系統工具',
    description: '建立或更新可重複使用的專業技能，包含流程、工具與驗證規則。',
    source: 'System',
    version: 'Built-in',
    tags: ['建立', 'SKILL.md', '工作流程'],
    featured: true,
  },
  {
    name: 'openai-docs',
    title: 'OpenAI Docs',
    category: '開發工具',
    description: '查詢最新 OpenAI 官方文件，協助選擇模型並實作 API 與 Codex 功能。',
    source: 'System',
    version: 'Built-in',
    tags: ['API', '文件', '模型'],
    featured: true,
  },
  {
    name: 'imagegen',
    title: 'Image Generation',
    category: '創意設計',
    description: '生成或編輯相片、插畫、材質、透明背景圖與視覺概念稿。',
    source: 'Official',
    version: 'main',
    tags: ['圖片', '生成', '編輯'],
  },
  {
    name: 'documents',
    title: 'Documents',
    category: '生產力',
    description: '建立、編輯、修訂與檢查 Word 和 Google Docs 文件成果。',
    source: 'Official',
    version: '26.813',
    tags: ['DOCX', '文件', '排版'],
  },
  {
    name: 'spreadsheets',
    title: 'Spreadsheets',
    category: '生產力',
    description: '建立、分析及驗證 Excel、CSV 與 Google Sheets 相容活頁簿。',
    source: 'Official',
    version: '26.813',
    tags: ['Excel', 'CSV', '分析'],
    featured: true,
  },
  {
    name: 'presentations',
    title: 'Presentations',
    category: '生產力',
    description: '讀取、建立與編輯 PowerPoint 或 Google Slides 簡報。',
    source: 'Official',
    version: '26.813',
    tags: ['PPTX', '簡報', '設計'],
  },
  {
    name: 'pdf',
    title: 'PDF',
    category: '生產力',
    description: '讀取、建立、渲染與視覺檢查 PDF，支援可填寫表單。',
    source: 'Official',
    version: '26.813',
    tags: ['PDF', '表單', '驗證'],
  },
  {
    name: 'figma-implement-design',
    title: 'Figma Implement Design',
    category: '開發工具',
    description: '將 Figma 設計轉譯為具備高視覺還原度的產品程式碼。',
    source: 'Plugin',
    version: '2.0',
    tags: ['Figma', '前端', '設計系統'],
  },
  {
    name: 'github:gh-fix-ci',
    title: 'GitHub Fix CI',
    category: '開發工具',
    description: '檢查並修復 GitHub Pull Request 中失敗的 Actions 檢查。',
    source: 'Plugin',
    version: '0.1',
    tags: ['GitHub', 'CI', '除錯'],
  },
  {
    name: 'gmail:gmail',
    title: 'Gmail',
    category: '協作整合',
    description: '搜尋郵件、摘要討論串、撰寫回覆草稿與整理收件匣。',
    source: 'Plugin',
    version: '0.1',
    tags: ['Gmail', '郵件', '摘要'],
  },
  {
    name: 'google-calendar',
    title: 'Google Calendar',
    category: '協作整合',
    description: '讀取行程、尋找空檔、安排會議及管理週期性事件。',
    source: 'Plugin',
    version: '1.2',
    tags: ['行事曆', '排程', '會議'],
  },
];

const KNOWN_ACRONYMS = new Set(['API', 'AI', 'UI', 'UX', 'CLI', 'CSV', 'DB', 'PDF', 'SQL', 'GCP', 'GitHub', 'OpenAI', 'Docs', 'PDF']);

const DISPLAY_TITLES = {
  'skill-installer': 'skill-installer',
  'skill-creator': 'skill-creator',
  'openai-docs': 'openai-docs',
  imagegen: 'imagegen',
  documents: 'documents',
  spreadsheets: 'spreadsheets',
  presentations: 'presentations',
  pdf: 'pdf',
  'figma-implement-design': 'figma-implement-design',
  'github:gh-fix-ci': 'github:gh-fix-ci',
  'gmail:gmail': 'gmail:gmail',
  'google-calendar': 'google-calendar',
};

const DISPLAY_DESCRIPTIONS = {
  'skill-installer': '從官方精選清單或 GitHub 儲存庫搜尋、安裝與管理 Codex Skills。',
  'skill-creator': '建立或更新可重複使用的專業技能，包含流程、工具與驗證規則。',
  'plugin-creator': '建立與初始化 Codex 插件資料夾、必要設定檔與基線範本，支援插件開發與發佈前檢查。',
  'openai-docs': '查詢最新 OpenAI 官方文件，協助選擇模型並實作 API 與 Codex 功能。',
  imagegen: '生成或編輯相片、插畫、材質與透明背景圖等影像資產。',
  documents: '建立、編輯、修訂與檢查 Word 和 Google Docs 文件成果。',
  spreadsheets: '建立、分析及驗證 Excel、CSV 與 Google Sheets 相容活頁簿。',
  presentations: '讀取、建立與編輯 PowerPoint 或 Google Slides 簡報。',
  pdf: '讀取、建立、渲染與視覺檢查 PDF，支援可填寫表單。',
  'figma-implement-design': '將 Figma 設計轉譯為具備高視覺還原度的產品程式碼。',
  'github:gh-fix-ci': '檢查並修復 GitHub Pull Request 中失敗的 Actions 檢查。',
  'gmail:gmail': '搜尋郵件、摘要討論串、撰寫回覆草稿與整理收件匣。',
  'google-calendar': '讀取行程、尋找空檔、安排會議及管理週期性事件。',
};

export function buildFallbackSkills() {
  return FALLBACK_SKILLS.map((skill) => ({ ...skill }));
}

export function normalizeSkillName(rawName = '') {
  const normalized = rawName.trim();
  if (!normalized) return '';

  const direct = DISPLAY_TITLES[normalized] || DISPLAY_TITLES[normalized.replace(/^.*:/, '')];
  if (direct) return direct;

  return normalized;
}

function localizeSkillText(skillName, description) {
  const normalized = (skillName || '').trim();
  const directTitle = DISPLAY_TITLES[normalized] || DISPLAY_TITLES[normalized.replace(/^.*:/, '')];
  const directDescription = DISPLAY_DESCRIPTIONS[normalized] || DISPLAY_DESCRIPTIONS[normalized.replace(/^.*:/, '')];

  const fallbackDescription = (() => {
    const name = normalizeSkillName(normalized).toLowerCase();
    if (name.includes('plugin')) {
      return '建立與管理 Codex 插件的相關資源，支援插件結構、設定檔與發布前驗證。';
    }
    if (name.includes('skill')) {
      return '建立、更新與管理 Codex 的專業技能，讓流程更可重用、可驗證與可維護。';
    }
    if (name.includes('doc')) {
      return '查詢與使用官方文件與資源，支援 Codex 在指定任務中的正確實作與決策。';
    }
    if (name.includes('image')) {
      return '產生與編輯影像資產，支援設計、原型與視覺內容製作。';
    }
    return `${normalizeSkillName(normalized)} 是 Codex 的官方技能，適合用於相關任務與自動化流程。`;
  })();

  return {
    title: directTitle || normalizeSkillName(normalized),
    description: directDescription || fallbackDescription || description || `${normalizeSkillName(normalized)} 的官方技能。`,
  };
}

export function parseSkillMarkdown(markdown = '') {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) {
    return {};
  }

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.+?)\s*$/);
    if (!item) continue;

    let value = item[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    metadata[item[1]] = value;
  }

  return metadata;
}

function buildSkillRecord(entry, source, directoryName) {
  const name = entry.name || directoryName;
  const title = normalizeSkillName(name);
  const fallback = {
    name,
    title,
    category: source === 'System' ? '系統工具' : '開發工具',
    description: `官方 GitHub 技能：${title}。`,
    source,
    version: 'live',
    tags: ['GitHub', '官方', '技能'],
    featured: source === 'System',
  };

  return fallback;
}

async function loadSkillMetadata(repoPath) {
  const rawUrl = `https://raw.githubusercontent.com/openai/skills/main/${repoPath}/SKILL.md`;
  const response = await fetch(rawUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'text/markdown',
    },
  });

  if (!response.ok) {
    return null;
  }

  const markdown = await response.text();
  return parseSkillMarkdown(markdown);
}

async function fetchDirectorySkills(directoryUrl, source) {
  const response = await fetch(directoryUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    return [];
  }

  const entries = await response.json();
  if (!Array.isArray(entries)) {
    return [];
  }

  const skillDirs = entries.filter((entry) => entry.type === 'dir');
  const records = await Promise.all(
    skillDirs.map(async (entry) => {
      try {
        const metadata = await loadSkillMetadata(entry.path);
        const name = (metadata?.name || entry.name || 'unnamed').trim();
        const rawDescription = metadata?.description || `${normalizeSkillName(name)} 的官方 GitHub 技能。`;
        const display = localizeSkillText(name, rawDescription);
        return {
          name,
          title: display.title,
          category: source === 'System' ? '系統工具' : '開發工具',
          description: display.description,
          source,
          version: 'live',
          tags: [
            'GitHub',
            '官方',
            'Codex',
            ...display.description
              .split(/\s+/)
              .filter((word) => word.length > 4)
              .slice(0, 3),
          ],
          featured: source === 'System' && ['skill-installer', 'skill-creator', 'openai-docs', 'imagegen'].includes(name),
        };
      } catch {
        return buildSkillRecord(entry, source, entry.name);
      }
    })
  );

  return records.filter(Boolean);
}

export function dedupeSkills(skills = []) {
  const sourcePriority = {
    System: 0,
    Official: 1,
    Plugin: 2,
  };

  const seen = new Map();
  for (const skill of skills) {
    const name = (skill?.name || '').trim();
    if (!name) continue;

    const existing = seen.get(name);
    const currentPriority = sourcePriority[skill?.source] ?? Number.MAX_SAFE_INTEGER;
    const existingPriority = existing ? (sourcePriority[existing.source] ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;

    if (!existing || currentPriority < existingPriority) {
      seen.set(name, skill);
    }
  }

  return [...seen.values()];
}

export async function fetchOfficialSkills() {
  try {
    const directories = [
      {
        source: 'System',
        url: 'https://api.github.com/repos/openai/skills/contents/skills/.system',
      },
      {
        source: 'Official',
        url: 'https://api.github.com/repos/openai/skills/contents/skills/.curated',
      },
    ];

    const results = await Promise.all(directories.map(({ source, url }) => fetchDirectorySkills(url, source)));

    const merged = results.flat();
    const deduped = dedupeSkills(merged);

    return deduped.length ? deduped : buildFallbackSkills();
  } catch {
    return buildFallbackSkills();
  }
}
