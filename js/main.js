/* ==========================================================
   LA SUITE PELUQUEROS — main.js
   Este archivo lleva:
   1) El menú: cabecera que cambia al hacer scroll (ordenador) y
      la píldora flotante del móvil con la sección activa.
   2) Las animaciones al hacer scroll (aparecer con fundido).
   3) El formulario de "Reservar cita" y su mensaje de WhatsApp.

   Los otros archivos (opiniones.js, galeria.js, antes-despues.js)
   llevan cada uno su propia parte, para que sea fácil encontrar
   qué tocar si quieres cambiar algo.
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================
     1) MENÚ
  ========================================================== */

  /* ---------- Cabecera de ordenador: se reduce al hacer scroll ---------- */
  const cabecera = document.getElementById('cabecera');
  if (cabecera) {
    function comprobarScrollCabecera() {
      cabecera.classList.toggle('esta-scrolleada', window.scrollY > 80);
    }
    comprobarScrollCabecera();
    window.addEventListener('scroll', comprobarScrollCabecera, { passive: true });
  }

  /* ---------- Píldora móvil: marca en dorado la sección visible ---------- */
  const enlacesPildora = document.querySelectorAll('.pildora__link[data-section]');
  if (enlacesPildora.length) {
    const secciones = Array.from(enlacesPildora)
      .map(function (enlace) { return document.getElementById(enlace.dataset.section); })
      .filter(Boolean);

    const observadorPildora = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlacesPildora.forEach(function (enlace) {
          enlace.classList.toggle('esta-activo', enlace.dataset.section === entrada.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    secciones.forEach(function (seccion) { observadorPildora.observe(seccion); });
  }

  /* ==========================================================
     2) ANIMACIONES AL HACER SCROLL
     Los elementos con el atributo "data-animar" aparecen con un
     fundido y un pequeño desplazamiento hacia arriba cuando entran
     en la pantalla. Usamos IntersectionObserver (no el evento
     "scroll") para que sea eficiente y no ralentice la web.
  ========================================================== */
  const elementosAnimados = document.querySelectorAll('[data-animar]');
  if (elementosAnimados.length) {
    const observadorAnimacion = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('esta-visible');
          observadorAnimacion.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementosAnimados.forEach(function (el) { observadorAnimacion.observe(el); });
  }

  /* ==========================================================
     3) FORMULARIO DE RESERVAS
     No hay backend (la web se aloja en GitHub Pages, que solo
     sirve archivos). Por eso el formulario arma un mensaje con
     los datos elegidos y abre WhatsApp con ese texto ya escrito:
     el negocio confirma la cita respondiendo por ahí, sin pagar
     ninguna plataforma externa de reservas.
  ========================================================== */
  const NUMERO_WHATSAPP = '34654627149'; // Número de reservas (móvil)

  const formulario = document.getElementById('formularioReserva');
  const campoFecha = document.getElementById('fecha');
  const campoFranja = document.getElementById('franja');
  const avisoDomingo = document.getElementById('avisoDomingo');

  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // Convierte "2026-10-02" en una fecha local (evita el fallo típico
  // de que new Date("2026-10-02") se interprete como UTC y cambie de día)
  function fechaLocalDesdeInput(valor) {
    const partes = valor.split('-').map(Number);
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

  function textoFechaLegible(fecha) {
    return DIAS[fecha.getDay()] + ' ' + fecha.getDate() + ' de ' + MESES[fecha.getMonth()];
  }

  // Al elegir un día: domingo bloquea el envío, sábado solo deja elegir mañana
  if (campoFecha) {
    const hoy = new Date();
    const hoyTexto = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
    campoFecha.setAttribute('min', hoyTexto);

    campoFecha.addEventListener('change', function () {
      if (!campoFecha.value) return;
      const fechaElegida = fechaLocalDesdeInput(campoFecha.value);
      const diaSemana = fechaElegida.getDay(); // 0 = domingo, 6 = sábado

      const esDomingo = diaSemana === 0;
      if (avisoDomingo) avisoDomingo.classList.toggle('esta-visible', esDomingo);
      campoFecha.setCustomValidity(esDomingo ? 'Los domingos estamos cerrados' : '');

      if (campoFranja) {
        const opcionTarde = campoFranja.querySelector('option[value="tarde"]');
        if (opcionTarde) {
          const esSabado = diaSemana === 6;
          opcionTarde.disabled = esSabado;
          if (esSabado && campoFranja.value === 'tarde') {
            campoFranja.value = 'manana';
          }
        }
      }
    });
  }

  if (formulario) {
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      if (!campoFecha.value) return;
      const fechaElegida = fechaLocalDesdeInput(campoFecha.value);
      if (fechaElegida.getDay() === 0) {
        // Domingo: no se envía, el aviso ya está visible
        return;
      }

      const nombre = formulario.nombre.value.trim();
      const servicio = formulario.servicio.options[formulario.servicio.selectedIndex].text;
      const franjaTexto = formulario.franja.options[formulario.franja.selectedIndex].dataset.texto;
      const fechaTexto = textoFechaLegible(fechaElegida);

      const mensaje =
        'Hola, soy ' + nombre + '. Me gustaría pedir cita para ' + servicio +
        ' el ' + fechaTexto + ' por la ' + franjaTexto + '. ¡Gracias!';

      const url = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(mensaje);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Los enlaces "Reservar este servicio →" bajan al formulario y
  // dejan ese servicio ya elegido en el desplegable
  document.querySelectorAll('[data-reservar-servicio]').forEach(function (enlace) {
    enlace.addEventListener('click', function (evento) {
      evento.preventDefault();
      const selectServicio = document.getElementById('servicio');
      if (selectServicio) {
        selectServicio.value = enlace.dataset.reservarServicio;
      }
      document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Año actual en el pie de página ---------- */
  const elementoAnio = document.getElementById('anio');
  if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
  }

  /* ---------- Tabla de horario: resalta el día de hoy ----------
     Cada fila lleva en "data-dias" los días de la semana que cubre
     (0 = domingo, 1 = lunes... 6 = sábado). */
  const hoyNumero = String(new Date().getDay());
  document.querySelectorAll('.visitanos__tabla tr[data-dias]').forEach(function (fila) {
    if (fila.dataset.dias.split(',').includes(hoyNumero)) {
      fila.classList.add('es-hoy');
    }
  });

});
