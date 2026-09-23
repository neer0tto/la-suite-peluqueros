/* ==========================================================
   LA SUITE PELUQUEROS — antes-despues.js
   Comparador de dos fotos: arrastrando la línea dorada se ve
   más "antes" (izquierda) o más "después" (derecha).

   Funciona con el dedo y con el ratón (usa "pointer events",
   que tratan igual los dos) y con las flechas del teclado
   cuando el círculo central tiene el foco.

   Para cambiar las fotos, sustituye images/antes.jpg y
   images/despues.jpg por otras con el mismo nombre.
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const comparador = document.getElementById('comparador');
  const capaDespues = document.getElementById('comparadorDespues');
  const linea = document.getElementById('comparadorLinea');
  const agarre = document.getElementById('comparadorAgarre');

  if (!comparador || !capaDespues || !linea || !agarre) return;

  let posicionActual = 50;

  // Coloca la línea en un porcentaje (0 = todo "antes", 100 = todo "después")
  function colocar(porcentaje) {
    posicionActual = Math.min(100, Math.max(0, porcentaje));
    // A la derecha de la línea se ve la foto "después"
    capaDespues.style.clipPath = 'inset(0 0 0 ' + posicionActual + '%)';
    linea.style.left = posicionActual + '%';
    agarre.setAttribute('aria-valuenow', Math.round(posicionActual));
  }

  function porcentajeDesdeX(clientX) {
    const caja = comparador.getBoundingClientRect();
    return ((clientX - caja.left) / caja.width) * 100;
  }

  let arrastrando = false;

  comparador.addEventListener('pointerdown', function (evento) {
    arrastrando = true;
    comparador.setPointerCapture(evento.pointerId);
    colocar(porcentajeDesdeX(evento.clientX));
  });

  comparador.addEventListener('pointermove', function (evento) {
    if (!arrastrando) return;
    colocar(porcentajeDesdeX(evento.clientX));
  });

  function soltar(evento) {
    arrastrando = false;
    if (comparador.hasPointerCapture(evento.pointerId)) {
      comparador.releasePointerCapture(evento.pointerId);
    }
  }

  comparador.addEventListener('pointerup', soltar);
  comparador.addEventListener('pointercancel', soltar);

  // Teclado: flechas izquierda/derecha mueven la línea de 5 en 5
  agarre.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowLeft') {
      colocar(posicionActual - 5);
      evento.preventDefault();
    } else if (evento.key === 'ArrowRight') {
      colocar(posicionActual + 5);
      evento.preventDefault();
    }
  });

  colocar(50);

});
