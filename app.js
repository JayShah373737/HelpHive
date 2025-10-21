/**
 * HelpHive — Production app.js
 * - All classes/ids use hh- prefix
 * - Features:
 *   - 20+ demo tasks (categories: education, environment, health, arts, food, career, translation)
 *   - Multi-select filters (type + cities + tags)
 *   - Search & sort
 *   - "I'll Help" add to My Missions
 *   - Booking system (book time slots per task)
 *   - Simulated AI suggestions (client-side matching by skills)
 *   - Import/Export missions JSON
 *   - Modal details, badges, notifications, accessibility
 *
 * Drop into repo and open index.html or deploy to GitHub Pages.
 */

// -----------------------------
// Demo tasks (expanded to 20+)
// -----------------------------
const TASKS = [
  { id:'t1', title:'Online Tutoring — Math', type:'online', cities:['All'], time:'30 mins', minutes:30, desc:'One-on-one math tutoring for younger students.', skills:['Math','Patience'], tags:['education','remote'], prerequisites:['Internet'], impactEstimate:'Helps 1 student improve' },
  { id:'t2', title:'Park Cleanup', type:'local', cities:['Delhi','Pune','Hyderabad'], time:'45 mins', minutes:45, desc:'Community litter pickup in a neighborhood park.', skills:['Teamwork'], tags:['environment','outdoors'], prerequisites:['Gloves'], impactEstimate:'Cleaner public space' },
  { id:'t3', title:'Tree Planting Drive', type:'offline', cities:['Kolkata','Chennai','Mumbai'], time:'60 mins', minutes:60, desc:'Plant and care for a sapling in public areas.', skills:['Physical'], tags:['environment','long-term'], prerequisites:['Sapling'], impactEstimate:'Long-term green cover' },
  { id:'t4', title:'Elderly Check-in Call', type:'online', cities:['All'], time:'15 mins', minutes:15, desc:'Check-in call to an elderly neighbour to see how they are.', skills:['Listening'], tags:['social','wellbeing'], prerequisites:['Phone'], impactEstimate:'Immediate support' },
  { id:'t5', title:'Food Bank Sorting', type:'local', cities:['Bangalore','Hyderabad','Mumbai'], time:'90 mins', minutes:90, desc:'Sort and pack food donations for distribution.', skills:['Organization'], tags:['food-security','onsite'], prerequisites:['Closed shoes'], impactEstimate:'Supports meal distribution' },
  { id:'t6', title:'Language Conversation', type:'online', cities:['Delhi','Chennai'], time:'20 mins', minutes:20, desc:'Practice conversational language with learners.', skills:['Language'], tags:['education','remote'], prerequisites:['Microphone'], impactEstimate:'Improves communication' },
  { id:'t7', title:'First Aid Awareness', type:'offline', cities:['Bangalore','Pune','Mumbai'], time:'40 mins', minutes:40, desc:'Conduct a short first aid demonstration.', skills:['First Aid'], tags:['health','community'], prerequisites:['FirstAid kit'], impactEstimate:'Better emergency readiness' },
  { id:'t8', title:'Resume Review', type:'online', cities:['All'], time:'30 mins', minutes:30, desc:'Review and provide feedback on one resume.', skills:['HR'], tags:['career','remote'], prerequisites:['Resume file'], impactEstimate:'Boosts employability' },
  { id:'t9', title:'Public Mural Refresh', type:'local', cities:['Kolkata','Chennai'], time:'120 mins', minutes:120, desc:'Help repaint a community mural.', skills:['Art'], tags:['arts','public-space'], prerequisites:['Paints'], impactEstimate:'Beautifies space' },
  { id:'t10', title:'Micro-Translation', type:'online', cities:['All'], time:'25 mins', minutes:25, desc:'Translate short texts for NGOs.', skills:['Translation'], tags:['ngo-support','remote'], prerequisites:['Language'], impactEstimate:'Improves comms' },
  { id:'t11', title:'Digital Skills Workshop', type:'online', cities:['All'], time:'60 mins', minutes:60, desc:'Run a 1-hour digital skills micro-session.', skills:['Teaching','Tech'], tags:['education'], prerequisites:['Slides'], impactEstimate:'Improves digital literacy' },
  { id:'t12', title:'Senior Grocery Assist', type:'local', cities:['Mumbai','Pune'], time:'45 mins', minutes:45, desc:'Help an elderly person with grocery shopping.', skills:['Empathy'], tags:['social'], prerequisites:['Mask'], impactEstimate:'Immediate support' },
  { id:'t13', title:'Community Library Setup', type:'local', cities:['Delhi','Bangalore'], time:'90 mins', minutes:90, desc:'Help sort and catalog books for a small library.', skills:['Organization'], tags:['education','community'], prerequisites:['Basic labeling'], impactEstimate:'Supports learners' },
  { id:'t14', title:'Habitat Repair', type:'offline', cities:['Hyderabad','Chennai'], time:'120 mins', minutes:120, desc:'Small repairs/painting at a shelter.', skills:['Handyman'], tags:['infrastructure'], prerequisites:['Tools'], impactEstimate:'Safe shelter upkeep' },
  { id:'t15', title:'Climate Awareness Post', type:'online', cities:['All'], time:'20 mins', minutes:20, desc:'Draft a short social post to raise awareness.', skills:['Writing'], tags:['environment','remote'], prerequisites:['None'], impactEstimate:'Raises awareness' },
  { id:'t16', title:'Local Market Donation Drive', type:'local', cities:['Pune','Mumbai'], time:'180 mins', minutes:180, desc:'Collect and coordinate donations at a market.', skills:['Coordination'], tags:['fundraising'], prerequisites:['Volunteers'], impactEstimate:'Boosts donations' },
  { id:'t17', title:'Career Q&A Session', type:'online', cities:['All'], time:'45 mins', minutes:45, desc:'Answer live career questions for students.', skills:['Experience'], tags:['career','remote'], prerequisites:['Video setup'], impactEstimate:'Guides career choices' },
  { id:'t18', title:'Shelter Dog Walk', type:'local', cities:['Bangalore','Mumbai'], time:'30 mins', minutes:30, desc:'Walk and comfort shelter dogs.', skills:['Animal care'], tags:['animals','onsite'], prerequisites:['Leash'], impactEstimate:'Animal wellbeing' },
  { id:'t19', title:'Senior Tech Setup', type:'online', cities:['All'], time:'30 mins', minutes:30, desc:'Help an older person set up phone apps.', skills:['Tech'], tags:['education','remote'], prerequisites:['Phone'], impactEstimate:'Improves connectivity' },
  { id:'t20', title:'Data Entry — NGO', type:'online', cities:['All'], time:'60 mins', minutes:60, desc:'Help NGOs with small data entry tasks.', skills:['Spreadsheet'], tags:['ngo-support','remote'], prerequisites:['Computer'], impactEstimate:'Improves operations' },
];

