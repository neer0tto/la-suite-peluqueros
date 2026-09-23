/* ==========================================================
   LA SUITE PELUQUEROS — galeria.js
   Carrusel "con profundidad": la foto del centro se ve grande y
   nítida; las de los lados, más pequeñas, un poco giradas hacia
   dentro y medio transparentes.

   Pasa sola cada 4 segundos, con un fundido suave (lo hace el CSS,
   animando la transformación y la opacidad de cada foto). El
   usuario puede pasar de foto en cualquier momento deslizando con
   el dedo, con las flechas, con las flechas del teclado o tocando
   los puntos; al hacerlo, el pase automático se detiene 3 segundos
   y luego sigue solo. Si el usuario tiene activado "reducir
   movimiento", el pase automático no se activa nunca.

   Para cambiar las fotos, sustituye images/galeria/galeria-1.jpg
   ... galeria-6.jpg por otras con el mismo nombre.
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const escenario = document.getElementById('galeriaEscenario');
  const botonAnterior = document.getElementById('galeriaAnterior');
  const botonSiguiente = document.getElementById('galeriaSiguiente');
  const zonaPuntos = document.getElementById('galeriaPuntos');

  if (!escenario) return;

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fotos = Array.from(escenario.querySelectorAll('.galeria-item'));
  const total = fotos.length;
  let actual = 0;

  // Crea un punto de navegación por cada foto
  const puntos = fotos.map(function (foto, indice) {
    const punto = document.createElement('button');
    punto.type = 'button';
    punto.className = 'galeria-punto';
    punto.setAttribute('aria-label', 'Ver foto ' + (indice + 1) + ' de ' + total);
    punto.addEventListener('click', function () { irManual(indice); });
    zonaPuntos.appendChild(punto);
    return punto;
  });

  // Distancia de cada foto a la central, dando la vuelta (la última
  // queda a la izquierda de la primera, como en un círculo)
  function distancia(indice) {
    let d = indice - actual;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function colocar() {
    fotos.forEach(function (foto, indice) {
      const d = distancia(indice);
      const lado = Math.sign(d);
      const lejania = Math.abs(d);

      let transform;
      let opacidad;

      if (lejania === 0) {
        transform = 'translateX(0) scale(1) rotateY(0deg)';
        opacidad = 1;
      } else if (lejania === 1) {
        transform = 'translateX(' + (lado * 68) + '%) scale(0.85) rotateY(' + (-lado * 15) + 'deg)';
        opacidad = 0.5;
      } else {
        // Las más alejadas se esconden detrás
        transform = 'translateX(' + (lado * 110) + '%) scale(0.7) rotateY(' + (-lado * 15) + 'deg)';
        opacidad = 0;
      }

      foto.style.transform = transform;
      foto.style.opacity = opacidad;
      foto.style.zIndex = String(10 - lejania);
      foto.style.pointerEvents = lejania <= 1 ? 'auto' : 'none';
      foto.setAttribute('aria-hidden', lejania === 0 ? 'false' : 'true');
    });

    puntos.forEach(function (punto, indice) {
      punto.classList.toggle('esta-activo', indice === actual);
    });
  }

  function ir(indice) {
    actual = (indice + total) % total;
    colocar();
  }

  /* ---------- Pase automático ----------
     "ir()" lo usa tanto el pase automático como el usuario. Para
     no confundir uno con otro, el usuario siempre pasa a través de
     "irManual()", que además reinicia la cuenta de 3 segundos. */
  let autoplay = null;
  let esperaParaReanudar = null;

  function iniciarAutoplay() {
    if (prefiereMenosMovimiento) return;
    clearInterval(autoplay);
    autoplay = setInterval(function () { ir(actual + 1); }, 4000);
  }

  function pausarYReanudarAutoplay() {
    if (prefiereMenosMovimiento) return;
    clearInterval(autoplay);
    clearTimeout(esperaParaReanudar);
    esperaParaReanudar = setTimeout(iniciarAutoplay, 3000);
  }

  function irManual(indice) {
    ir(indice);
    pausarYReanudarAutoplay();
  }

  // Tocar una foto lateral la trae al centro
  fotos.forEach(function (foto, indice) {
    foto.addEventListener('click', function () {
      if (indice !== actual) irManual(indice);
    });
  });

  if (botonAnterior) botonAnterior.addEventListener('click', function () { irManual(actual - 1); });
  if (botonSiguiente) botonSiguiente.addEventListener('click', function () { irManual(actual + 1); });

  // Teclado: con el carrusel enfocado, las flechas pasan de foto
  escenario.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowLeft') {
      irManual(actual - 1);
      evento.preventDefault();
    } else if (evento.key === 'ArrowRight') {
      irManual(actual + 1);
      evento.preventDefault();
    }
  });

  // Deslizar con el dedo (o arrastrar con el ratón)
  let inicioX = null;
  let movido = false;

  escenario.addEventListener('pointerdown', function (evento) {
    inicioX = evento.clientX;
    movido = false;
  });

  escenario.addEventListener('pointermove', function (evento) {
    if (inicioX !== null && Math.abs(evento.clientX - inicioX) > 10) {
      movido = true;
    }
  });

  escenario.addEventListener('pointerup', function (evento) {
    if (inicioX === null) return;
    const diferencia = evento.clientX - inicioX;
    inicioX = null;
    if (Math.abs(diferencia) > 50) {
      irManual(diferencia < 0 ? actual + 1 : actual - 1);
    }
  });

  escenario.addEventListener('pointercancel', function () {
    inicioX = null;
  });

  // Evita que un deslizamiento se interprete también como "clic" en una foto
  escenario.addEventListener('click', function (evento) {
    if (movido) {
      evento.stopPropagation();
      evento.preventDefault();
      movido = false;
    }
  }, true);

  colocar();
  iniciarAutoplay();

});
