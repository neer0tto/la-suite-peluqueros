# La Suite Peluqueros — Web

Sitio web estático (HTML, CSS y JavaScript vanilla) para La Suite Peluqueros,
peluquería unisex y salón de belleza en San Agustín de Guadalix, Madrid.

Listo para publicar en GitHub Pages, sin backend ni dependencias externas.

## Estructura

```
index.html          → Toda la estructura y el contenido de la página
css/style.css        → Todos los estilos (colores, tipografías, diseño responsive)
js/main.js            → Menú móvil y año del footer
js/reservas.js        → Sistema de reservas por WhatsApp (sin backend)
images/hero/           → Imagen de fondo del hero (portada)
images/servicios/      → Iconos/imágenes de servicios (si se añaden)
images/galeria/         → Fotos de la galería (local, equipo, resultados)
```

## Cómo editar lo básico

- **Textos**: abre `index.html` con cualquier editor (recomendado VS Code) y
  busca el texto que quieras cambiar. Está todo en español y comentado por
  secciones (`<!-- SOBRE NOSOTROS -->`, `<!-- SERVICIOS -->`, etc.).
- **Colores**: en `css/style.css`, al principio del archivo, están las
  variables `--color-negro`, `--color-dorado`, etc. Cambia el código de color
  ahí y se actualiza en toda la web.
- **Precios de servicios**: cada tarjeta de servicio en `index.html` tiene un
  `<span class="service-card__price">Consultar precio</span>`. Sustituye ese
  texto por el precio real cuando lo tengas.
- **Fotos**: sustituye las imágenes de `images/galeria/` por fotos reales
  manteniendo los mismos nombres de archivo (o actualiza las rutas `src` en
  `index.html` si usas otros nombres).
- **Horario**: revisado en `index.html`, sección "Ubicación y contacto". Hay
  un comentario avisando de que el horario debe confirmarse con el negocio.
- **Número de WhatsApp**: si cambia, edita la constante `NUMERO_WHATSAPP` en
  `js/reservas.js` y el enlace del botón flotante en `index.html`.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube todos estos archivos (o usa
   `git init`, `git add .`, `git commit`, `git push`).
2. En el repositorio, ve a **Settings → Pages**.
3. En "Source", selecciona la rama principal (`main`) y la carpeta raíz (`/`).
4. Guarda. GitHub te dará una URL pública (tipo
   `https://tu-usuario.github.io/nombre-repositorio/`).

## Notas pendientes

- Sustituir imágenes de stock por fotos reales del local y del equipo.
- Confirmar horario real de apertura (marcado en el código).
- Añadir precios reales de servicios cuando estén definidos.
- Sustituir testimonios de ejemplo por reseñas reales de Google.
