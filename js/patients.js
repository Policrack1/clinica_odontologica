/* ═══════════════════════════════════════
   PACIENTES — patients.js
   Registro, búsqueda e historial de pacientes
═══════════════════════════════════════ */

let pacFilt = 'todos';

function setPacFilt(v, el) {
  pacFilt = v;
  document.querySelectorAll('#fps-pac .fp').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderPac();
}

/* ─── Render patient cards grid ─── */
function renderPac() {
  const q = ($('p-q') || { value: '' }).value.toLowerCase();
  let pacs = [...DB.patients];

  if (q)              pacs = pacs.filter(p => p.nom.toLowerCase().includes(q) || p.dni.includes(q));
  if (pacFilt === 'doc2') pacs = pacs.filter(p => DB.appointments.some(a => a.pid === p.id && a.did === 2));
  if (pacFilt === 'doc3') pacs = pacs.filter(p => DB.appointments.some(a => a.pid === p.id && a.did === 3));
  if (pacFilt === 'alg')  pacs = pacs.filter(p => p.alg !== 'Ninguna');

  $('pac-grid').innerHTML = pacs.map(p => `
    <div class="pc" onclick="verHistorial(${p.id})">
      <div class="pc-top">
        <div class="pc-av" style="background:${p.av}">${p.in}</div>
        <div>
          <div class="pc-nm">${p.nom}</div>
          <div class="pc-id">DNI: ${p.dni}</div>
        </div>
      </div>
      <div class="pc-tags">
        <span class="pc-tag">📱 ${p.tel}</span>
        <span class="pc-tag">🩸 ${p.blood}</span>
        <span class="pc-tag">📋 ${DB.appointments.filter(a => a.pid === p.id).length} citas</span>
        ${p.alg !== 'Ninguna' ? `<span class="pc-tag alg">⚠️ ${p.alg}</span>` : ''}
      </div>
    </div>`).join('') || '<p class="empty">No se encontraron pacientes</p>';
}

