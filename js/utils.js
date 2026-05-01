/* ═══════════════════════════════════════
   UTILITIES — utils.js
   Helpers, Toast, Modal, Navigation
═══════════════════════════════════════ */

/* ─── DOM helper ─── */
const $ = id => document.getElementById(id);

/* ─── Date formatting ─── */
function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateShort(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

/* ─── Badge generators ─── */
function badge(s) {
  const map = {
    confirmed:  ['bc',  'Confirmada'],
    programmed: ['bp2', 'Programada'],
    ongoing:    ['bon', 'En Curso'],
    completed:  ['bco', 'Completada'],
    cancelled:  ['bca', 'Cancelada'],
  };
  const [cls, lbl] = map[s] || ['bpen', s];
  return `<span class="badge ${cls}">${lbl}</span>`;
}

function badgeRole(r) {
  const map = {
    admin:    ['badm', 'Administrador'],
    doctor:   ['bdoc', 'Odontólogo'],
    paciente: ['bpac', 'Paciente'],
  };
  const [c, l] = map[r] || ['bpen', r];
  return `<span class="badge ${c}">${l}</span>`;
}

function dot(s) {
  const map = {
    confirmed: 'al-dc',
    programmed:'al-dp',
    ongoing:   'al-don',
    completed: 'al-dco',
    cancelled: 'al-dca',
  };
  return `<span class="al-d ${map[s] || 'al-dp'}"></span>`;
}

/* ─── Data helpers ─── */
function getAtt(aid)    { return DB.attendance.find(a => a.aid === aid); }
function unreadCount()  { return DB.notifications.filter(n => !n.read).length; }
function todayAppts()   { return DB.appointments.filter(a => a.date === '2026-04-18'); }

/* ─── Toast ─── */
function toast(msg, type = '', dur = 3200) {
  const icons = { s: '✅', w: '⚠️', e: '❌', '': 'ℹ️' };
  const c = $('toasts');
  const t = document.createElement('div');
  t.className = `toast ${type === 's' ? 'ts' : type === 'w' ? 'tw2' : type === 'e' ? 'te' : ''}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'tout .22s ease forwards';
    setTimeout(() => t.remove(), 220);
  }, dur);
}

/* ─── Modals ─── */
function openMo(id)  { $(id).classList.add('open'); }
function closeMo(id) { $(id).classList.remove('open'); }

// Close on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('mo')) e.target.classList.remove('open');
});

/* ─── Notification badge update ─── */
function updNB() {
  const c = unreadCount();
  const nb  = $('nb');
  const dot = $('tb-dot');
  nb.textContent   = c || '';
  nb.style.display = c ? 'inline-block' : 'none';
  if (dot) dot.style.display = c ? 'block' : 'none';
}

/* ─── Tabs inside modals ─── */
function showTab(tabId, el) {
  const parent = el.closest('.mo-box') || el.closest('.sec');
  if (!parent) return;
  parent.querySelectorAll('.tab').forEach(t  => t.classList.remove('active'));
  parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const tp = document.getElementById(tabId);
  if (tp) tp.classList.add('active');
}