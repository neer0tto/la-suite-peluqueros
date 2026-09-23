/* ==========================================================
   LA SUITE PELUQUEROS — opiniones.js
   Muestra una opinión cada vez dentro de un único recuadro y
   va cambiando sola cada 6 segundos. También anima el número
   grande de la valoración (de 0,0 a 4,8).

   PARA CAMBIAR LAS OPINIONES: edita solo la lista de abajo.
   Cada opinión tiene "texto" y "autora". Puedes añadir o quitar
   las que quieras; los puntos de navegación se crean solos.
========================================================== */

const OPINIONES = [
  // EJEMPLO: sustituir por opinión real
  {
    texto: 'Me sentí escuchada desde el primer momento. Salí con el pelo exactamente como quería.',
    autora: 'Clienta'
  },
  // EJEMPLO: sustituir por opinión real
  {
    texto: 'Un sitio tranquilo, con mucho gusto y un trato muy cercano. Repetiré seguro.',
    autora: 'Clienta'
  },
  // EJEMPLO: sustituir por opinión real
  {
    texto: 'El color quedó precioso y muy natural. Se nota que saben lo que hacen.',
    autora: 'Clienta'
  },
  // EJEMPLO: sustituir por opinión real
  {
    texto: 'Me peinaron para una boda y el recogido aguantó perfecto toda la noche.',
    autora: 'Clienta'
  }
];

const SEGUNDOS_POR_OPINION = 6;

document.addEventListener('DOMContentLoaded', function () {

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Contador 0,0 → 4,8 ---------- */
  const numero = document.getElementById('opinionesNumero');
  if (numero) {
    const valorFinal = 4.8;

    function mostrarNumero(valor) {
      // Usamos coma decimal, como se escribe en español
      numero.textContent = valor.toFixed(1).replace('.', ',');
    }

    if (prefiereMenosMovimiento) {
      mostrarNumero(valorFinal);
    } else {
      mostrarNumero(0);
      const observadorNumero = new IntersectionObserver(function (entradas) {
        if (!entradas[0].isIntersecting) return;
        observadorNumero.disconnect();

        const duracion = 1500;
        const inicio = performance.now();

        function paso(ahora) {
          const progreso = Math.min(1, (ahora - inicio) / duracion);
          // Frena suavemente al final
          const suavizado = 1 - Math.pow(1 - progreso, 3);
          mostrarNumero(valorFinal * suavizado);
          if (progreso < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
      }, { threshold: 0.5 });
      observadorNumero.observe(numero);
    }
  }

  /* ---------- Recuadro de opiniones que va cambiando ---------- */
  const zona = document.getElementById('opinionesZona');
  const zonaPuntos = document.getElementById('opinionesPuntos');
  if (!zona || !zonaPuntos || !OPINIONES.length) return;

  // Crea todas las opiniones en el mismo sitio (una encima de otra).
  // Así el recuadro toma la altura de la más larga y no "salta".
  const tarjetas = OPINIONES.map(function (opinion, indice) {
    const tarjeta = document.createElement('figure');
    tarjeta.className = 'opiniones__tarjeta';
    tarjeta.setAttribute('aria-hidden', 'true');

    const texto = document.createElement('blockquote');
    texto.className = 'opiniones__texto';
    texto.textContent = '“' + opinion.texto + '”';

    const autora = document.createElement('figcaption');
    autora.className = 'opiniones__autora';
    autora.textContent = opinion.autora;

    tarjeta.appendChild(texto);
    tarjeta.appendChild(autora);
    zona.appendChild(tarjeta);

    const punto = document.createElement('button');
    punto.type = 'button';
    punto.className = 'opiniones__punto';
    punto.setAttribute('aria-label', 'Ver opinión ' + (indice + 1) + ' de ' + OPINIONES.length);
    punto.addEventListener('click', function () {
      mostrar(indice);
      reiniciarTemporizador();
    });
    zonaPuntos.appendChild(punto);

    return tarjeta;
  });

  const puntos = zonaPuntos.querySelectorAll('.opiniones__punto');
  let actual = 0;

  function mostrar(indice) {
    actual = indice;
    tarjetas.forEach(function (tarjeta, i) {
      const activa = i === indice;
      tarjeta.classList.toggle('esta-visible', activa);
      tarjeta.setAttribute('aria-hidden', activa ? 'false' : 'true');
    });
    puntos.forEach(function (punto, i) {
      punto.classList.toggle('esta-activo', i === indice);
    });
  }

  mostrar(0);

  // Si la persona prefiere menos movimiento, no cambian solas
  if (prefiereMenosMovimiento) return;

  let temporizador = null;
  let enPausa = false;

  function siguiente() {
    mostrar((actual + 1) % tarjetas.length);
  }

  function reiniciarTemporizador() {
    clearInterval(temporizador);
    if (!enPausa) {
      temporizador = setInterval(siguiente, SEGUNDOS_POR_OPINION * 1000);
    }
  }

  function pausar() {
    enPausa = true;
    clearInterval(temporizador);
  }

  function reanudar() {
    enPausa = false;
    reiniciarTemporizador();
  }

  // Pasar el ratón, tocar o poner el foco con el teclado pausa el cambio
  zona.addEventListener('mouseenter', pausar);
  zona.addEventListener('mouseleave', reanudar);
  let esperaTactil = null;
  zona.addEventListener('touchstart', function () {
    clearTimeout(esperaTactil);
    pausar();
  }, { passive: true });
  zona.addEventListener('touchend', function () {
    // Tras soltar el dedo, deja unos segundos más antes de seguir
    esperaTactil = setTimeout(reanudar, 3000);
  });
  zona.addEventListener('focusin', pausar);
  zona.addEventListener('focusout', reanudar);

  reiniciarTemporizador();

});
