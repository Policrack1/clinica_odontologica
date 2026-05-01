/* ═══════════════════════════════════════
   DATA STORE — db.js
   Datos de la clínica (pacientes, citas, usuarios, notificaciones, asistencia)
═══════════════════════════════════════ */

const DB = {
  patients: [
    { id:1, nom:'Juan Pérez',      dni:'45612378', tel:'987-654-321', email:'juan@gmail.com',    born:'1990-03-15', gen:'M', blood:'O+',  av:'#10b981', in:'JP', alg:'Ninguna',    dir:'Av. Los Álamos 234, Lima',    tot:8  },
    { id:2, nom:'Ana García',      dni:'71234567', tel:'976-543-210', email:'ana@gmail.com',     born:'1985-07-22', gen:'F', blood:'A+',  av:'#f59e0b', in:'AG', alg:'Penicilina', dir:'Jr. Pachacútec 56, Lima',     tot:12 },
    { id:3, nom:'Luis Torres',     dni:'60987654', tel:'965-432-109', email:'luis@gmail.com',    born:'1978-11-08', gen:'M', blood:'B-',  av:'#ef4444', in:'LT', alg:'Ninguna',    dir:'Av. Brasil 890, Callao',      tot:5  },
    { id:4, nom:'Carmen Ruiz',     dni:'52345678', tel:'954-321-098', email:'carmen@gmail.com',  born:'1995-04-30', gen:'F', blood:'AB+', av:'#8b5cf6', in:'CR', alg:'Ibuprofeno', dir:'Calle Los Pinos 12, Lima',    tot:3  },
    { id:5, nom:'Pedro Díaz',      dni:'48765432', tel:'943-210-987', email:'pedro@gmail.com',   born:'1988-09-12', gen:'M', blood:'O-',  av:'#06b6d4', in:'PD', alg:'Ninguna',    dir:'Av. Universitaria 450, Lima', tot:6  },
    { id:6, nom:'María Flores',    dni:'39876543', tel:'932-109-876', email:'mflores@gmail.com', born:'1972-12-25', gen:'F', blood:'A-',  av:'#ec4899', in:'MF', alg:'Látex',       dir:'Jr. Bolívar 78, Lima',        tot:15 },
    { id:7, nom:'Jorge Martínez',  dni:'65432198', tel:'921-098-765', email:'jorge@gmail.com',   born:'1980-06-17', gen:'M', blood:'B+',  av:'#f97316', in:'JM', alg:'Ninguna',    dir:'Av. Colonial 324, Lima',      tot:4  },
    { id:8, nom:'Rosa Hernández',  dni:'76543219', tel:'910-987-654', email:'rosa@gmail.com',    born:'1965-02-03', gen:'F', blood:'O+',  av:'#14b8a6', in:'RH', alg:'Codeína',    dir:'Calle Las Flores 5, Lima',    tot:20 },
  ],

  appointments: [
    { id:1,  date:'2026-04-18', time:'09:00', pid:1, pat:'Juan Pérez',     did:2, doc:'Dra. María López',     trat:'Limpieza dental',        status:'confirmed',  notes:'',                  diag:'Limpieza profunda realizada. Sin caries detectadas.' },
    { id:2,  date:'2026-04-18', time:'10:00', pid:2, pat:'Ana García',     did:3, doc:'Dr. Roberto Sánchez', trat:'Ortodoncia - Control',   status:'programmed', notes:'Traer Rx previas',  diag:'' },
    { id:3,  date:'2026-04-18', time:'11:30', pid:3, pat:'Luis Torres',    did:2, doc:'Dra. María López',     trat:'Endodoncia',             status:'ongoing',    notes:'',                  diag:'Tratamiento de conducto en progreso. Pieza 26.' },
    { id:4,  date:'2026-04-18', time:'14:00', pid:4, pat:'Carmen Ruiz',    did:3, doc:'Dr. Roberto Sánchez', trat:'Extracción',             status:'programmed', notes:'Primera visita',    diag:'' },
    { id:5,  date:'2026-04-19', time:'09:30', pid:5, pat:'Pedro Díaz',     did:2, doc:'Dra. María López',     trat:'Blanqueamiento',         status:'programmed', notes:'',                  diag:'' },
    { id:6,  date:'2026-04-17', time:'10:00', pid:6, pat:'María Flores',   did:2, doc:'Dra. María López',     trat:'Limpieza dental',        status:'completed',  notes:'',                  diag:'Limpieza supragingival completada. Se recomienda revisión en 6 meses.' },
    { id:7,  date:'2026-04-17', time:'15:00', pid:7, pat:'Jorge Martínez', did:3, doc:'Dr. Roberto Sánchez', trat:'Corona dental',          status:'completed',  notes:'',                  diag:'Colocación de corona en pieza 16. Material: porcelana sobre metal.' },
    { id:8,  date:'2026-04-16', time:'11:00', pid:8, pat:'Rosa Hernández', did:2, doc:'Dra. María López',     trat:'Revisión general',       status:'cancelled',  notes:'Canceló por enfermedad', diag:'' },
    { id:9,  date:'2026-04-22', time:'10:00', pid:1, pat:'Juan Pérez',     did:2, doc:'Dra. María López',     trat:'Control ortodoncia',     status:'programmed', notes:'',                  diag:'' },
    { id:10, date:'2026-04-20', time:'08:00', pid:2, pat:'Ana García',     did:3, doc:'Dr. Roberto Sánchez', trat:'Radiografía',            status:'programmed', notes:'',                  diag:'' },
    { id:11, date:'2026-04-21', time:'16:00', pid:5, pat:'Pedro Díaz',     did:2, doc:'Dra. María López',     trat:'Revisión',               status:'programmed', notes:'',                  diag:'' },
    { id:12, date:'2026-04-25', time:'09:00', pid:4, pat:'Carmen Ruiz',    did:3, doc:'Dr. Roberto Sánchez', trat:'Control post extracción', status:'programmed', notes:'',                  diag:'' },
    { id:13, date:'2026-04-14', time:'09:00', pid:1, pat:'Juan Pérez',     did:2, doc:'Dra. María López',     trat:'Revisión general',       status:'completed',  notes:'',                  diag:'Revisión preventiva. Caries incipiente en molar inferior. Control en 3 meses.' },
    { id:14, date:'2026-04-10', time:'14:00', pid:6, pat:'María Flores',   did:2, doc:'Dra. María López',     trat:'Ortodoncia - Ajuste',    status:'completed',  notes:'',                  diag:'Ajuste de brackets. Buena adherencia al tratamiento.' },
    { id:15, date:'2026-04-07', time:'11:00', pid:8, pat:'Rosa Hernández', did:3, doc:'Dr. Roberto Sánchez', trat:'Extracción',             status:'completed',  notes:'',                  diag:'Extracción de tercer molar inferior izquierdo. Sin complicaciones.' },
  ],

  users: [
    { id:1, nom:'Carlos Mendoza',       email:'admin@sonrisa.com',   rol:'admin',    esp:'—',           av:'#2563eb', in:'CM', active:true },
    { id:2, nom:'Dra. María López',     email:'maria@sonrisa.com',   rol:'doctor',   esp:'Ortodoncia',  av:'#8b5cf6', in:'ML', active:true },
    { id:3, nom:'Dr. Roberto Sánchez',  email:'roberto@sonrisa.com', rol:'doctor',   esp:'Endodoncia',  av:'#0ea5e9', in:'RS', active:true },
    { id:4, nom:'Juan Pérez',           email:'juan@gmail.com',      rol:'paciente', esp:'—',           av:'#10b981', in:'JP', active:true },
    { id:5, nom:'Ana García',           email:'ana@gmail.com',       rol:'paciente', esp:'—',           av:'#f59e0b', in:'AG', active:true },
  ],

  notifications: [
    { id:1, icon:'📅', bg:'#dbeafe', title:'Cita confirmada',      text:'Cita de Juan Pérez el 18 Abr 09:00 ha sido confirmada.',    time:'Hace 2h',    read:false },
    { id:2, icon:'⏰', bg:'#fef3c7', title:'Recordatorio de cita', text:'Ana García tiene cita mañana a las 10:00 con Dr. Sánchez.', time:'Hace 4h',    read:false },
    { id:3, icon:'❌', bg:'#fee2e2', title:'Cita cancelada',        text:'Rosa Hernández canceló su cita del 16 de Abril.',           time:'Hace 1 día', read:true  },
    { id:4, icon:'✅', bg:'#d1fae5', title:'Nuevo paciente',        text:'Carmen Ruiz fue registrada como nueva paciente.',           time:'Hace 2 días',read:true  },
    { id:5, icon:'📊', bg:'#ede9fe', title:'Reporte listo',         text:'El reporte semanal del 14–18 de Abril está disponible.',   time:'Hace 3 días',read:true  },
  ],

  attendance: [
    { aid:1,  st:'attended' },
    { aid:6,  st:'attended' },
    { aid:7,  st:'attended' },
    { aid:8,  st:'absent'   },
    { aid:13, st:'attended' },
    { aid:14, st:'attended' },
    { aid:15, st:'attended' },
  ],
};

// Auto-increment IDs
const IDS = { cita: 16, pac: 9, usr: 6 };