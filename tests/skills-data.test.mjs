import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeSkillName, parseSkillMarkdown, buildFallbackSkills, dedupeSkills } from '../app/skills-data.mjs';

test('parseSkillMarkdown reads the official YAML frontmatter', () => {
  const parsed = parseSkillMarkdown(`---
name: "imagegen"
description: "Generate or edit images."
---

# Image Generation Skill
`);

  assert.equal(parsed.name, 'imagegen');
  assert.equal(parsed.description, 'Generate or edit images.');
});

test('normalizeSkillName preserves the original skill identifiers', () => {
  assert.equal(normalizeSkillName('skill-installer'), 'skill-installer');
  assert.equal(normalizeSkillName('openai-docs'), 'openai-docs');
});

test('fallback list is available when GitHub is unavailable', () => {
  const fallback = buildFallbackSkills();
  assert.ok(Array.isArray(fallback));
  assert.ok(fallback.some((skill) => skill.name === 'skill-installer'));
  assert.ok(fallback.some((skill) => skill.name === 'openai-docs'));
});
test('dedupeSkills keeps only one record per official skill name', () => {
  const skills = [
    { name: 'skill-installer', source: 'Official', title: 'skill-installer' },
    { name: 'skill-installer', source: 'System', title: 'skill-installer' },
    { name: 'openai-docs', source: 'Official', title: 'openai-docs' },
  ];

  const deduped = dedupeSkills(skills);
  assert.equal(deduped.length, 2);
  assert.equal(deduped.find((skill) => skill.name === 'skill-installer')?.source, 'System');
});
