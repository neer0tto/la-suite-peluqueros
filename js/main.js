/* ==========================================================
   LA SUITE PELUQUEROS — main.js
   Este archivo lleva:
   1) El menú: cabecera que cambia al hacer scroll (ordenador) y
      la píldora flotante del móvil con la sección activa.
   2) Las animaciones al hacer scroll (aparecer con fundido).
   3) El formulario de "Reservar cita" y su mensaje de WhatsApp.
   4) Las fotos de la portada y de cada servicio, que se van
      fundiendo entre sí solas.
   5) La animación en cascada de los bloques de Servicios, al
      bajar y al subir.
   6) El parallax de las fotos de Servicios, solo en escritorio.

   Los otros archivos (opiniones.js, galeria.js) llevan cada uno su
   propia parte, para que sea fácil encontrar qué tocar si quieres
   cambiar algo.
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

  const botonReservaEnviar = document.querySelector('.reserva-enviar');
  const reservaConfirmacion = document.getElementById('reservaConfirmacion');

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

      // El botón se convierte en un check dorado y, justo después,
      // aparece el mensaje de confirmación. Con "reducir movimiento"
      // no hay transición: el check y el mensaje aparecen ya puestos.
      if (botonReservaEnviar) botonReservaEnviar.classList.add('esta-enviado');
      if (reservaConfirmacion) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          reservaConfirmacion.classList.add('esta-visible');
        } else {
          setTimeout(function () {
            reservaConfirmacion.classList.add('esta-visible');
          }, 350);
        }
      }
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

  /* ==========================================================
     4) FOTOS EN FUNDIDO (portada y servicios)
     Dentro de cada grupo de fotos (la portada tiene 3, cada
     servicio tiene 2) se van turnando: una visible y las demás
     ocultas, alternando la clase "esta-visible" cada cierto
     tiempo. El propio CSS se encarga del fundido suave.

     Si el usuario tiene activado "reducir movimiento", se deja
     fija la primera foto de cada grupo y no se mueve más.
  ========================================================== */
  const prefiereMenosMovimientoFotos = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function iniciarFundidoDeFotos(selectorGrupo, milisegundos) {
    document.querySelectorAll(selectorGrupo).forEach(function (grupo) {
      const fotos = grupo.querySelectorAll('img');
      if (fotos.length < 2) return;

      // La primera ya lleva "esta-visible" en el HTML; si por lo
      // que sea no la llevara, se la ponemos aquí igualmente
      fotos[0].classList.add('esta-visible');
      if (prefiereMenosMovimientoFotos) return;

      let indice = 0;
      setInterval(function () {
        fotos[indice].classList.remove('esta-visible');
        indice = (indice + 1) % fotos.length;
        fotos[indice].classList.add('esta-visible');
      }, milisegundos);
    });
  }

  iniciarFundidoDeFotos('.portada__foto', 5000);
  iniciarFundidoDeFotos('.servicio__foto', 4000);

  /* ==========================================================
     5) SERVICIOS: ANIMACIÓN EN CASCADA AL BAJAR Y AL SUBIR
     Cada uno de los 6 bloques (foto + texto) se anima por su
     cuenta al entrar en pantalla, y no solo la primera vez: se
     repite siempre, tanto bajando como subiendo. Para saber en
     qué dirección va el usuario, comparamos el scroll actual con
     el último que guardamos. Según la dirección, ponemos una
     clase distinta ("entra-bajando" o "entra-subiendo"); el CSS
     tiene una animación diferente para cada una.

     Si el usuario prefiere "reducir movimiento", no se hace nada
     aquí: el CSS ya deja los bloques fijos y visibles siempre.
  ========================================================== */
  const bloquesServicio = document.querySelectorAll('.servicio');
  if (bloquesServicio.length && !prefiereMenosMovimientoFotos) {
    let ultimoScrollY = window.scrollY;

    const observadorServicios = new IntersectionObserver(function (entradas) {
      const bajando = window.scrollY >= ultimoScrollY;
      ultimoScrollY = window.scrollY;

      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        const bloque = entrada.target;

        // Quitamos las dos clases y forzamos un "reflow" leyendo
        // offsetWidth: así, si vuelve a tocar la misma clase de
        // antes, el navegador reinicia la animación en vez de
        // ignorarla por ya estar puesta.
        bloque.classList.remove('entra-bajando', 'entra-subiendo');
        void bloque.offsetWidth;
        bloque.classList.add(bajando ? 'entra-bajando' : 'entra-subiendo');
      });
    }, { threshold: 0.2 });

    bloquesServicio.forEach(function (bloque) { observadorServicios.observe(bloque); });
  }

  /* ==========================================================
     6) SERVICIOS EN ESCRITORIO: PARALLAX EN LAS FOTOS
     Solo a partir de 900px de ancho (en móvil no se toca nada).
     Cada foto se mueve un poco más lenta que el resto de la
     página mientras se hace scroll, dando sensación de
     profundidad. El CSS hace la foto un poco más alta que su
     marco (ver ".servicio__foto-item" en el @media de 900px) para
     que ese movimiento nunca deje ver un hueco vacío en el borde;
     por si acaso, aquí también limitamos el desplazamiento a
     ±48px.
  ========================================================== */
  const consultaEscritorioServicios = window.matchMedia('(min-width: 900px)');
  const fotosServicioParaParallax = document.querySelectorAll('.servicio__foto');

  if (fotosServicioParaParallax.length && !prefiereMenosMovimientoFotos) {
    let tickeandoParallax = false;

    function actualizarParallaxServicios() {
      tickeandoParallax = false;

      fotosServicioParaParallax.forEach(function (marco) {
        const fotos = marco.querySelectorAll('.servicio__foto-item');

        if (!consultaEscritorioServicios.matches) {
          // Fuera de escritorio: nos aseguramos de no dejar
          // ningún desplazamiento puesto de una vez anterior.
          fotos.forEach(function (foto) { foto.style.transform = ''; });
          return;
        }

        const rect = marco.getBoundingClientRect();
        const centroMarco = rect.top + rect.height / 2;
        const centroPantalla = window.innerHeight / 2;
        let desplazamiento = (centroPantalla - centroMarco) * 0.1;
        desplazamiento = Math.max(-48, Math.min(48, desplazamiento));

        fotos.forEach(function (foto) {
          foto.style.transform = 'translateY(' + desplazamiento.toFixed(1) + 'px)';
        });
      });
    }

    function pedirActualizacionParallax() {
      if (tickeandoParallax) return;
      tickeandoParallax = true;
      requestAnimationFrame(actualizarParallaxServicios);
    }

    window.addEventListener('scroll', pedirActualizacionParallax, { passive: true });
    window.addEventListener('resize', pedirActualizacionParallax);
    actualizarParallaxServicios();
  }

});
