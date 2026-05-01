/* ═══════════════════════════════════════
   AGENDA DIGITAL — agenda.js
   Vistas mensual, semanal y diaria del calendario
═══════════════════════════════════════ */

let calState = {
  view: 'month',
  year: 2026,
  month: 4,
  selDay: '2026-04-18',
  docFilter: 'todos',
};

const calDotCls = {
  confirmed:  'cd-c',
  programmed: 'cd-p',
  ongoing:    'cd-on',
  completed:  'cd-co',
  cancelled:  'cd-ca',
};

/* ─── Navigation ─── */
function calNav(dir) {
  if (calState.view === 'month') {
    calState.month += dir;
    if (calState.month > 12) { calState.month = 1;  calState.year++; }
    if (calState.month < 1)  { calState.month = 12; calState.year--; }
  } else {
    const d = new Date(calState.selDay + 'T00:00:00');
    d.setDate(d.getDate() + dir * (calState.view === 'day' ? 1 : 7));
    calState.selDay = d.toISOString().split('T')[0];
  }
  renderAgenda();
}

function setCalView(v, el) {
  calState.view = v;
  document.querySelectorAll('.cal-v').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  renderAgenda();
}

function setCalDoc(v, el) {
  calState.docFilter = v;
  document.querySelectorAll('.cal-filter .fp').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  renderAgenda();
}

/* ─── Main render dispatcher ─── */
function renderAgenda() {
  const { view, year, month, selDay, docFilter } = calState;
  let appts = [...DB.appointments];
  if (docFilter !== 'todos') appts = appts.filter(a => a.did === parseInt(docFilter));

  const mnNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  if (view === 'month') {
    $('cal-lbl').textContent = `${mnNames[month - 1]} ${year}`;
    renderCalMonth(year, month, appts);
  } else if (view === 'week') {
    const base = new Date(selDay + 'T00:00:00');
    const dow  = base.getDay();
    const mon  = new Date(base); mon.setDate(base.getDate() - (dow === 0 ? 6 : dow - 1));
    const sun  = new Date(mon);  sun.setDate(mon.getDate() + 6);
    $('cal-lbl').textContent = `${fmtDateShort(mon.toISOString().split('T')[0])} — ${fmtDateShort(sun.toISOString().split('T')[0])} ${year}`;
    renderCalWeek(mon, appts);
  } else {
    $('cal-lbl').textContent = fmtDate(selDay);
    renderCalDay(selDay, appts);
  }
}

