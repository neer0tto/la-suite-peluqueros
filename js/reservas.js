/* ==========================================================
   LA SUITE PELUQUEROS — reservas.js
   Sistema de reservas SIN backend.

   ¿Cómo funciona?
   Al enviar el formulario, este script construye un mensaje de
   texto con los datos elegidos por el cliente (nombre, servicio,
   fecha y hora) y abre WhatsApp con ese mensaje ya escrito en el
   número del negocio (wa.me/34912905470). El cliente solo tiene
   que pulsar "Enviar" dentro de WhatsApp para confirmar su
   solicitud de cita.

   ¿Por qué este enfoque?
   Al alojarse en GitHub Pages, la web no puede tener un backend
   propio (base de datos, servidor, etc.). Usar WhatsApp como
   canal de confirmación evita depender de plataformas de terceros
   de pago (como Booksy u otros sistemas de reservas online), y
   permite que el negocio mantenga el control total de sus citas
   sin coste añadido ni configuración complicada.
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const NUMERO_WHATSAPP = '34912905470'; // Número del negocio, formato internacional sin "+"

  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nombre = form.nombre.value.trim();
    const servicio = form.servicio.value;
    const fecha = form.fecha.value;
    const hora = form.hora.value;

    // Formatea la fecha (YYYY-MM-DD) a un formato legible en español
    let fechaLegible = fecha;
    if (fecha) {
      const [anio, mes, dia] = fecha.split('-');
      fechaLegible = `${dia}/${mes}/${anio}`;
    }

    // Construye el mensaje pre-rellenado
    const mensaje =
      `Hola, La Suite Peluqueros. Quisiera pedir una cita.\n\n` +
      `Nombre: ${nombre}\n` +
      `Servicio: ${servicio}\n` +
      `Fecha preferida: ${fechaLegible}\n` +
      `Hora preferida: ${hora}\n\n` +
      `¿Podríais confirmarme disponibilidad? ¡Gracias!`;

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

    // Abre WhatsApp (web o app) en una nueva pestaña con el mensaje listo
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // No permite elegir fechas pasadas en el selector de fecha
  const inputFecha = document.getElementById('fecha');
  if (inputFecha) {
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoy);
  }

});