/* ─── Ver historial médico ─── */
function verHistorial(id) {
  const p = DB.patients.find(x => x.id === id);
  if (!p) return;

  const myAppts   = DB.appointments.filter(a => a.pid === id).sort((a, b) => b.date.localeCompare(a.date));
  const completed = myAppts.filter(a => a.status === 'completed');
  const upcoming  = myAppts.filter(a => ['programmed','confirmed','ongoing'].includes(a.status));

  $('hx-title').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:38px;height:38px;border-radius:50%;background:${p.av};display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700;flex-shrink:0">${p.in}</div>
      <div>
        <div>${p.nom}</div>
        <div style="font-size:12px;color:var(--t2);font-weight:400">DNI: ${p.dni}</div>
      </div>
    </div>`;

  $('hx-body').innerHTML = `
    <div class="tabs">
      <span class="tab active" onclick="showTab('tab-info',this)">👤 Datos personales</span>
      <span class="tab" onclick="showTab('tab-hx',this)">🏥 Historial clínico</span>
      <span class="tab" onclick="showTab('tab-prox',this)">📅 Próximas citas</span>
    </div>

    <!-- Datos personales -->
    <div class="tab-pane active" id="tab-info">
      <div class="info-row"><span class="k">Nombre completo</span><span class="v">${p.nom}</span></div>
      <div class="info-row"><span class="k">DNI</span><span class="v">${p.dni}</span></div>
      <div class="info-row"><span class="k">Teléfono</span><span class="v">${p.tel}</span></div>
      <div class="info-row"><span class="k">Email</span><span class="v">${p.email}</span></div>
      <div class="info-row"><span class="k">Fecha de nacimiento</span><span class="v">${fmtDate(p.born)}</span></div>
      <div class="info-row"><span class="k">Género</span><span class="v">${p.gen === 'M' ? 'Masculino' : 'Femenino'}</span></div>
      <div class="info-row"><span class="k">Grupo sanguíneo</span><span class="v">${p.blood}</span></div>
      <div class="info-row"><span class="k">Alergias</span><span class="v" style="color:${p.alg !== 'Ninguna' ? 'var(--err)' : 'inherit'}">${p.alg !== 'Ninguna' ? '⚠️ ' : ''} ${p.alg}</span></div>
      <div class="info-row"><span class="k">Dirección</span><span class="v">${p.dir || '—'}</span></div>
      <div class="info-row"><span class="k">Total de citas</span><span class="v">${myAppts.length}</span></div>
    </div>

    <!-- Historial clínico -->
    <div class="tab-pane" id="tab-hx">
      ${completed.length
        ? completed.map(a => {
            const dt  = new Date(a.date + 'T00:00:00');
            const day = dt.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
            const yr  = dt.getFullYear();
            return `
              <div class="hx-item">
                <div class="hx-date"><div class="d">${day}</div><div class="y">${yr}</div></div>
                <div class="hx-body">
                  <div class="hx-trat">🦷 ${a.trat}</div>
                  <div class="hx-doc">${a.doc}</div>
                  ${a.diag
                    ? `<div class="hx-note">${a.diag}</div>`
                    : `<div class="hx-note" style="color:var(--t3)"><em>Sin diagnóstico registrado</em></div>`}
                </div>
                <div class="hx-st">${badge(a.status)}</div>
              </div>`;
          }).join('')
        : '<p class="empty">No hay historial clínico registrado aún</p>'}
    </div>

    <!-- Próximas citas -->
    <div class="tab-pane" id="tab-prox">
      ${upcoming.length
        ? upcoming.map(a => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--brdl)">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="background:var(--pril);border-radius:8px;padding:6px 10px;text-align:center;min-width:48px">
                <div style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:var(--pri)">${new Date(a.date+'T00:00:00').getDate()}</div>
                <div style="font-size:10px;color:var(--pri);text-transform:uppercase">${new Date(a.date+'T00:00:00').toLocaleString('es-PE',{month:'short'})}</div>
              </div>
              <div>
                <div style="font-weight:700;font-size:13px">🦷 ${a.trat}</div>
                <div style="font-size:12px;color:var(--t2);margin-top:2px">⏰ ${a.time} · ${a.doc}</div>
              </div>
            </div>
            ${badge(a.status)}
          </div>`).join('')
        : '<p class="empty">No hay citas próximas programadas</p>'}
    </div>`;

  openMo('mo-hx');
}

/* ─── Guardar nuevo paciente ─── */
function guardarPac() {
  const nom = $('np-nom').value.trim();
  const dni = $('np-dni').value.trim();
  if (!nom || !dni) { toast('Nombre y DNI son requeridos', 'e'); return; }
  if (DB.patients.find(p => p.dni === dni)) { toast('DNI ya registrado en el sistema', 'e'); return; }

  const colors = ['#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#f97316','#14b8a6'];
  const av     = colors[DB.patients.length % colors.length];
  const pts    = nom.split(' ');
  const inits  = (pts[0][0] + (pts[1] ? pts[1][0] : '')).toUpperCase();

  DB.patients.push({
    id: IDS.pac++, nom, dni,
    tel:   $('np-tel').value   || '—',
    email: $('np-email').value || '—',
    born:  $('np-born').value  || '2000-01-01',
    gen:   $('np-gen').value,
    blood: $('np-blood').value,
    av, in: inits,
    alg:   $('np-alg').value   || 'Ninguna',
    dir:   $('np-dir').value   || '—',
    tot: 0,
  });

  closeMo('mo-pac');
  toast(`Paciente ${nom} registrado`, 's');
  renderPac();
  initPacSel();
}

/* ─── Buscar pacientes ─── */
function buscar() {
  const q   = $('b-q').value.toLowerCase().trim();
  const res = $('buscar-res');

  if (!q) { res.innerHTML = '<p class="empty">Escribe para buscar un paciente...</p>'; return; }

  const found = DB.patients.filter(p => p.nom.toLowerCase().includes(q) || p.dni.includes(q));

  if (!found.length) {
    res.innerHTML = `<p class="empty">No se encontraron resultados para "<strong>${q}</strong>"</p>`;
    return;
  }

  res.innerHTML = `
    <p style="font-size:12px;color:var(--t2);margin-bottom:10px">Se encontraron <strong>${found.length}</strong> resultado(s)</p>
    <div class="pg" style="padding:0">
      ${found.map(p => `
        <div class="pc" onclick="verHistorial(${p.id})">
          <div class="pc-top">
            <div class="pc-av" style="background:${p.av}">${p.in}</div>
            <div><div class="pc-nm">${p.nom}</div><div class="pc-id">DNI: ${p.dni}</div></div>
          </div>
          <div class="pc-tags">
            <span class="pc-tag">📱 ${p.tel}</span>
            <span class="pc-tag">🩸 ${p.blood}</span>
            <span class="pc-tag">📋 ${DB.appointments.filter(a => a.pid === p.id).length} citas</span>
            ${p.alg !== 'Ninguna' ? `<span class="pc-tag alg">⚠️ ${p.alg}</span>` : ''}
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--brdl);display:flex;gap:6px">
            <button class="btn bp btn-sm" style="flex:1;justify-content:center" onclick="event.stopPropagation();verHistorial(${p.id})">🏥 Ver historial</button>
            <button class="btn bs btn-sm" style="flex:1;justify-content:center" onclick="event.stopPropagation();agendarDesdeBuscar(${p.id})">📅 Agendar</button>
          </div>
        </div>`).join('')}
    </div>`;
}

function agendarDesdeBuscar(pid) {
  $('nc-pac').value = pid;
  openMo('mo-cita');
}

/* ─── Populate patient select (new appointment modal) ─── */
function initPacSel() {
  const sel = $('nc-pac');
  sel.innerHTML = '<option value="">Seleccionar paciente...</option>';
  DB.patients.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.nom;
    sel.appendChild(o);
  });
}