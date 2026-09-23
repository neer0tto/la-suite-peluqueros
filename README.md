# La Suite Peluqueros — Web

Web de una sola página (HTML, CSS y JavaScript sin librerías) para
La Suite Peluqueros, peluquería en San Agustín del Guadalix (Madrid).
Se puede publicar tal cual en GitHub Pages: no necesita servidor.

## Archivos

```
index.html            → Todo el contenido, sección por sección (comentado)
css/styles.css        → Todos los estilos. Colores y letras al principio (:root)
js/main.js            → Menú, animaciones, fotos en fundido y formulario de reservas
js/opiniones.js       → Opiniones que van cambiando (la lista está al principio)
js/galeria.js         → Carrusel de la galería (pasa sola cada 4 segundos)
images/               → Fotos (ver IMAGENES-PENDIENTES.md)
```

## Cambios habituales

- **Textos:** abre `index.html` y busca el texto. Cada sección empieza con un
  comentario con su número y nombre (`1. MENÚ`, `2. PORTADA`...).
- **Colores:** al principio de `css/styles.css`, en `:root`.
- **Opiniones:** edita la lista `OPINIONES` al principio de `js/opiniones.js`.
- **Fotos:** sustituye el archivo por otro con el mismo nombre
  (lista completa en `IMAGENES-PENDIENTES.md`).
- **WhatsApp de reservas:** constante `NUMERO_WHATSAPP` en `js/main.js`
  y enlace `wa.me` de la sección "Visítanos" en `index.html`.

## Verla en tu ordenador

Desde esta carpeta, arranca un servidor local (por ejemplo
`python -m http.server 8080`) y abre `http://localhost:8080/`.

## Pendientes

Busca `PENDIENTE` en `index.html` y `EJEMPLO` en `js/opiniones.js`.
