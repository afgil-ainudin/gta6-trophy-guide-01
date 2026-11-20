// Leonida Trophy Guide — checklist, roadmap and spoiler-safe tracker.
// Plain ES module, no libraries, no network at run time beyond fetching the
// trophy data file that ships beside it (data/trophies.json).

const STORAGE_KEY = 'gta6-trophy-guide-v1';
const SPOILER_KEY = 'gta6-trophy-guide-spoiler';

// Roadmap to the platinum, in the order to play. Built from the official
// descriptions: story first, then the stranger strands and contacts, then
// collectibles and exploration, then the activities and grinds, then the
// cleanup that ends in 100% completion and the platinum.
const ROADMAP = [
  {
    title: 'Play the story',
    blurb: 'Chapters 1 to 4 and the final mission unlock the story trophies as you go. Watch for the missable flags in this stage — everything else can be earned later or by replaying a mission.',
    trophies: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    title: 'Strangers and contacts',
    blurb: 'Finish the mission strands for the people of Leonida: Andy, Kenton, Billy, Randy and Tyrone, plus eight stranger strands across the state.',
    trophies: [22, 23, 24, 26, 27, 25],
  },
  {
    title: 'Collectibles and exploration',
    blurb: 'Sweep the map: card sets, WAiNK spots, vehicles to discover, every area of Leonida, one illegal operation per gang, and the garage properties.',
    trophies: [30, 31, 35, 42, 43, 54, 55, 52, 53],
  },
  {
    title: 'Activities and grinds',
    blurb: 'The long tail: stunts, races, shooting range golds, drone races, fishing, bowling, meditation spots, challenges and the partner robberies.',
    trophies: [15, 16, 17, 18, 19, 20, 21, 28, 32, 33, 34, 36, 37, 38, 39, 40, 41, 44, 45, 46, 47, 48, 49, 50, 51],
  },
  {
    title: 'Cleanup to 100%',
    blurb: 'Mop up whatever the stages above left behind until the game reads 100% completion — that is the gold, and with it the platinum.',
    trophies: [14, 1],
  },
];

const KIND_LABELS = {
  all: 'All kinds',
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  online: 'Online',
};

const params = new URLSearchParams(location.search);
const listEl = document.getElementById('trophyList');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const gradeCountsEl = document.getElementById('gradeCounts');
const resultCountEl = document.getElementById('resultCount');
const emptyNoteEl = document.getElementById('emptyNote');
const searchInput = document.getElementById('search');
const gradeSelect = document.getElementById('grade');
const spoilerInput = document.getElementById('spoiler');
const earnedOnlyInput = document.getElementById('earnedOnly');

let doc = { trophies: [] };
let earned = loadEarned();
let kindFilter = params.get('kind') ?? 'all';
let demoIds = [];

// A demo mode for screenshots (?demo=1): tick a spread of trophies in memory
// so the progress bar and earned states show, without touching saved data.
if (params.get('demo') === '1') demoIds = [2, 3, 8, 15, 20, 42, 46];

function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((n) => Number.isInteger(n)) : []);
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function isEarned(trophy) {
  return earned.has(trophy.id) || demoIds.includes(trophy.id);
}

function isSpoilerHidden(trophy) {
  return spoilerInput.checked && trophy.kind === 'story' && !isEarned(trophy);
}

function visibleName(trophy) {
  return isSpoilerHidden(trophy) ? 'Hidden story trophy' : trophy.name;
}

function visibleDescription(trophy) {
  return isSpoilerHidden(trophy)
    ? 'A story trophy — its name and description stay hidden until you earn it.'
    : trophy.description;
}

function gradeBadge(grade) {
  const span = document.createElement('span');
  span.className = `grade-badge grade-${grade}`;
  span.textContent = grade;
  return span;
}

function kindTag(trophy) {
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  return tag;
}

function missableTag() {
  const tag = document.createElement('span');
  tag.className = 'tag missable';
  tag.textContent = 'Missable';
  return tag;
}

