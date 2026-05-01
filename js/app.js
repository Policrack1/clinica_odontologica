/* ═══════════════════════════════════════
   APP — app.js
   Login, inicialización y registro de renders
═══════════════════════════════════════ */

/* ─── Register section render functions ─── */
Object.assign(renders, {
  's-dash':   renderDash,
  's-citas':  renderCitas,
  's-agenda': renderAgenda,
  's-pac':    renderPac,
  's-buscar': () => {
    $('buscar-res').innerHTML = '<p class="empty">Escribe para buscar un paciente...</p>';
    $('b-q').value = '';
  },
  's-notif':  renderNotif,
  's-asis':   renderAsis,
  's-rep':    renderRep,
  's-usr':    renderUsr,
});

/* ─── Login ─── */
let currentRole = 'admin';
const roleEmails = { admin: 'admin@sonrisa.com', doctor: 'maria@sonrisa.com', paciente: 'juan@gmail.com' };
const roleLabels = { admin: 'Administrador', doctor: 'Odontólogo', paciente: 'Paciente' };

function pickRole(r, el) {
  currentRole = r;
  document.querySelectorAll('.rtab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  $('l-btn').textContent = `Ingresar como ${roleLabels[r]}`;
  $('l-em').value = roleEmails[r];
}

function doLogin() {
  const btn = $('l-btn');
  btn.textContent = 'Ingresando...';
  btn.style.opacity = '.7';
  setTimeout(() => {
    $('pg-login').style.display = 'none';
    $('pg-app').style.display   = 'block';
    init();
  }, 700);
}

function logout() {
  $('pg-app').style.display   = 'none';
  $('pg-login').style.display = 'grid';
  $('l-btn').textContent      = 'Ingresar como Administrador';
  $('l-btn').style.opacity    = '1';
}

/* ─── App initialization ─── */
function init() {
  initPacSel();
  $('nc-fecha').value = '2026-04-22';
  $('nc-hora').value  = '09:00';
  renderDash();
  renderAgenda();
  updNB();
}