// -----------------------------
// State + persistence
// -----------------------------
const State = {
  view: 'home',
  filters: new Set(),    // type filters
  locs: new Set(),       // city filters
  tags: new Set(),       // tag filters
  search: '',
  sortBy: 'relevance',
  missions: [],          // saved missions (with localId)
  bookings: [],          // saved bookings
  profile: { skills: [] } // user-specified skills for AI suggestions
};

const LS_KEY = 'helphive_prod_v2';

// -----------------------------
// Small helpers
// -----------------------------
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const mk = (tag, attrs = {}, children = []) => {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'text') e.textContent = attrs[k];
    else e.setAttribute(k, attrs[k]);
  }
  children.forEach(c => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
};
const safeParse = s => { try { return JSON.parse(s); } catch { return null; } };

// -----------------------------
// Persistence
// -----------------------------
function loadState() {
  const raw = localStorage.getItem(LS_KEY);
  const parsed = safeParse(raw);
  if (parsed) {
    State.missions = parsed.missions || [];
    State.bookings = parsed.bookings || [];
    State.profile = parsed.profile || { skills: [] };
  }
}
function saveState() {
  const out = { missions: State.missions, bookings: State.bookings, profile: State.profile };
  localStorage.setItem(LS_KEY, JSON.stringify(out));
}

