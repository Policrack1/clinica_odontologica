/* ═══════════════════════════════════════
   CITAS — citas.js
   Gestión de citas: listar, crear, editar, cancelar
═══════════════════════════════════════ */

let citaFilt = 'todas';

function setCFilt(v, el) {
  citaFilt = v;
  document.querySelectorAll('#fps-citas .fp').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderCitas();
}

function renderCitas() {
  let appts = [...DB.appointments];

  // Search filter
  const q = ($('c-q') || { value: '' }).value.toLowerCase();
  if (q) appts = appts.filter(x => x.pat.toLowerCase().includes(q) || x.trat.toLowerCase().includes(q));

  // Status filter
  if (citaFilt !== 'todas') appts = appts.filter(x => x.status === citaFilt);

  // Sort: newest first
  appts.sort((x, y) => (y.date + y.time).localeCompare(x.date + x.time));

  $('citas-tb').innerHTML = appts.map(x => `
    <tr>
      <td>${fmtDate(x.date)}</td>
      <td class="tc">${x.time}</td>
      <td><strong>${x.pat}</strong></td>
      <td class="tdc">${x.doc}</td>
      <td>${x.trat}</td>
      <td>${badge(x.status)}</td>
      <td style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
        ${x.status === 'ongoing'
          ? `<button class="btn bpur btn-xs" onclick="abrirGestionar(${x.id})">⚙️ Gestionar</button>`
          : `<button class="btn bs btn-xs" onclick="abrirGestionar(${x.id})">✏️ Editar</button>`}
        <button class="btn bs btn-xs" onclick="verDetalle(${x.id})">👁</button>
        ${x.status !== 'cancelled' ? `<button class="btn bd btn-xs" onclick="cancelarCita(${x.id})">✕</button>` : ''}
      </td>
    </tr>`).join('');
}

/* ─── Gestionar cita (modal) ─── */
function abrirGestionar(id) {
  const a = DB.appointments.find(x => x.id === id);
  if (!a) return;

  $('gc-id').value = id;
  $('gc-info').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div>
        <strong style="font-size:14px">${a.pat}</strong>
        <div style="font-size:12px;color:var(--t2);margin-top:2px">🦷 ${a.trat} · 📅 ${fmtDate(a.date)} · ⏰ ${a.time}</div>
      </div>
      ${badge(a.status)}
    </div>`;
  $('gc-status').value = a.status;
  $('gc-doc').value    = a.doc;
  $('gc-fecha').value  = a.date;
  $('gc-hora').value   = a.time;
  $('gc-trat').value   = a.trat;
  $('gc-notas').value  = a.diag || a.notes || '';
  openMo('mo-gestionar');
}

function guardarGestion() {
  const id = parseInt($('gc-id').value);
  const a  = DB.appointments.find(x => x.id === id);
  if (!a) return;

  const ns = $('gc-status').value;
  a.status = ns;
  a.date   = $('gc-fecha').value;
  a.time   = $('gc-hora').value;
  a.trat   = $('gc-trat').value;
  a.diag   = $('gc-notas').value;

  // Sync attendance
  if (ns === 'completed') {
    const e = DB.attendance.find(x => x.aid === id);
    if (e) e.st = 'attended'; else DB.attendance.push({ aid: id, st: 'attended' });
  }
  if (ns === 'cancelled') {
    const e = DB.attendance.find(x => x.aid === id);
    if (e) e.st = 'absent';
  }

  closeMo('mo-gestionar');
  const labels = { confirmed:'Confirmada', programmed:'Programada', ongoing:'En Curso', completed:'Completada', cancelled:'Cancelada' };
  toast(`Cita de ${a.pat} actualizada → ${labels[ns]}`, 's');
  renderCitas();
  renderDash();
}

/* ─── Detalle cita (modal) ─── */
function verDetalle(id) {
  const a = DB.appointments.find(x => x.id === id);
  if (!a) return;

  $('hx-title').textContent = `Detalle de Cita #${id}`;
  $('hx-body').innerHTML = `
    <div class="info-row"><span class="k">Paciente</span><span class="v">${a.pat}</span></div>
    <div class="info-row"><span class="k">Odontólogo</span><span class="v">${a.doc}</span></div>
    <div class="info-row"><span class="k">Fecha</span><span class="v">${fmtDate(a.date)}</span></div>
    <div class="info-row"><span class="k">Hora</span><span class="v">${a.time}</span></div>
    <div class="info-row"><span class="k">Tratamiento</span><span class="v">${a.trat}</span></div>
    <div class="info-row"><span class="k">Estado</span><span class="v">${badge(a.status)}</span></div>
    ${a.notes ? `<div class="info-row"><span class="k">Notas</span><span class="v">${a.notes}</span></div>` : ''}
    ${a.diag ? `
      <div style="margin-top:12px">
        <div class="section-lbl">Diagnóstico / Notas clínicas</div>
        <div style="background:var(--bg);border-radius:var(--r);padding:10px 12px;border-left:3px solid var(--pri);font-size:13px;color:var(--t2)">${a.diag}</div>
      </div>` : ''}`;
  openMo('mo-hx');
}

/* ─── Cancelar cita ─── */
function cancelarCita(id) {
  const a = DB.appointments.find(x => x.id === id);
  if (!a) return;
  if (!confirm(`¿Cancelar cita de ${a.pat}?`)) return;
  a.status = 'cancelled';
  toast('Cita cancelada', 'w');
  renderCitas();
  renderDash();
}

/* ─── Guardar nueva cita ─── */
function guardarCita() {
  const pid   = parseInt($('nc-pac').value);
  const did   = parseInt($('nc-doc').value);
  const fecha = $('nc-fecha').value;
  const hora  = $('nc-hora').value;
  const trat  = $('nc-trat').value;
  const notas = $('nc-notas').value;

  if (!pid || !fecha || !hora) { toast('Completa los campos requeridos', 'e'); return; }

  const pac = DB.patients.find(p => p.id === pid);
  const doc = DB.users.find(u => u.id === did);

  DB.appointments.push({
    id: IDS.cita++, date: fecha, time: hora,
    pid, pat: pac.nom, did, doc: doc.nom,
    trat, status: 'programmed', notes: notas, diag: '',
  });

  closeMo('mo-cita');
  toast(`Cita de ${pac.nom} agendada`, 's');
  renderCitas();
  renderDash();
}