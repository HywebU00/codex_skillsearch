'use client';

import { useEffect, useMemo, useState } from 'react';

import { buildFallbackSkills, fetchOfficialSkills } from './skills-data.mjs';

type Skill = {
  name: string;
  title: string;
  category: string;
  description: string;
  source: 'System' | 'Official' | 'Plugin';
  version: string;
  tags: string[];
  featured?: boolean;
};

const initialSkills: Skill[] = buildFallbackSkills();

const categories = ['全部', '系統工具', '開發工具', '生產力', '創意設計', '協作整合'];

function getSourceLabel(source: Skill['source'] | string) {
  return (
    {
      System: '系統',
      Official: '官方',
      Plugin: '插件',
    }[source as Skill['source']] ?? source
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [source, setSource] = useState('全部來源');
  const [sort, setSort] = useState('精選優先');
  const [selected, setSelected] = useState<Skill | null>(null);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  useEffect(() => {
    let active = true;

    fetchOfficialSkills()
      .then((liveSkills) => {
        if (active) {
          setSkills(liveSkills as Skill[]);
        }
      })
      .catch(() => {
        if (active) {
          setSkills(initialSkills);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = skills.filter((skill) => {
      const matchesQuery = !q || [skill.name, skill.title, skill.description, skill.category, ...skill.tags].join(' ').toLowerCase().includes(q);
      const matchesCategory = category === '全部' || skill.category === category;
      const matchesSource = source === '全部來源' || skill.source === source;
      return matchesQuery && matchesCategory && matchesSource;
    });
    return [...result].sort((a, b) => (sort === '名稱排序' ? a.title.localeCompare(b.title) : Number(Boolean(b.featured)) - Number(Boolean(a.featured))));
  }, [query, category, source, sort, skills]);

  return (
    <main>
      <header className='topbar'>
        <a className='brand' href='#top' aria-label='Codex Skills 首頁'>
          <span className='logo'>◆</span>
          <span>Codex</span>
          <span className='slash'>/</span>
          <span className='muted'>Skills</span>
        </a>
        <nav aria-label='主要導覽'>
          <a className='active' href='#directory'>
            技能目錄
          </a>
          <a href='#guide'>使用指南</a>
          <a href='https://github.com/openai/skills' target='_blank' rel='noreferrer'>
            GitHub ↗
          </a>
        </nav>
        <button className='terminal-btn' onClick={() => setQuery('skill-installer')}>
          <span>⌘</span> 快速搜尋
        </button>
      </header>

      <section className='hero' id='top'>
        <div className='eyebrow'>
          <i /> 官方技能目錄
        </div>
        <h1>
          找到適合任務的
          <br />
          <span>Codex Skill</span>
        </h1>
        <p>探索官方技能、系統工具與已驗證的整合，讓 Codex 以可靠的專業流程完成工作。</p>
        <div className='search-shell'>
          <span aria-hidden='true'>⌕</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder='搜尋技能名稱、功能或標籤…' aria-label='搜尋技能' />
          {query && (
            <button onClick={() => setQuery('')} aria-label='清除搜尋'>
              ×
            </button>
          )}
          <kbd>⌘ K</kbd>
        </div>
        <div className='stats' aria-label='目錄統計'>
          <span>
            <strong>{skills.length}</strong> 個範例技能
          </span>
          <b>•</b>
          <span>
            <strong>5</strong> 個分類
          </span>
          <b>•</b>
          <span className='verified'>● 已驗證來源</span>
        </div>
      </section>

      <section className='directory' id='directory'>
        <div className='filter-row'>
          <div className='chips' aria-label='技能分類'>
            {categories.map((item) => (
              <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className='selects'>
            <select value={source} onChange={(e) => setSource(e.target.value)} aria-label='來源'>
              <option>全部來源</option>
              <option value='System'>系統</option>
              <option value='Official'>官方</option>
              <option value='Plugin'>插件</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label='排序'>
              <option>精選優先</option>
              <option>名稱排序</option>
            </select>
          </div>
        </div>

        <div className='section-heading'>
          <div>
            <span className='section-index'>01</span>
            <h2>{category === '全部' ? '全部技能' : category}</h2>
          </div>
          <span>顯示 {filtered.length} 個結果</span>
        </div>
        {filtered.length ? (
          <div className='grid'>
            {filtered.map((skill) => (
              <article className='card' key={skill.name} tabIndex={0} onClick={() => setSelected(skill)} onKeyDown={(e) => e.key === 'Enter' && setSelected(skill)}>
                <div className='card-top'>
                  <div className={`icon ${skill.category}`} aria-hidden='true'>
                    {skill.category === '系統工具' ? '⌘' : skill.category === '開發工具' ? '</>' : skill.category === '生產力' ? '▤' : skill.category === '創意設計' ? '✦' : '◎'}
                  </div>
                  <span className={`source ${skill.source.toLowerCase()}`}>● {getSourceLabel(skill.source)}</span>
                </div>
                <h3>{skill.title}</h3>
                <code>{skill.name}</code>
                <p>{skill.description}</p>
                <div className='tags'>
                  {skill.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                <div className='card-footer'>
                  <span>v {skill.version}</span>
                  <button aria-label={`查看 ${skill.title}`}>
                    查看詳情 <b>↗</b>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className='empty'>
            <span>⌕</span>
            <h3>找不到符合條件的技能</h3>
            <p>試著縮短關鍵字，或清除分類與來源篩選。</p>
            <button
              onClick={() => {
                setQuery('');
                setCategory('全部');
                setSource('全部來源');
              }}
            >
              清除篩選
            </button>
          </div>
        )}
      </section>

      <section className='guide' id='guide'>
        <div>
          <span className='section-index light'>02</span>
          <h2>三步開始使用 Skill</h2>
          <p>不需要記住複雜語法，直接在任務中指定即可。</p>
        </div>
        <ol>
          <li>
            <b>1</b>
            <span>
              選擇技能<small>從目錄找到符合任務的專業流程。</small>
            </span>
          </li>
          <li>
            <b>2</b>
            <span>
              在提示中指定<small>輸入「請使用 $skill-name…」。</small>
            </span>
          </li>
          <li>
            <b>3</b>
            <span>
              檢查成果<small>Codex 會依技能規範執行與驗證。</small>
            </span>
          </li>
        </ol>
      </section>
      <footer>
        <div className='brand'>
          <span className='logo'>◆</span>
          <span>Codex Skills</span>
        </div>
        <p>技能資料為介面示範；實際可用項目以你的 Codex 環境為準。</p>
        <a href='#top'>回到頂部 ↑</a>
      </footer>

      {selected && (
        <div className='modal-backdrop' role='presentation' onClick={() => setSelected(null)}>
          <section className='modal' role='dialog' aria-modal='true' aria-labelledby='modal-title' onClick={(e) => e.stopPropagation()}>
            <button className='close' onClick={() => setSelected(null)} aria-label='關閉'>
              ×
            </button>
            <div className='modal-kicker'>
              <span className={`source ${selected.source.toLowerCase()}`}>● {getSourceLabel(selected.source)}</span> {selected.category}
            </div>
            <h2 id='modal-title'>{selected.title}</h2>
            <code>{selected.name}</code>
            <p>{selected.description}</p>
            <h4>適用標籤</h4>
            <div className='tags'>
              {selected.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <div className='command'>
              <span>使用方式</span>
              <code>請使用 ${selected.name} 協助我完成…</code>
              <button onClick={() => navigator.clipboard?.writeText(`請使用 $${selected.name} 協助我完成…`)}>複製</button>
            </div>
            <button className='primary' onClick={() => setSelected(null)}>
              完成
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
