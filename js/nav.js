/* ═══════════════════════════════════════
   NAVIGATION — nav.js
   Sidebar routing and section switching
═══════════════════════════════════════ */

// Map section IDs → render functions (populated after all modules load)
const renders = {};

function go(sid, el) {
  // Hide all sections
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  $(sid).classList.add('active');

  // Update sidebar active state
  document.querySelectorAll('.sb-it').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  // Run the section's render function if available
  if (renders[sid]) renders[sid]();
}