// -----------------------------
// Routing
// -----------------------------
function navigate(route) {
  window.location.hash = '#' + route.replace(/^\/?/, '/');
}
function applyRouteFromHash() {
  const hash = window.location.hash.replace('#', '') || '/';
  const route = hash.split('?')[0];
  State.view = route === '/' ? 'home' : route.replace('/', '') || 'home';
  render();
}
window.addEventListener('hashchange', applyRouteFromHash);

// -----------------------------
// Render controller
// -----------------------------
function render() {
  // nav active
  $$('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '#/';
    const route = href.replace('#/', '').replace('/', '');
    const current = State.view === 'home' ? '' : State.view;
    a.classList.toggle('active', route === current);
  });

  const root = $('#views');
  if (!root) return;

  if (State.view === 'discover') renderDiscover(root);
  else if (State.view === 'bookings') renderBookings(root);
  else if (State.view === 'missions') renderMissions(root);
  else if (State.view === 'about') renderAbout(root);
  else renderHome(root);
}

// -----------------------------
// Home view
// -----------------------------
function renderHome(root) {
  root.innerHTML = '';
  const container = mk('section', { class: 'hh-card hh-home hh-animate-in' });

  const hero = mk('div', { class: 'hh-hero' });
  hero.appendChild(mk('div', { class: 'hh-hero-left' }, [
    mk('h2', { class: 'hh-title', text: 'HelpHive — Small acts, big ripples' }),
    mk('p', { class: 'hh-muted', text: 'Discover, book, and complete micro-volunteering tasks across India.' }),
    mk('div', { class: 'hh-cta-wrap' }, [ mk('button', { class: 'hh-btn hh-btn-primary', onclick: "navigate('/discover')" }, ['Start Browsing']) ])
  ]));
  hero.appendChild(mk('div', { class: 'hh-hero-right' }, [ mk('div', { class: 'hh-badge', text: 'Made with ❤️ for India' }) ]));

  container.appendChild(hero);

  // AI suggestions preview (uses profile skills)
  const aiCard = mk('div', { class: 'hh-card hh-ai-suggest' });
  aiCard.appendChild(mk('h3', { text: 'AI Suggestions (simulated)' }));
  const profileSkills = State.profile.skills.length ? State.profile.skills.join(', ') : 'No skills set';
  aiCard.appendChild(mk('div', { class: 'hh-small hh-muted', text: 'Your skills: ' + profileSkills }));
  aiCard.appendChild(mk('div', { id: 'hh-ai-list', class: 'hh-grid' }));
  container.appendChild(aiCard);

  // quick stats
  const stats = mk('div', { class: 'hh-impact-grid' });
  stats.appendChild(mk('div', { class: 'hh-card' }, [ mk('div', { class: 'hh-impact-number', text: String(State.missions.length) }), mk('div', { class: 'hh-muted', text: 'Saved Missions' }) ]));
  stats.appendChild(mk('div', { class: 'hh-card' }, [ mk('div', { class: 'hh-impact-number', text: String(new Set(State.missions.flatMap(m=>m.cities)).size) }), mk('div', { class: 'hh-muted', text: 'Cities Reached' }) ]));
  container.appendChild(stats);

  root.appendChild(container);

  // render AI suggestions (client-side)
  renderAISuggestions();
}

