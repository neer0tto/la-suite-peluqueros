/* ==========================================================
   LA SUITE PELUQUEROS — galeria.js
   Carrusel horizontal de la galería. El deslizamiento táctil en
   móvil lo gestiona el propio navegador (scroll horizontal nativo);
   este script solo añade las flechas y el desplazamiento con la
   rueda del ratón en escritorio.
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const track = document.getElementById('galeriaTrack');
  const btnPrev = document.getElementById('galeriaPrev');
  const btnNext = document.getElementById('galeriaNext');

  if (!track) return;

  function anchoDesplazamiento() {
    const item = track.querySelector('.gallery-carousel__item');
    if (!item) return track.clientWidth;
    const estilo = window.getComputedStyle(track);
    return item.getBoundingClientRect().width + parseFloat(estilo.gap || 20);
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      track.scrollBy({ left: -anchoDesplazamiento(), behavior: 'smooth' });
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      track.scrollBy({ left: anchoDesplazamiento(), behavior: 'smooth' });
    });
  }

  // Convierte el scroll vertical de la rueda del ratón en desplazamiento
  // horizontal cuando el cursor está sobre la galería (solo escritorio)
  track.addEventListener('wheel', function (evento) {
    if (Math.abs(evento.deltaY) <= Math.abs(evento.deltaX)) return;
    evento.preventDefault();
    track.scrollLeft += evento.deltaY;
  }, { passive: false });

});
