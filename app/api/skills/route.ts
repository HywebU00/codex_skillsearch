import { NextResponse } from 'next/server';

import { buildFallbackSkills } from '../../skills-data.mjs';

type GitTreeEntry = { path?: string; type?: string };
type SkillRecord = {
  name: string; title: string; category: string; description: string;
  source: 'System' | 'Official' | 'Plugin'; version: string; tags: string[];
  featured?: boolean; repoUrl: string;
};

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'codex-skills-directory',
  'X-GitHub-Api-Version': '2022-11-28',
};

function titleCase(value: string) {
  return value.split(/[-_]/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function inferCategory(name: string) {
  const value = name.toLowerCase();
  if (/image|design|figma|video|audio|slide|presentation|canvas/.test(value)) return '創意設計';
  if (/doc|pdf|sheet|excel|calendar|mail|notion|slack|drive/.test(value)) return '生產力';
  if (/github|gitlab|ci|security|code|api|sdk|debug|deploy|web|frontend/.test(value)) return '開發工具';
  if (/install|creator|plugin|skill/.test(value)) return '系統工具';
  return '協作整合';
}

function makeDescription(skill: string, plugin?: string) {
  const display = titleCase(skill);
  return plugin
    ? `${display} 是 OpenAI ${titleCase(plugin)} 插件提供的技能，可在 Codex 中執行對應的專業工作流程。`
    : `${display} 是 OpenAI 官方 Codex 技能，可在相關任務中提供可重複使用的操作流程。`;
}

async function fetchTree(repository: 'plugins' | 'skills') {
  const response = await fetch(`https://api.github.com/repos/openai/${repository}/git/trees/main?recursive=1`, {
    headers: GITHUB_HEADERS,
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`GitHub ${repository}: ${response.status}`);
  const payload = (await response.json()) as { tree?: GitTreeEntry[] };
  return payload.tree ?? [];
}

function parsePluginSkills(tree: GitTreeEntry[]): SkillRecord[] {
  return tree.flatMap((entry) => {
    const match = entry.type === 'blob' && entry.path?.match(/^plugins\/([^/]+)\/skills\/([^/]+)\/SKILL\.md$/);
    if (!match) return [];
    const [, plugin, skill] = match;
    return [{
      name: `${plugin}:${skill}`, title: titleCase(skill), category: inferCategory(`${plugin} ${skill}`),
      description: makeDescription(skill, plugin), source: 'Plugin' as const, version: 'main',
      tags: ['OpenAI', titleCase(plugin), ...skill.split('-').slice(0, 2)],
      featured: ['openai-developers', 'github', 'build-web-apps'].includes(plugin),
      repoUrl: `https://github.com/openai/plugins/tree/main/plugins/${plugin}/skills/${skill}`,
    }];
  });
}

function parseLegacySkills(tree: GitTreeEntry[]): SkillRecord[] {
  return tree.flatMap((entry) => {
    const match = entry.type === 'blob' && entry.path?.match(/^skills\/(\.system|\.curated)\/([^/]+)\/SKILL\.md$/);
    if (!match) return [];
    const [, group, skill] = match;
    const source = group === '.system' ? ('System' as const) : ('Official' as const);
    return [{
      name: skill, title: titleCase(skill), category: source === 'System' ? '系統工具' : inferCategory(skill),
      description: makeDescription(skill), source, version: 'main',
      tags: ['OpenAI', source === 'System' ? '內建' : 'Curated', ...skill.split('-').slice(0, 2)],
      featured: ['skill-installer', 'skill-creator', 'openai-docs'].includes(skill),
      repoUrl: `https://github.com/openai/skills/tree/main/skills/${group}/${skill}`,
    }];
  });
}

function dedupe(skills: SkillRecord[]) {
  const seen = new Map<string, SkillRecord>();
  for (const skill of skills) if (!seen.has(skill.name)) seen.set(skill.name, skill);
  return [...seen.values()];
}

export async function GET() {
  const [pluginsResult, skillsResult] = await Promise.allSettled([fetchTree('plugins'), fetchTree('skills')]);
  const liveSkills = dedupe([
    ...(pluginsResult.status === 'fulfilled' ? parsePluginSkills(pluginsResult.value) : []),
    ...(skillsResult.status === 'fulfilled' ? parseLegacySkills(skillsResult.value) : []),
  ]);
  const isLive = liveSkills.length > 0;
  const response = NextResponse.json({
    skills: isLive ? liveSkills : buildFallbackSkills(), status: isLive ? 'live' : 'fallback',
    repositories: [
      { name: 'openai/plugins', url: 'https://github.com/openai/plugins', available: pluginsResult.status === 'fulfilled' },
      { name: 'openai/skills', url: 'https://github.com/openai/skills', available: skillsResult.status === 'fulfilled' },
    ],
    updatedAt: new Date().toISOString(),
  });
  response.headers.set('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
  return response;
}