function matchesFilters(trophy) {
  const q = searchInput.value.trim().toLowerCase();
  if (q && !`${trophy.name} ${trophy.description}`.toLowerCase().includes(q)) return false;
  if (gradeSelect.value !== 'all' && trophy.grade !== gradeSelect.value) return false;
  if (earnedOnlyInput.checked && !isEarned(trophy)) return false;
  switch (kindFilter) {
    case 'story': return trophy.kind === 'story';
    case 'missable': return trophy.missable === true;
    case 'collectible': return trophy.kind === 'collectible';
    case 'activity': return trophy.kind === 'activity';
    case 'online': return trophy.kind === 'online';
    default: return true;
  }
}

function renderProgress() {
  const total = doc.trophies.length;
  const done = doc.trophies.filter(isEarned).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${done} of ${total} earned · ${pct}%`;
  const byGrade = {};
  for (const t of doc.trophies) {
    if (!isEarned(t)) continue;
    byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  }
  const parts = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${byGrade[g] ?? 0} ${g}`)
    .join(' · ');
  gradeCountsEl.textContent = `Earned by grade: ${parts}`;
}

function renderChecklist() {
  listEl.replaceChildren();
  const shown = doc.trophies.filter(matchesFilters);
  resultCountEl.textContent = `Showing ${shown.length} of ${doc.trophies.length} trophies`;
  emptyNoteEl.hidden = shown.length !== 0;
  for (const trophy of shown) {
    const li = document.createElement('li');
    li.className = 'trophy' + (isEarned(trophy) ? ' earned' : '');
    const checkWrap = document.createElement('label');
    checkWrap.className = 'trophy-check';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned(trophy);
    box.setAttribute('aria-label', `Mark ${visibleName(trophy)} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(trophy.id);
      else earned.delete(trophy.id);
      saveEarned();
      renderAll();
    });
    checkWrap.append(box);
    const body = document.createElement('div');
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    name.textContent = visibleName(trophy);
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = visibleDescription(trophy);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(kindTag(trophy));
    if (trophy.missable) meta.append(missableTag());
    if (isSpoilerHidden(trophy)) {
      const tag = document.createElement('span');
      tag.className = 'tag spoilered';
      tag.textContent = 'Spoiler hidden';
      meta.append(tag);
    }
    if (trophy.count != null) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = `Count: ${trophy.count}`;
      meta.append(tag);
    }
    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';
    guideBtn.className = 'guide-btn';
    guideBtn.textContent = 'Read the guide';
    guideBtn.addEventListener('click', () => openDetail(trophy));
    body.append(name, desc, meta, guideBtn);
    li.append(checkWrap, body, gradeBadge(trophy.grade));
    listEl.append(li);
  }
  renderProgress();
}

function renderRoadmap() {
  const list = document.getElementById('roadmapList');
  list.replaceChildren();
  for (const stage of ROADMAP) {
    const li = document.createElement('li');
    li.className = 'roadmap-stage';
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.blurb;
    const ul = document.createElement('ul');
    for (const id of stage.trophies) {
      const trophy = doc.trophies.find((t) => t.id === id);
      if (!trophy) continue;
      const item = document.createElement('li');
      item.textContent = `${visibleName(trophy)} — ${visibleDescription(trophy)}${isEarned(trophy) ? ' ✓' : ''}`;
      if (trophy.missable) {
        const flag = document.createElement('strong');
        flag.className = 'missable-flag';
        flag.textContent = ' Missable';
        item.append(flag);
      }
      ul.append(item);
    }
    li.append(h, p, ul);
    list.append(li);
  }
  const missable = doc.trophies.filter((t) => t.missable);
  const missList = document.getElementById('missableList');
  missList.replaceChildren();
  if (missable.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No trophy is currently flagged missable: every trophy can be earned after the story, according to the sources cited in the guides.';
    missList.append(li);
  } else {
    for (const trophy of missable) {
      const li = document.createElement('li');
      li.textContent = `${trophy.name} — ${trophy.description} `;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'guide-btn';
      btn.textContent = 'Read the guide';
      btn.addEventListener('click', () => openDetail(trophy));
      li.append(btn);
      missList.append(li);
    }
  }
}

function openDetail(trophy) {
  const panel = document.getElementById('detail');
  const body = document.getElementById('detailBody');
  body.replaceChildren();
  const name = document.createElement('h2');
  name.textContent = trophy.name;
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = trophy.description;
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(gradeBadge(trophy.grade), kindTag(trophy));
  if (trophy.missable) meta.append(missableTag());
  if (trophy.count != null) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = `Count: ${trophy.count}`;
    meta.append(tag);
  }
  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'How to earn it';
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  body.append(name, desc, meta, guideTitle, guide);
  if (Array.isArray(trophy.sources) && trophy.sources.length > 0) {
    const srcTitle = document.createElement('h3');
    srcTitle.textContent = 'Sources';
    const ul = document.createElement('ul');
    for (const src of trophy.sources) {
      const li = document.createElement('li');
      const match = String(src).match(/^(.*) \((https?:\/\/[^)]+)\)$/);
      if (match) {
        li.append(document.createTextNode(`${match[1]} (`));
        const a = document.createElement('a');
        a.href = match[2];
        a.textContent = match[2];
        a.target = '_blank';
        a.rel = 'noopener';
        li.append(a, document.createTextNode(')'));
      } else {
        li.textContent = src;
      }
      ul.append(li);
    }
    body.append(srcTitle, ul);
  }
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeDetail() {
  document.getElementById('detail').hidden = true;
}

function renderKindButtons() {
  const wrap = document.getElementById('kindButtons');
  wrap.replaceChildren();
  for (const [key, label] of Object.entries(KIND_LABELS)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kind-btn' + (kindFilter === key ? ' active' : '');
    btn.textContent = label;
    btn.setAttribute('aria-pressed', String(kindFilter === key));
    btn.addEventListener('click', () => {
      kindFilter = key;
      renderKindButtons();
      renderChecklist();
    });
    wrap.append(btn);
  }
}

function renderAll() {
  renderKindButtons();
  renderChecklist();
  renderRoadmap();
}

function switchTab(view) {
  const checklist = view === 'checklist';
  document.getElementById('viewChecklist').hidden = !checklist;
  document.getElementById('viewRoadmap').hidden = checklist;
  document.getElementById('tabChecklist').classList.toggle('active', checklist);
  document.getElementById('tabRoadmap').classList.toggle('active', !checklist);
  document.getElementById('tabChecklist').setAttribute('aria-selected', String(checklist));
  document.getElementById('tabRoadmap').setAttribute('aria-selected', String(!checklist));
}

function exportProgress() {
  const blob = new Blob([JSON.stringify([...earned].sort((a, b) => a - b), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  if (!file) return;
  try {
    const raw = JSON.parse(await file.text());
    if (!Array.isArray(raw)) throw new Error('not an array');
    earned = new Set(raw.filter((n) => Number.isInteger(n) && doc.trophies.some((t) => t.id === n)));
    saveEarned();
    renderAll();
  } catch {
    alert('That file is not a trophy progress export (a JSON array of trophy numbers).');
  }
}

async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`trophies.json: HTTP ${response.status}`);
  doc = await response.json();
}

function applyUrlState() {
  if (params.get('view') === 'roadmap') switchTab('roadmap');
  if (params.get('grade')) gradeSelect.value = params.get('grade');
  if (params.get('spoiler') === '1') spoilerInput.checked = true;
  if (params.get('earnedOnly') === '1') earnedOnlyInput.checked = true;
  const trophyId = Number(params.get('trophy'));
  if (Number.isInteger(trophyId)) {
    const trophy = doc.trophies.find((t) => t.id === trophyId);
    if (trophy) openDetail(trophy);
  }
}

// Wire up the controls, then load the data and render.
spoilerInput.checked = localStorage.getItem(SPOILER_KEY) === '1';
spoilerInput.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, spoilerInput.checked ? '1' : '0');
  renderAll();
});
searchInput.addEventListener('input', renderChecklist);
gradeSelect.addEventListener('change', renderChecklist);
earnedOnlyInput.addEventListener('change', renderChecklist);
document.getElementById('export').addEventListener('click', exportProgress);
document.getElementById('import').addEventListener('change', (e) => importProgress(e.target.files[0]));
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});
document.getElementById('tabChecklist').addEventListener('click', () => switchTab('checklist'));
document.getElementById('tabRoadmap').addEventListener('click', () => switchTab('roadmap'));
document.getElementById('detailClose').addEventListener('click', closeDetail);

await loadTrophies();
applyUrlState();
renderAll();
