/* ═══════════════════════════════════════
   DASHBOARD — dashboard.js
═══════════════════════════════════════ */

function renderDash() {
  const hoy = todayAppts();
  $('d-hoy').textContent  = hoy.length;
  $('d-comp').textContent = hoy.filter(a => a.status === 'completed').length;
  $('d-pend').textContent = hoy.filter(a => ['programmed', 'confirmed'].includes(a.status)).length;

  $('dash-list').innerHTML = hoy.length
    ? hoy
        .sort((a, b) => a.time.localeCompare(b.time))
        .map(a => `
          <div class="ali" onclick="abrirGestionar(${a.id})">
            <span class="al-t">${a.time}</span>
            ${dot(a.status)}
            <div style="flex:1">
              <div class="al-nm">${a.pat}</div>
              <div class="al-tr">${a.trat}</div>
            </div>
            <div class="al-dc2">${a.doc.replace('Dra. ', '').replace('Dr. ', '')}</div>
          </div>`)
        .join('')
    : '<p class="empty">Sin citas hoy</p>';

  renderChart('ch-weekly', [4, 6, 5, 7, 4, 2, 0], ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']);
  updNB();
}

/* ─── Bar chart (numbers + bars) ─── */
function renderChart(elId, data, labels) {
  const el = $(elId);
  if (!el) return;
  const max = Math.max(...data, 1);
  el.innerHTML = `
    <div class="chart-row">
      ${data.map((v, i) => `
        <div class="cbar-col">
          <span class="cbar-num">${v}</span>
          <div class="cbar" style="height:${Math.max((v / max) * 100, 3)}%" title="${labels[i]}: ${v}"></div>
          <span class="cbar-lbl">${labels[i]}</span>
        </div>`).join('')}
    </div>`;
}