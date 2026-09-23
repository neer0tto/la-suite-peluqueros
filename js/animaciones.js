/* ==========================================================
   LA SUITE PELUQUEROS — animaciones.js
   Revela elementos con una transición suave (opacidad + desplazamiento)
   cuando entran en la pantalla al hacer scroll.

   Usa IntersectionObserver (no "scroll" listeners) para que sea
   eficiente y no ralentice la página. Si el usuario tiene activada
   la preferencia de "reducir movimiento" del sistema, las animaciones
   se desactivan y el contenido aparece directamente.
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elementos = document.querySelectorAll('[data-animate]');
  if (!elementos.length) return;

  if (prefiereMenosMovimiento) {
    elementos.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // Añade un pequeño retraso escalonado a los elementos de un mismo grupo
  // (tarjetas de servicios, galería, reseñas) para que aparezcan en cascada
  const grupos = document.querySelectorAll('[data-animate-group]');
  grupos.forEach(function (grupo) {
    const hijos = grupo.querySelectorAll('[data-animate]');
    hijos.forEach(function (hijo, indice) {
      hijo.style.transitionDelay = (indice * 90) + 'ms';
    });
  });

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  elementos.forEach(function (el) { observador.observe(el); });

});