/* ─── Month view ─── */
function renderCalMonth(year, month, appts) {
  const firstDay    = new Date(year, month - 1, 1).getDay();
  const offset      = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  let html = `
    <div class="cal-days-hdr">
      ${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => `<div class="cal-dh">${d}</div>`).join('')}
    </div>
    <div class="cal-grid">`;

  // Leading empty cells
  for (let i = 0; i < offset; i++) html += `<div class="cal-cell" style="background:#fafafa;opacity:.5"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayAppts = appts.filter(a => a.date === ds).sort((a, b) => a.time.localeCompare(b.time));
    const isToday  = ds === '2026-04-18';
    const visible  = dayAppts.slice(0, 3);
    const more     = dayAppts.length - 3;

    html += `
      <div class="cal-cell ${isToday ? 'today' : ''} ${dayAppts.length ? 'has-appts' : ''}" onclick="calClickDay('${ds}')">
        <div class="cal-day-num">${d}</div>
        <div class="cal-dot-row">
          ${visible.map(a => `
            <div class="cal-dot ${calDotCls[a.status] || 'cd-p'}"
                 onclick="event.stopPropagation();abrirGestionar(${a.id})"
                 title="${a.time} ${a.pat}">
              ${a.time} ${a.pat.split(' ')[0]}
            </div>`).join('')}
          ${more > 0 ? `<div class="cal-more">+${more} más</div>` : ''}
        </div>
      </div>`;
  }

  // Trailing empty cells
  const remaining = (7 - ((offset + daysInMonth) % 7)) % 7;
  for (let i = 0; i < remaining; i++) html += `<div class="cal-cell" style="background:#fafafa;opacity:.5"></div>`;
  html += '</div>';

  $('cal-body').innerHTML = html;
}

/* ─── Week view ─── */
function renderCalWeek(monday, appts) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  const dn = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--brdl)">`;
  days.forEach((ds, i) => {
    const d      = new Date(ds + 'T00:00:00').getDate();
    const isToday = ds === '2026-04-18';
    const cnt    = appts.filter(a => a.date === ds).length;
    html += `
      <div style="padding:10px 6px;text-align:center;cursor:pointer;border-right:1px solid var(--brdl);${isToday ? 'background:#eff6ff' : ''}" onclick="calClickDay('${ds}')">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--t3)">${dn[i]}</div>
        <div style="font-family:'Sora',sans-serif;font-size:18px;font-weight:700;${isToday ? 'color:var(--pri)' : 'color:var(--t1)'};margin-top:2px">${d}</div>
        ${cnt ? `<div style="font-size:10px;font-weight:600;color:var(--pri);margin-top:2px">${cnt} cita${cnt > 1 ? 's' : ''}</div>` : ''}
      </div>`;
  });

  html += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr)">';
  days.forEach(ds => {
    const da = appts.filter(a => a.date === ds).sort((a, b) => a.time.localeCompare(b.time));
    html += `<div style="min-height:180px;padding:8px 6px;border-right:1px solid var(--brdl);border-bottom:1px solid var(--brdl)">`;
    da.forEach(a => {
      html += `<div class="cal-dot ${calDotCls[a.status] || 'cd-p'}" style="margin-bottom:3px" onclick="abrirGestionar(${a.id})">${a.time} ${a.pat.split(' ')[0]}</div>`;
    });
    html += '</div>';
  });
  html += '</div>';
  $('cal-body').innerHTML = html;
}

/* ─── Day view ─── */
function renderCalDay(ds, appts) {
  const da = appts.filter(a => a.date === ds).sort((a, b) => a.time.localeCompare(b.time));

  let html = `<div class="cal-day-view">
    <div class="cal-day-title">📅 ${fmtDate(ds)} — ${da.length} cita${da.length !== 1 ? 's' : ''}</div>`;

  if (!da.length) {
    html += '<p class="empty">No hay citas para este día con el filtro seleccionado</p>';
  } else {
    html += `<div class="tl">${da.map(a => `
      <div class="tl-item">
        <div class="tl-time">${a.time}</div>
        <div class="tl-dot ${a.status === 'ongoing' ? 'don' : a.status === 'completed' ? 'dco' : a.status === 'confirmed' ? 'dc' : ''}"></div>
        <div class="tl-card ${a.status === 'ongoing' ? 'ton' : ''}" onclick="abrirGestionar(${a.id})">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-weight:700;font-size:14px">${a.pat}</div>
              <div style="font-size:12px;color:var(--t2);margin-top:2px">🦷 ${a.trat}</div>
              <div style="font-size:11px;color:var(--t3);margin-top:2px">${a.doc}</div>
              ${a.diag ? `<div style="font-size:11px;color:var(--t2);margin-top:4px;font-style:italic">${a.diag.substring(0,60)}${a.diag.length > 60 ? '...' : ''}</div>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
              ${badge(a.status)}
              <button class="btn bpur btn-xs" onclick="event.stopPropagation();abrirGestionar(${a.id})">⚙️ Gestionar</button>
            </div>
          </div>
        </div>
      </div>`).join('')}</div>`;
  }
  html += '</div>';
  $('cal-body').innerHTML = html;
}

/* ─── Click day → switch to day view ─── */
function calClickDay(ds) {
  calState.selDay = ds;
  calState.view   = 'day';
  document.querySelectorAll('.cal-v').forEach((x, i) => {
    x.classList.toggle('active', i === 2);
  });
  $('cal-lbl').textContent = fmtDate(ds);
  let appts = [...DB.appointments];
  if (calState.docFilter !== 'todos') appts = appts.filter(a => a.did === parseInt(calState.docFilter));
  renderCalDay(ds, appts);
}