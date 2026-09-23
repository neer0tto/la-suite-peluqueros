/* ==========================================================
   LA SUITE PELUQUEROS — comparador.js
   Slider "antes / después": el usuario arrastra la línea central
   para comparar las dos fotos. Usa Pointer Events, que funcionan
   igual con ratón y con el dedo (táctil), sin librerías externas.
   También se puede mover con las flechas del teclado (accesible).
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const contenedor = document.getElementById('beforeAfter');
  const despuesWrap = document.getElementById('beforeAfterAfterWrap');
  const manija = document.getElementById('beforeAfterHandle');

  if (!contenedor || !despuesWrap || !manija) return;

  function fijarPosicion(porcentaje) {
    const valor = Math.min(100, Math.max(0, porcentaje));
    // A la izquierda de la manija se ve "antes" (la foto base); a la
    // derecha se recorta la capa "después" para dejarla al descubierto.
    despuesWrap.style.clipPath = `inset(0 0 0 ${valor}%)`;
    manija.style.left = valor + '%';
    manija.setAttribute('aria-valuenow', Math.round(valor));
  }

  function porcentajeDesdeEvento(clientX) {
    const rect = contenedor.getBoundingClientRect();
    const x = clientX - rect.left;
    return (x / rect.width) * 100;
  }

  let arrastrando = false;

  function empezarArrastre(evento) {
    arrastrando = true;
    contenedor.setPointerCapture(evento.pointerId);
  }

  function moverArrastre(evento) {
    if (!arrastrando) return;
    fijarPosicion(porcentajeDesdeEvento(evento.clientX));
  }

  function terminarArrastre(evento) {
    arrastrando = false;
    if (contenedor.hasPointerCapture(evento.pointerId)) {
      contenedor.releasePointerCapture(evento.pointerId);
    }
  }

  contenedor.addEventListener('pointerdown', empezarArrastre);
  contenedor.addEventListener('pointermove', moverArrastre);
  contenedor.addEventListener('pointerup', terminarArrastre);
  contenedor.addEventListener('pointercancel', terminarArrastre);

  // También permite hacer clic directamente en cualquier punto del comparador
  contenedor.addEventListener('click', function (evento) {
    fijarPosicion(porcentajeDesdeEvento(evento.clientX));
  });

  // Accesibilidad: mover con las flechas del teclado cuando la manija tiene foco
  manija.addEventListener('keydown', function (evento) {
    const actual = parseFloat(manija.getAttribute('aria-valuenow')) || 50;
    if (evento.key === 'ArrowLeft') {
      fijarPosicion(actual - 5);
      evento.preventDefault();
    } else if (evento.key === 'ArrowRight') {
      fijarPosicion(actual + 5);
      evento.preventDefault();
    }
  });

  // Posición inicial: 50/50
  fijarPosicion(50);

});
