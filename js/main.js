/* ==========================================================
   LA SUITE PELUQUEROS — main.js
   Funciones generales del sitio: año del footer, resaltado de
   la sección activa en la píldora de navegación móvil, y el
   efecto de cabecera compacta al hacer scroll.
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Año actual en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Cabecera: sombra al hacer scroll ----------
     En vez de escuchar el evento "scroll" (poco eficiente), se
     observa un pequeño elemento invisible justo al principio de
     la página: cuando deja de verse, es que hemos hecho scroll. */
  const header = document.getElementById('header');
  const sentinelaScroll = document.getElementById('scrollSentinel');
  if (header && sentinelaScroll) {
    const observadorHeader = new IntersectionObserver(function (entradas) {
      header.classList.toggle('is-scrolled', !entradas[0].isIntersecting);
    });
    observadorHeader.observe(sentinelaScroll);
  }

  /* ---------- Resaltado de sección activa (píldora móvil) ---------- */
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');
  if (mobileLinks.length) {
    const secciones = Array.from(mobileLinks)
      .map(function (link) { return document.getElementById(link.dataset.section); })
      .filter(Boolean);

    const observer = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        mobileLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.dataset.section === entrada.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    secciones.forEach(function (seccion) { observer.observe(seccion); });
  }

});
