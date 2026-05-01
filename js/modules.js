/* ═══════════════════════════════════════
   NOTIFICACIONES — notifications.js
═══════════════════════════════════════ */

function renderNotif() {
  $('notif-list').innerHTML = DB.notifications.map(n => `
    <div class="ni ${n.read ? '' : 'unread'}" onclick="readN(${n.id})">
      <div class="ni-ic" style="background:${n.bg}">${n.icon}</div>
      <div style="flex:1">
        <div class="ni-title">${n.title}</div>
        <div class="ni-txt">${n.text}</div>
        <div class="ni-time">${n.time}</div>
      </div>
      ${!n.read ? '<div class="ni-dot"></div>' : ''}
    </div>`).join('');
  updNB();
}

function readN(id) {
  const n = DB.notifications.find(x => x.id === id);
  if (n) { n.read = true; renderNotif(); updNB(); }
}

function markAll() {
  DB.notifications.forEach(n => n.read = true);
  renderNotif();
  updNB();
  toast('Todas marcadas como leídas', 's');
}


/* ═══════════════════════════════════════
   ASISTENCIA — attendance.js
═══════════════════════════════════════ */

let asisFilt = 'all';

function setAFilt(v, el) {
  asisFilt = v;
  document.querySelectorAll('#fps-asis .fp').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderAsis();
}

function renderAsis() {
  let appts = DB.appointments.filter(a => a.date <= '2026-04-18');

  if (asisFilt !== 'all') {
    appts = appts.filter(a => {
      const att = getAtt(a.id);
      const s   = att ? att.st : 'pending';
      return s === asisFilt;
    });
  }

  appts.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const sb = {
    attended: '<span class="badge batt">✅ Asistió</span>',
    absent:   '<span class="badge babs">❌ No asistió</span>',
    pending:  '<span class="badge bpen">⏳ Pendiente</span>',
  };

  $('asis-tb').innerHTML = appts.map(a => {
    const att  = getAtt(a.id);
    const s    = att ? att.st : 'pending';
    const acts = s === 'pending'
      ? `<button class="btn bsu btn-xs" onclick="regAtt(${a.id},'attended')">✅</button>
         <button class="btn bd btn-xs" onclick="regAtt(${a.id},'absent')">❌</button>`
      : `<button class="btn bs btn-xs" onclick="regAtt(${a.id},'pending')">↩</button>`;
    return `
      <tr>
        <td><strong>${a.pat}</strong></td>
        <td>${fmtDate(a.date)}</td>
        <td class="tc">${a.time}</td>
        <td>${a.trat}</td>
        <td class="tdc">${a.doc}</td>
        <td>${sb[s]}</td>
        <td>${acts}</td>
      </tr>`;
  }).join('');
}

function regAtt(aid, st) {
  const e = DB.attendance.find(a => a.aid === aid);
  if (e) e.st = st; else DB.attendance.push({ aid, st });

  const a = DB.appointments.find(x => x.id === aid);
  if (a && st === 'attended') a.status = 'completed';

  toast('Asistencia actualizada', 's');
  renderAsis();
}


/* ═══════════════════════════════════════
   REPORTES — reports.js
═══════════════════════════════════════ */

function renderRep() {
  renderChart('rep-w', [4, 6, 5, 7, 4, 2, 0], ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']);

  const treats = [
    { n: 'Limpieza dental', v: 12 },
    { n: 'Ortodoncia',      v: 8  },
    { n: 'Endodoncia',      v: 5  },
    { n: 'Extracción',      v: 4  },
    { n: 'Blanqueamiento',  v: 3  },
    { n: 'Radiografía',     v: 3  },
  ];
  const mx = Math.max(...treats.map(t => t.v));

  $('rep-t').innerHTML = treats.map(t => `
    <div class="hb-row">
      <div class="hb-l">${t.n}</div>
      <div class="hb-track"><div class="hb-fill" style="width:${(t.v / mx) * 100}%"></div></div>
      <div class="hb-v">${t.v}</div>
    </div>`).join('');
}


/* ═══════════════════════════════════════
   USUARIOS — users.js
═══════════════════════════════════════ */

function renderUsr() {
  $('usr-tb').innerHTML = DB.users.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:9px">
          <div style="width:32px;height:32px;border-radius:50%;background:${u.av};display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0">${u.in}</div>
          <strong>${u.nom}</strong>
        </div>
      </td>
      <td class="tdc">${u.email}</td>
      <td>${badgeRole(u.rol)}</td>
      <td>${u.esp}</td>
      <td><span class="badge ${u.active ? 'bco' : 'bca'}">${u.active ? 'Activo' : 'Inactivo'}</span></td>
      <td style="display:flex;gap:4px">
        <button class="btn bs btn-xs" onclick="toggleUsr(${u.id})">${u.active ? 'Desactivar' : 'Activar'}</button>
        ${u.id !== 1 ? `<button class="btn bd btn-xs" onclick="delUsr(${u.id})">🗑</button>` : ''}
      </td>
    </tr>`).join('');
}

function guardarUsr() {
  const nom = $('nu-nom').value.trim();
  const em  = $('nu-em').value.trim();
  if (!nom || !em) { toast('Nombre y email son requeridos', 'e'); return; }

  const rol  = $('nu-rol').value;
  const esp  = $('nu-esp').value || '—';
  const colors = ['#2563eb','#8b5cf6','#0ea5e9','#10b981','#f59e0b'];
  const av   = colors[DB.users.length % colors.length];
  const pts  = nom.split(' ');
  const inits = (pts[0][0] + (pts[1] ? pts[1][0] : '')).toUpperCase();

  DB.users.push({ id: IDS.usr++, nom, email: em, rol, esp, av, in: inits, active: true });
  closeMo('mo-usr');
  toast(`Usuario ${nom} creado`, 's');
  renderUsr();
}

function toggleUsr(id) {
  const u = DB.users.find(x => x.id === id);
  if (u) { u.active = !u.active; toast(`Usuario ${u.active ? 'activado' : 'desactivado'}`, 's'); renderUsr(); }
}

function delUsr(id) {
  const u = DB.users.find(x => x.id === id);
  if (!u) return;
  if (!confirm(`¿Eliminar a ${u.nom}?`)) return;
  DB.users = DB.users.filter(x => x.id !== id);
  toast('Usuario eliminado', 'w');
  renderUsr();
}