// -----------------------------
// Discover view
// -----------------------------
function renderDiscover(root) {
  root.innerHTML = '';

  // left-side filters panel (if split layout is used)
  const panel = mk('aside', { class: 'hh-panel hh-card' });
  panel.appendChild(mk('h4', { text: 'Filters' }));

  // search
  const search = mk('div', { class: 'hh-search' }, [ mk('input', { id: 'hh-search-input', placeholder: 'Search tasks, skills, cities...' }) ]);
  panel.appendChild(search);

  // type chips
  const typeWrap = mk('div', { class: 'hh-filter-wrap' });
  ['online','offline','local'].forEach(t => {
    const b = mk('button', { class: 'hh-chip', 'data-type': t, text: t });
    b.addEventListener('click', () => {
      if (State.filters.has(t)) { State.filters.delete(t); b.classList.remove('hh-chip-active'); }
      else { State.filters.add(t); b.classList.add('hh-chip-active'); }
      renderTaskGrid();
    });
    typeWrap.appendChild(b);
  });
  panel.appendChild(typeWrap);

  // city multi-select
  const cities = Array.from(new Set(TASKS.flatMap(t => t.cities))).sort();
  const cityLabel = mk('label', { text: 'Cities (multi-select)' });
  const citySel = mk('select', { id: 'hh-city-select', multiple: 'multiple', size: 6 });
  cities.forEach(c => citySel.appendChild(mk('option', { value: c, text: c })));
  citySel.addEventListener('change', () => {
    State.locs = new Set(Array.from(citySel.selectedOptions).map(o => o.value));
    renderTaskGrid();
  });
  panel.appendChild(cityLabel);
  panel.appendChild(citySel);

  // tags
  const tags = Array.from(new Set(TASKS.flatMap(t => t.tags || []))).sort();
  const tagWrap = mk('div', { class: 'hh-filter-wrap' });
  tags.forEach(tag => {
    const b = mk('button', { class: 'hh-chip', 'data-tag': tag, text: tag });
    b.addEventListener('click', () => {
      if (State.tags.has(tag)) { State.tags.delete(tag); b.classList.remove('hh-chip-active'); }
      else { State.tags.add(tag); b.classList.add('hh-chip-active'); }
      renderTaskGrid();
    });
    tagWrap.appendChild(b);
  });
  panel.appendChild(mk('h5', { text: 'Tags' }));
  panel.appendChild(tagWrap);

  // profile skills (for AI suggestions)
  panel.appendChild(mk('h5', { text: 'Your Skills (for suggestions)' }));
  const skillInput = mk('input', { id: 'hh-skill-input', placeholder: 'comma separated e.g. Math,Teaching' });
  const saveSkills = mk('button', { class: 'hh-btn hh-btn-primary', text: 'Save Skills' });
  saveSkills.addEventListener('click', () => {
    const raw = skillInput.value.split(',').map(s => s.trim()).filter(Boolean);
    State.profile.skills = raw;
    saveState();
    renderAISuggestions();
    flash('Profile skills saved');
  });
  panel.appendChild(skillInput);
  panel.appendChild(saveSkills);

  // main list
  const listWrap = mk('section', { class: 'hh-card hh-task-list' }, [ mk('div', { id: 'hh-tasks-grid', class: 'hh-grid' }) ]);

  const container = mk('div', { class: 'hh-views-grid' }, [ panel, listWrap ]);
  root.appendChild(container);

  // wire search with debounce
  const dd = (fn, ms=250) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), ms); }; };
  $('#hh-search-input', root).addEventListener('input', dd(e => { State.search = e.target.value.toLowerCase(); renderTaskGrid(); }));

  // initialize selected skills if present
  $('#hh-skill-input', panel).value = (State.profile.skills || []).join(', ');

  // render initial grid
  renderTaskGrid();
}

