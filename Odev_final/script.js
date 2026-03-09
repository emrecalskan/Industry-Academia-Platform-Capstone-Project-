/* ======================================================
   InConnect Platform Logic (Grup 17)
   Profesyonel SPA Yapısı
   ====================================================== */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// Formatlama Yardımcısı
function formatNumber(n) {
  return new Intl.NumberFormat('tr-TR').format(n);
}

/* ======================================================
   1) TOAST
   ====================================================== */
function showToast(msg, type = 'info') {
  const container = $('#toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const icons = { info: 'ℹ️', success: '✅', error: '⚠️' };
  toast.className = 'toast';
  toast.innerHTML = `<span>${icons[type] || '✨'}</span><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.25s ease forwards';
    setTimeout(() => toast.remove(), 260);
  }, 3000);
}

/* ======================================================
   2) AUTH / OTURUM
   ====================================================== */
const LS_KEY = 'inconnect_session_v1';

function getSession() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem(LS_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(LS_KEY);
}

function shortenName(full) {
  const parts = String(full).trim().split(/\s+/);
  if (parts.length === 0) return 'Kullanıcı';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

function applyAuthUI() {
  const s = getSession();
  if (!s) {
    document.body.classList.add('is-auth');
    return;
  }
  document.body.classList.remove('is-auth');

  // Üst profil
  const profName = $('.profile__name');
  const profRole = $('.profile__role');
  if (profName) profName.textContent = shortenName(s.name || 'Kullanıcı');
  if (profRole) profRole.textContent = s.role || 'Öğrenci';

  // Sol kart
  const leftName = $('.profile-card__name');
  if (leftName) leftName.textContent = s.name || 'Kullanıcı';
}

/* ======================================================
   3) MODAL SİSTEMİ
   ====================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = $('#overlay');
  if (!modal || !overlay) return;

  overlay.classList.remove('is-hidden');
  modal.classList.remove('is-hidden');

  const focusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) focusable.focus();
}

function closeAllModals() {
  const overlay = $('#overlay');
  if (overlay) overlay.classList.add('is-hidden');
  $$('.modal').forEach(m => m.classList.add('is-hidden'));
}

function isAnyModalOpen() {
  return !$('#overlay')?.classList.contains('is-hidden');
}

/* ======================================================
   4) ROUTING (Hash SPA)
   ====================================================== */
const PAGES = ['akis', 'projeler', 'siralama'];

function setActiveNav(page) {
  $$('.nav__item').forEach(a => a.classList.remove('is-active'));
  const item = $(`.nav__item[data-page="${page}"]`);
  if (item) item.classList.add('is-active');
}

function showPage(page) {
  PAGES.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (!el) return;
    el.classList.toggle('is-hidden', p !== page);
  });
  setActiveNav(page);
}

function showSubpage(sub) {
  const map = { active: 'subpage-active', done: 'subpage-done', report: 'subpage-report' };
  const ids = Object.values(map);
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('is-hidden', id !== map[sub]);
  });

  $$('.menu-item').forEach(a => a.classList.remove('is-active'));
  const activeItem = $(`.menu-item[data-subpage="${sub}"]`);
  if (activeItem) activeItem.classList.add('is-active');
}

function parseHash() {
  const raw = (location.hash || '#akis').replace('#', '');
  const [page, sub] = raw.split('/');
  return { page: page || 'akis', sub: sub || null };
}

function onRoute() {
  const { page, sub } = parseHash();
  const target = PAGES.includes(page) ? page : 'akis';
  showPage(target);

  if (target === 'akis') {
    if (sub === 'tamamlananlar') showSubpage('done');
    else if (sub === 'rapor') showSubpage('report');
    else showSubpage('active');
  }
}

window.addEventListener('hashchange', onRoute);

/* ======================================================
   5) DATA (Demo)
   ====================================================== */
const projects = [
  {
    id: 'p1',
    category: 'yazilim',
    company: 'KLS Teknoloji A.Ş.',
    title: 'Stok Takip Modülü API Geliştirmesi',
    level: 'Orta',
    status: 'Aktif',
    points: 500,
    desc: 'Node.js + Express + PostgreSQL ile JWT doğrulamalı RESTful stok düşüm servisi geliştir.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'REST'],
    req: 'API dokümantasyonu (Swagger veya README) ve çalışan kaynak kod (zip).'
  },
  {
    id: 'p2',
    category: 'yazilim',
    company: 'XYZ Yazılım',
    title: 'React Dashboard Arayüz Tasarımı',
    level: 'Kolay',
    status: 'Yeni',
    points: 250,
    desc: 'Responsive, dark-mode destekli bir admin dashboard bileşeni hazırla.',
    tags: ['React', 'UI', 'Responsive', 'Dark Mode'],
    req: 'Çalışan demo (Vite/CRA) ve ekran görüntüleri.'
  },
  {
    id: 'p3',
    category: 'veri',
    company: 'DataNova',
    title: 'Müşteri Segmentasyonu (K-Means)',
    level: 'Orta',
    status: 'Açık',
    points: 400,
    desc: 'Verilen müşteri datasetinde K-Means ile segmentasyon yap; sonuçları raporla.',
    tags: ['Python', 'Pandas', 'K-Means', 'EDA'],
    req: 'Notebook + kısa rapor (pdf).'
  },
  {
    id: 'p4',
    category: 'tasarim',
    company: 'UIWorks',
    title: 'Mobil Uygulama UI Kit',
    level: 'Kolay',
    status: 'Açık',
    points: 200,
    desc: 'Modern bir mobil uygulama için 8-10 ekranlık UI kit tasarla (Figma).',
    tags: ['Figma', 'UI Kit', 'Mobile'],
    req: 'Figma linki + exportlar.'
  }
];

const doneItems = [
  { id: 'd1', category: 'yazilim', title: 'Login Form Validasyonu', company: 'XYZ Yazılım', xp: 120, date: 'Aralık 2025' },
  { id: 'd2', category: 'veri', title: 'EDA Raporu', company: 'DataNova', xp: 160, date: 'Kasım 2025' },
  { id: 'd3', category: 'yazilim', title: 'REST Endpoint Tasarımı', company: 'KLS Teknoloji', xp: 140, date: 'Ekim 2025' },
  { id: 'd4', category: 'tasarim', title: 'Dashboard Wireframe', company: 'UIWorks', xp: 90, date: 'Eylül 2025' },
  { id: 'd5', category: 'yazilim', title: 'JWT Auth Entegrasyonu', company: 'KLS Teknoloji', xp: 200, date: 'Eylül 2025' },
  { id: 'd6', category: 'veri', title: 'K-Means Segmentasyon Denemesi', company: 'DataNova', xp: 180, date: 'Ağustos 2025' },
  { id: 'd7', category: 'yazilim', title: 'UI Bileşen Düzenlemeleri', company: 'XYZ Yazılım', xp: 150, date: 'Temmuz 2025' }
];

const ranking = [
  { name: 'Ayşe Demir', dept: 'Yazılım Müh.', xp: 1820 },
  { name: 'Mehmet Kaya', dept: 'Bilgisayar Müh.', xp: 1710 },
  { name: 'Zeynep Arslan', dept: 'Yazılım Müh.', xp: 1620 },
  { name: 'Emirhan Yılmaz', dept: 'Yazılım Müh.', xp: 1240 },
  { name: 'Adı Hidayat', dept: 'Yazılım Müh.', xp: 1230 },
  { name: 'Emre Çalışkan', dept: 'Yazılım Müh..', xp: 1200 },
  { name: 'Hasan Can', dept: 'Endüstri Müh.', xp: 1190 },
  { name: 'Elif Yıldız', dept: 'Bilgisayar Müh.', xp: 1160 }
];

/* ======================================================
   6) FEED FILTER (Akış)
   ====================================================== */
function setupFeedTabs() {
  const tabs = $('#feedTabs');
  if (!tabs) return;

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;

    tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.dataset.filter;
    $$('#subpage-active .post').forEach(p => {
      const cat = p.dataset.category;
      p.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
    });
  });
}

/* ======================================================
   7) DONE LIST
   ====================================================== */
function renderDoneList() {
  const root = $('#doneList');
  if (!root) return;

  root.innerHTML = doneItems.map(d => `
    <article class="post" data-category="${d.category}">
      <div class="post__top">
        <div class="company-logo">${(d.company || 'CO').slice(0,2).toUpperCase()}</div>
        <div class="post__meta">
          <div class="post__name">${d.company} <span class="badge badge--green">Onaylandı</span></div>
          <div class="post__subtitle muted">${d.date}</div>
        </div>
        <div class="score-badge">${d.xp} XP</div>
      </div>
      <h3 class="post__title">${d.title}</h3>
      <div class="post__actions">
        <button class="btn btn--ghost" type="button" onclick="showToast('Demo: Detay görüntüleme yakında', 'info')">Detay</button>
      </div>
    </article>
    <div class="divider"></div>
  `).join('');
}

function filterDoneList() {
  const q = ($('#doneSearch')?.value || '').trim().toLowerCase();
  $$('#doneList .post').forEach(card => {
    const t = card.innerText.toLowerCase();
    card.style.display = (!q || t.includes(q)) ? '' : 'none';
  });
  $$('#doneList .divider').forEach(div => div.style.display = ''); // basit
}

/* ======================================================
   8) REPORT
   ====================================================== */
function renderReport() {
  const totalXP = ranking.find(r => r.name === (getSession()?.name || 'Emirhan Yılmaz'))?.xp ?? 1240;

  $('#repXP') && ($('#repXP').textContent = formatNumber(totalXP));
  $('#repDoneCount') && ($('#repDoneCount').textContent = String(doneItems.length));
  $('#repActiveCount') && ($('#repActiveCount').textContent = '2');

  // barlist demo
  const barList = $('#barList');
  if (barList) {
    const skills = [
      { name: 'Backend', v: 60 },
      { name: 'Frontend', v: 35 },
      { name: 'Data', v: 45 },
      { name: 'UI/UX', v: 25 }
    ];
    barList.innerHTML = skills.map(s => `
      <div>
        <div style="display:flex; justify-content:space-between; font-weight:900; font-size:12px; margin-bottom:6px;">
          <span>${s.name}</span><span class="muted">${s.v}%</span>
        </div>
        <div class="bar"><span style="width:${s.v}%"></span></div>
      </div>
    `).join('');
  }

  const tl = $('#recentTimeline');
  if (tl) {
    const items = [
      { t: 'Proje başvurusu gönderildi (demo)', m: 'Bugün' },
      { t: 'Yeni proje çağrısı görüntülendi', m: 'Dün' },
      { t: 'Profil güncellendi', m: '3 gün önce' }
    ];
    tl.innerHTML = items.map(x => `
      <div class="tl-item">
        <div class="tl-title">${x.t}</div>
        <div class="tl-meta muted">${x.m}</div>
      </div>
    `).join('');
  }
}

function downloadReport() {
  const s = getSession();
  const content =
`InConnect Başarı Raporu (Demo)
----------------------------
Kullanıcı: ${s?.name || 'Kullanıcı'}
Rol: ${s?.role || 'Öğrenci'}
XP: ${$('#repXP')?.textContent || '1240'}
Tamamlanan: ${doneItems.length}
Aktif: 2
`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inconnect_rapor_demo.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Rapor indirildi (demo).', 'success');
}

/* ======================================================
   9) PROJECTS GRID
   ====================================================== */
function renderProjectsGrid() {
  const grid = $('#projectsGrid');
  if (!grid) return;

  grid.innerHTML = projects.map(p => `
    <section class="card project-card" data-category="${p.category}">
      <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
        <div>
          <div style="font-weight:900; font-size:16px;">${p.title}</div>
          <div class="muted" style="font-size:12px; margin-top:4px;">${p.company} • ${p.level}</div>
        </div>
        <div class="score-badge">${p.points} XP</div>
      </div>
      <div class="tag-row">
        ${p.tags.slice(0,3).map(t => `<span class="pill">${t}</span>`).join('')}
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn--primary" type="button" data-open-project="${p.id}" data-start="0">Detay</button>
        <button class="btn btn--ghost" type="button" data-open-project="${p.id}" data-start="1">Çözüme Başla</button>
      </div>
    </section>
  `).join('');
}

function filterProjectsGrid() {
  const q = ($('#projectSearch')?.value || '').trim().toLowerCase();
  const cat = $('#projectCategory')?.value || 'all';

  $$('#projectsGrid .project-card').forEach(card => {
    const textOk = !q || card.innerText.toLowerCase().includes(q);
    const catOk = (cat === 'all' || card.dataset.category === cat);
    card.style.display = (textOk && catOk) ? '' : 'none';
  });
}

/* ======================================================
   10) RANKING PAGE
   ====================================================== */
function renderRanking() {
  const body = $('#rankingBody');
  if (!body) return;

  body.innerHTML = ranking.map((r, idx) => `
    <div class="trow">
      <div class="tcell"><strong>${idx + 1}</strong></div>
      <div class="tcell" style="display:flex; align-items:center; gap:10px;">
        <div class="avatar avatar--sm"></div>
        <div>
          <div style="font-weight:900">${r.name}</div>
          <div class="muted" style="font-size:11px">${r.name === (getSession()?.name || 'Emirhan Yılmaz') ? 'Sen' : 'Öğrenci'}</div>
        </div>
      </div>
      <div class="tcell">${r.dept}</div>
      <div class="tcell tcell--right"><strong>${formatNumber(r.xp)}</strong></div>
    </div>
  `).join('');

  const meIndex = ranking.findIndex(x => x.name === (getSession()?.name || 'Emirhan Yılmaz'));
  if ($('#pmRank')) $('#pmRank').textContent = meIndex >= 0 ? `#${meIndex + 1}` : '#-';
}

function filterRanking() {
  const q = ($('#rankSearch')?.value || '').trim().toLowerCase();
  $$('#rankingBody .trow').forEach(row => {
    const name = row.querySelector('.tcell:nth-child(2)')?.innerText.toLowerCase() || '';
    row.style.display = (!q || name.includes(q)) ? '' : 'none';
  });
}

/* ======================================================
   11) PROJECT MODAL
   ====================================================== */
function fillProjectModal(projectId, startMode = false) {
  const p = projects.find(x => x.id === projectId) || projects[0];
  if (!p) return;

  $('#pmTitle') && ($('#pmTitle').textContent = p.title);
  $('#pmCompany') && ($('#pmCompany').textContent = `${p.company} • Demo`);
  $('#pmLevel') && ($('#pmLevel').textContent = p.level);
  $('#pmStatus') && ($('#pmStatus').textContent = p.status);
  $('#pmPoints') && ($('#pmPoints').textContent = `${p.points} XP`);
  $('#pmDesc') && ($('#pmDesc').textContent = p.desc);
  $('#pmReq') && ($('#pmReq').textContent = `Gerekenler: ${p.req}`);

  const tags = $('#pmTags');
  if (tags) tags.innerHTML = p.tags.map(t => `<span class="pill">${t}</span>`).join('');

  const submitStatus = $('#pmSubmitStatus');
  if (submitStatus) {
    submitStatus.textContent = startMode
      ? 'Dosyanı seçip göndererek başvurunu tamamlayabilirsin.'
      : 'Detayları inceleyip başvurabilirsin.';
  }

  const file = $('#pmFile');
  if (file) file.value = '';
}

function openProjectFlow(projectId, startMode = false) {
  fillProjectModal(projectId, startMode);
  openModal('projectModal');
}

/* ======================================================
   12) PROFIL MENU
   ====================================================== */
function setupProfileMenu() {
  const btn = $('#profileBtn');
  const menu = $('#profileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('is-hidden');
    menu.classList.toggle('is-hidden', isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.add('is-hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('button[data-action]');
    if (!item) return;

    const act = item.dataset.action;
    menu.classList.add('is-hidden');
    btn.setAttribute('aria-expanded', 'false');

    if (act === 'openProfile') openModal('profileModal');
    if (act === 'openSettings') openModal('editProfileModal');
    if (act === 'logout') {
      clearSession();
      showToast('Çıkış yapıldı.', 'success');
      applyAuthUI();
      location.hash = '#akis';
    }
  });
}

/* ======================================================
   13) EVENT WIRING + LOGIN (DEMO)
   ====================================================== */
function setupGlobalHandlers() {
  // Modal close
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close="modal"]');
    if (closeBtn) closeAllModals();

    const openProjectBtn = e.target.closest('[data-open-project]');
    if (openProjectBtn) {
      const id = openProjectBtn.dataset.openProject;
      const startMode = openProjectBtn.dataset.start === '1';
      openProjectFlow(id, startMode);
    }

    // Feed butonları
    if (e.target.closest('.js-open-details')) {
      const post = e.target.closest('.post');
      openProjectFlow(post?.dataset.projectId || 'p1', false);
    }
    if (e.target.closest('.js-start-solution')) {
      const post = e.target.closest('.post');
      openProjectFlow(post?.dataset.projectId || 'p1', true);
    }
    if (e.target.closest('.js-download-files')) {
      showToast('Dosyalar indiriliyor. (demo)', 'info');
      const blob = new Blob(['Demo dosyası'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'proje_dosyasi_demo.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    if (e.target.closest('.js-company-click')) showToast('Firma sayfası: Demo', 'info');
  });

  // ESC kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isAnyModalOpen()) closeAllModals();
  });

  // Proje yükleme (modal)
  $('#pmSubmitBtn')?.addEventListener('click', () => {
    const file = $('#pmFile')?.files?.[0];
    const st = $('#pmSubmitStatus');
    if (!st) return;

    if (!file) {
      st.textContent = 'Lütfen önce bir dosya seç.';
      showToast('Dosya seçmedin.', 'error');
      return;
    }
    st.textContent = `Gönderildi: ${file.name} (demo)`;
    showToast('Dosya gönderildi (demo).', 'success');
  });

  // Sol menü subpage routing
  $$('.menu-item').forEach(a => {
    a.addEventListener('click', (e) => {
      const sp = a.dataset.subpage;
      if (!sp) return;
      e.preventDefault();
      if (sp === 'active') location.hash = '#akis';
      if (sp === 'done') location.hash = '#akis/tamamlananlar';
      if (sp === 'report') location.hash = '#akis/rapor';
    });
  });

  // Profil düzenle butonu
  $('#editProfileBtn')?.addEventListener('click', () => openModal('editProfileModal'));

  // Edit profile save (HATA FIX: ...s)
  $('#epSaveBtn')?.addEventListener('click', () => {
    const s = getSession() || { name: 'Kullanıcı', email: '-', role: 'Öğrenci' };
    const newName = $('#epName')?.value?.trim() || s.name;
    const newRole = $('#epRole')?.value?.trim() || s.role;

    setSession({ ...s, name: newName, role: newRole });
    showToast('Profil güncellendi.', 'success');
    applyAuthUI();
    closeAllModals();
    renderReport();
    renderRanking();
  });

  // Report download
  $('#downloadReportBtn')?.addEventListener('click', downloadReport);

  // Search inputs
  $('#doneSearch')?.addEventListener('input', filterDoneList);
  $('#projectSearch')?.addEventListener('input', filterProjectsGrid);
  $('#projectCategory')?.addEventListener('change', filterProjectsGrid);
  $('#rankSearch')?.addEventListener('input', filterRanking);
}

/* ======================================================
   LOGIN (DEMO): Her şeyi kabul eder
   ====================================================== */
function setupLogin() {
  const form = $('#loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Demo: boş bile olsa kabul
    const name = ($('#loginName')?.value ?? '').trim() || 'Demo Kullanıcı';
    const email = ($('#loginEmail')?.value ?? '').trim() || 'demo@inconnect.local';
    const role = ($('#loginRole')?.value ?? '').trim() || 'Öğrenci';

    setSession({ name, email, role, at: Date.now() });
    showToast('Giriş başarılı (demo).', 'success');
    applyAuthUI();

    // Güvenli yönlendirme
    if (!location.hash || location.hash === '#') location.hash = '#akis';
    onRoute();

    // UI refresh
    renderReport();
    renderRanking();
  });
}

/* ======================================================
   INIT
   ====================================================== */
function init() {
  applyAuthUI();
  setupLogin();

  setupFeedTabs();
  setupProfileMenu();
  setupGlobalHandlers();

  renderDoneList();
  renderProjectsGrid();
  renderRanking();
  renderReport();

  onRoute();
}

document.addEventListener('DOMContentLoaded', init);