function renderTaskGrid() {
  const grid = $('#hh-tasks-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const s = State.search || '';
  const results = TASKS.filter(t => {
    if (State.filters.size && !State.filters.has(t.type)) return false;
    if (State.locs.size && !State.locs.has('All')) {
      if (!t.cities.some(c => State.locs.has(c))) return false;
    }
    if (State.tags.size) {
      if (!Array.from(State.tags).every(tag => (t.tags || []).includes(tag))) return false;
    }
    if (s) {
      const hay = [t.title, t.desc, (t.cities||[]).join(' '), (t.skills||[]).join(' '), (t.tags||[]).join(' ')].join(' ').toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });

  if (!results.length) {
    grid.appendChild(mk('div', { class: 'hh-muted', text: 'No matching tasks found.' }));
    return;
  }

  results.forEach(t => {
    const card = mk('article', { class: 'hh-task-card' });
    card.appendChild(mk('div', { class: 'hh-task-title' }, [ mk('h4', { text: t.title }), mk('div', { class: 'hh-task-meta hh-muted', text: `${t.time} • ${t.type}` }) ] ));
    card.appendChild(mk('p', { class: 'hh-task-desc', text: t.desc }));
    const bad = mk('div', { class: 'hh-task-badges' });
    (t.skills||[]).slice(0,4).forEach(s => bad.appendChild(mk('span', { class: 'hh-badge', text: s })));
    (t.tags||[]).slice(0,3).forEach(s => bad.appendChild(mk('span', { class: 'hh-badge', text: s })));
    card.appendChild(bad);
    const foot = mk('div', { class: 'hh-task-foot' }, [ mk('div', { class: 'hh-small hh-muted', text: `Cities: ${t.cities.join(', ')}` }) ]);
    const actions = mk('div', { class: 'hh-task-actions' });
    const help = mk('button', { class: 'hh-btn hh-btn-primary', text: "I'll Help" });
    help.addEventListener('click', () => addMission(t));
    const book = mk('button', { class: 'hh-btn hh-ghost', text: 'Book Slot' });
    book.addEventListener('click', () => openBookingModal(t));
    const details = mk('button', { class: 'hh-btn hh-ghost', text: 'Details' });
    details.addEventListener('click', () => showDetailsModal(t));
    actions.appendChild(help); actions.appendChild(book); actions.appendChild(details);
    foot.appendChild(actions);
    card.appendChild(foot);
    grid.appendChild(card);
  });
}

// -----------------------------
// Bookings
// -----------------------------
function openBookingModal(task) {
  const existing = $('#hh-modal'); if (existing) existing.remove();
  const overlay = mk('div', { id: 'hh-modal', class: 'hh-modal-overlay' });
  const box = mk('div', { class: 'hh-modal-box' });
  box.appendChild(mk('h3', { text: `Book: ${task.title}` }));
  box.appendChild(mk('p', { class: 'hh-muted', text: `${task.time} • ${task.cities.join(', ')}` }));
  // simple slots — next 5 half-hour slots (demo)
  const slots = generateTimeSlots(5);
  const slotWrap = mk('div', {});
  slots.forEach(s => {
    const b = mk('button', { class: 'hh-chip', text: s });
    b.addEventListener('click', () => {
      // create booking and save
      const booking = { id: 'b_' + Date.now(), taskId: task.id, title: task.title, slot: s, createdAt: Date.now() };
      State.bookings.push(booking);
      saveState();
      flash('Booked: ' + s);
      overlay.remove();
    });
    slotWrap.appendChild(b);
  });
  box.appendChild(slotWrap);
  const close = mk('button', { class: 'hh-btn hh-ghost', text: 'Close' });
  close.addEventListener('click', () => overlay.remove());
  box.appendChild(close);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function generateTimeSlots(n) {
  const out = [];
  const now = new Date();
  for (let i=1;i<=n;i++){
    const dt = new Date(now.getTime() + i*30*60000);
    out.push(dt.toLocaleString());
  }
  return out;
}

function renderBookings(root) {
  root.innerHTML = '';
  const card = mk('section', { class: 'hh-card' });
  card.appendChild(mk('h3', { text: 'Bookings' }));
  if (!State.bookings.length) {
    card.appendChild(mk('div', { class: 'hh-muted', text: 'No bookings yet.' }));
  } else {
    const list = mk('div', { class: 'hh-missions-list' });
    State.bookings.forEach(b => {
      const r = mk('div', { class: 'hh-mission-row' });
      r.appendChild(mk('div', {}, [ mk('strong', { text: b.title }), mk('div', { class: 'hh-muted hh-small', text: b.slot }) ]));
      const rem = mk('button', { class: 'hh-btn hh-btn-danger', text: 'Cancel' });
      rem.addEventListener('click', () => {
        State.bookings = State.bookings.filter(x => x.id !== b.id);
        saveState();
        render();
        flash('Booking canceled');
      });
      r.appendChild(rem);
      list.appendChild(r);
    });
    card.appendChild(list);
  }
  root.appendChild(card);
}

// -----------------------------
// Missions (My Missions)
// -----------------------------
function addMission(task) {
  if (State.missions.some(m => m.id === task.id)) { flash('Already in My Missions'); return; }
  const m = { ...task, localId: 'm_' + Date.now(), acceptedAt: Date.now(), done: false };
  State.missions.push(m);
  saveState();
  flash('Mission added to My Missions');
  render();
}

function renderMissions(root) {
  root.innerHTML = '';
  const card = mk('section', { class: 'hh-card' });
  card.appendChild(mk('h3', { text: 'My Missions' }));
  if (!State.missions.length) {
    card.appendChild(mk('div', { class: 'hh-muted', text: 'No missions. Browse Discover to add.' }));
  } else {
    const list = mk('div', { class: 'hh-missions-list' });
    State.missions.forEach(m => {
      const r = mk('div', { class: 'hh-mission-row ' + (m.done ? 'hh-mission-done':'' )});
      r.appendChild(mk('div', {}, [ mk('strong', { text: m.title }), mk('div', { class: 'hh-muted hh-small', text: `${m.time} • ${m.cities.join(', ')}` }) ]));
      const right = mk('div', {});
      const toggle = mk('button', { class: 'hh-btn hh-ghost', text: m.done ? 'Undo' : 'Done' });
      toggle.addEventListener('click', () => {
        State.missions = State.missions.map(x => x.localId === m.localId ? { ...x, done: !x.done } : x);
        saveState();
        render();
      });
      const rem = mk('button', { class: 'hh-btn hh-btn-danger', text: 'Remove' });
      rem.addEventListener('click', () => {
        State.missions = State.missions.filter(x => x.localId !== m.localId);
        saveState();
        render();
      });
      right.appendChild(toggle); right.appendChild(rem);
      r.appendChild(right);
      list.appendChild(r);
    });
    card.appendChild(list);
    // bulk actions
    const bulk = mk('div', { style: 'margin-top:12px;display:flex;gap:8px' });
    const clearDone = mk('button', { class: 'hh-btn', text: 'Remove Completed' });
    clearDone.addEventListener('click', () => {
      State.missions = State.missions.filter(m => !m.done);
      saveState();
      render();
      flash('Removed completed');
    });
    const clearAll = mk('button', { class: 'hh-btn hh-ghost', text: 'Clear All' });
    clearAll.addEventListener('click', () => {
      if (confirm('Clear all missions?')) {
        State.missions = [];
        saveState();
        render();
      }
    });
    const exportBtn = mk('button', { class: 'hh-btn hh-btn-primary', text: 'Export' });
    exportBtn.addEventListener('click', exportMissions);
    const importBtn = mk('button', { class: 'hh-btn hh-ghost', text: 'Import' });
    importBtn.addEventListener('click', importMissions);
    bulk.appendChild(clearDone); bulk.appendChild(clearAll); bulk.appendChild(exportBtn); bulk.appendChild(importBtn);
    card.appendChild(bulk);
  }
  root.appendChild(card);
}

// -----------------------------
// About
// -----------------------------
function renderAbout(root) {
  root.innerHTML = '';
  const card = mk('section', { class: 'hh-card' });
  card.appendChild(mk('h3', { text: 'About HelpHive' }));
  card.appendChild(mk('p', { class: 'hh-muted', text: 'HelpHive is a frontend-first micro-volunteering prototype by AttachToTech. It aims to make volunteering approachable: quick tasks, booking, and impact tracking.' }));
  card.appendChild(mk('h4', { text: 'Tech & features' }));
  const ul = mk('ul', {});
  ['Vanilla JS (ES6)', 'localStorage persistence', 'Hash routing (works on GitHub Pages)', 'Accessible UI', 'Simulated AI suggestions'].forEach(i => ul.appendChild(mk('li', { text: i })));
  card.appendChild(ul);
  root.appendChild(card);
}

// -----------------------------
// Modal / Details
// -----------------------------
function showDetailsModal(task) {
  const existing = $('#hh-modal'); if (existing) existing.remove();
  const overlay = mk('div', { id: 'hh-modal', class: 'hh-modal-overlay' });
  const box = mk('div', { class: 'hh-modal-box' });
  box.appendChild(mk('h3', { text: task.title }));
  box.appendChild(mk('p', { class: 'hh-muted', text: `${task.time} • ${task.type} • ${task.cities.join(', ')}` }));
  box.appendChild(mk('p', { text: task.desc }));
  if (task.skills) box.appendChild(mk('p', { class: 'hh-small', text: 'Skills: ' + task.skills.join(', ') }));
  if (task.prerequisites) box.appendChild(mk('p', { class: 'hh-small', text: 'Prerequisites: ' + task.prerequisites.join(', ') }));
  box.appendChild(mk('p', { class: 'hh-small hh-muted', text: 'Impact: ' + task.impactEstimate }));

  const actions = mk('div', {});
  const add = mk('button', { class: 'hh-btn hh-btn-primary', text: "I'll Help" });
  add.addEventListener('click', () => { addMission(task); overlay.remove(); });
  const book = mk('button', { class: 'hh-btn hh-ghost', text: 'Book Slot' });
  book.addEventListener('click', () => { overlay.remove(); openBookingModal(task); });
  const close = mk('button', { class: 'hh-btn hh-ghost', text: 'Close' });
  close.addEventListener('click', () => overlay.remove());
  actions.appendChild(add); actions.appendChild(book); actions.appendChild(close);
  box.appendChild(actions);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// -----------------------------
// Simple AI suggestions (client-side)
// -----------------------------
function renderAISuggestions() {
  const aiList = $('#hh-ai-list');
  if (!aiList) return;
  aiList.innerHTML = '';
  // build a simple score: +1 per matching skill, +0.5 per tag match
  const skills = (State.profile.skills || []).map(s => s.toLowerCase());
  const scored = TASKS.map(t => {
    let score = 0;
    (t.skills||[]).forEach(s => { if (skills.includes(s.toLowerCase())) score += 1; });
    (t.tags||[]).forEach(g => { if (skills.includes(g.toLowerCase())) score += 0.5; });
    // if user has 0 skills, prefer online tasks
    if (!skills.length && t.type === 'online') score += 0.2;
    return { t, score };
  }).sort((a,b)=> b.score - a.score).slice(0,6);

  scored.forEach(s => {
    const card = mk('div', { class: 'hh-task-card' });
    card.appendChild(mk('div', { class: 'hh-task-title' }, [ mk('h4', { text: s.t.title }), mk('div', { class: 'hh-task-meta hh-muted', text: `${s.t.time} • score ${s.score.toFixed(1)}` }) ] ));
    card.appendChild(mk('p', { class: 'hh-task-desc', text: s.t.desc }));
    const addBtn = mk('button', { class: 'hh-btn hh-btn-primary', text: "I'll Help" });
    addBtn.addEventListener('click', ()=> addMission(s.t));
    card.appendChild(addBtn);
    aiList.appendChild(card);
  });
}

// -----------------------------
// Import / Export
// -----------------------------
function exportMissions() {
  const data = JSON.stringify({ missions: State.missions, bookings: State.bookings, profile: State.profile }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'helphive_export.json';
  a.click();
  URL.revokeObjectURL(url);
}
function importMissions() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'application/json';
  inp.onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        State.missions = Array.isArray(parsed.missions) ? parsed.missions : State.missions;
        State.bookings = Array.isArray(parsed.bookings) ? parsed.bookings : State.bookings;
        State.profile = parsed.profile || State.profile;
        saveState();
        render();
        flash('Imported data');
      } catch {
        flash('Invalid file');
      }
    };
    r.readAsText(f);
  };
  inp.click();
}

// -----------------------------
// Flash notification
// -----------------------------
function flash(msg, time=1400) {
  const old = $('#hh-flash'); if (old) old.remove();
  const n = mk('div', { id: 'hh-flash', class: 'hh-flash', text: msg });
  document.body.appendChild(n);
  setTimeout(()=> n.classList.add('hh-flash-hide'), time - 200);
  setTimeout(()=> n.remove(), time);
}

// -----------------------------
// Init wiring
// -----------------------------
function wireGlobal() {
  const eb = $('#hh-export'); const ib = $('#hh-import');
  if (eb) eb.addEventListener('click', exportMissions);
  if (ib) ib.addEventListener('click', importMissions);

  // nav links
  $$('.nav-link').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); const href = a.getAttribute('href') || '#/'; navigate(href.replace('#',''));
  }));
}

function start() {
  loadState();
  wireGlobal();
  applyRouteFromHash();
  // global keyboard: press "/" to focus search if present
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const s = $('#hh-search-input'); if (s) s.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', start);
