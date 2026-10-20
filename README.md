# Sexualidad & Tecnología

Experiencia educativa de divulgación científica, histórica y tecnológica, construida **solo con HTML5, CSS3 y JavaScript vanilla**. Sin frameworks, sin bundlers, sin dependencias ni compilación: se abre directamente en el navegador.

---

## 1. Cómo usarla

1. Abre `index.html` con doble clic (funciona con `file://`).
2. O sirve la carpeta con cualquier servidor estático:
   ```bash
   npx serve .        # o
   python3 -m http.server 8000
   ```
3. Navega con el menú superior, con las secciones marcadas en el índice o con el botón «Cuestionario».

Requisitos: cualquier navegador moderno (Chrome/Edge 90+, Firefox 90+, Safari 14+). No requiere conexión una vez cargada: todo el contenido y los recursos son locales.

---

## 2. Estructura del proyecto

```
susi/
├── index.html            # Único documento: secciones A–J + bibliografía
├── css/
│   └── styles.css        # Diseño, responsive, accesibilidad y modo impresión
├── js/
│   └── main.js           # Toda la interacción (10 módulos, sin dependencias)
├── assets/
│   ├── images/           # 10 ilustraciones SVG originales
│   └── fotos/            # 14 fotografías reales con licencia libre (CC0/CC BY/CC BY-SA)
└── README.md
```

### Contenido del `index.html`

| Sección | id | Contenido |
|---|---|---|
| Hero | `#inicio` | Portada, cifras y accesos rápidos |
| A/B | `#antiguedad` | Prehistoria → antigüedad: cronología interactiva de 6 nodos |
| C | `#reproduccion` | Comparador de 8 temas: «entonces» vs «ahora» |
| D | `#era-digital` | 6 tarjetas expandibles de la vida digital |
| E | `#pornografia` | Historia, industria y psicología + módulo de 8 mitos |
| F | `#proteccion` | Prevención e protección de menores (enfoque estrictamente preventivo) |
| G | `#legal` | Conceptos jurídicos, tabla de canales oficiales de Colombia y normativa |
| H | `#salud` | Anticoncepción, ITS, vacunas y límites de la automatización |
| I | `#futuro` | Tarjetas etiquetadas: avance real, hipótesis y dilemas éticos |
| J | `#conclusion` | Conclusión + cuestionario de 10 preguntas con corrección y explicación |
| — | `#bibliografia` | Fuentes citadas (OMS, UNESCO, OPS, entidades oficiales) |

---

## 3. Interacciones implementadas (`js/main.js`)

- Navegación fija con menú móvil, desplazamiento suave con *offset* y barra de progreso de lectura.
- Botón «volver arriba» y resaltado de la sección visible (*scrollspy*).
- Cronología con teclado, comparador entonces/ahora, tarjetas y acordeones expandibles, módulo de mitos con fuente oculta.
- Cuestionario: 10 preguntas, puntuación, explicación de cada respuesta y recomendación de repaso. **Todo el proceso ocurre en el navegador: no se guarda ni se envía nada.**
- Revelado de bloques al hacer *scroll* con **fallback** si `IntersectionObserver` no está disponible, y gestión de fallos de imagen.

---

## 4. Accesibilidad

- HTML semántico (`header`, `nav`, `main`, `section`, `footer`), jerarquía de encabezados correcta y texto legible con contraste alto.
- Navegación completa por teclado: cronología, acordeones y cuestionario son operables sin ratón.
- Estados de foco visibles, etiquetas ARIA en controles dinámicos y `alt` descriptivo en todas las ilustraciones.
- `@media (prefers-reduced-motion: reduce)` desactiva animaciones; existe además modo impresión.
- **Sin JavaScript** el contenido sigue siendo legible: un bloque `<noscript>` en la cabeza muestra las fuentes de los módulos interactivos, hace visibles los bloques ocultos y revela los acordeones.
- Responsive en los puntos de corte 1360 / 1140 / 980 / 760 / 380 px.

---

## 5. Privacidad y alcance

- **Sin publicidad, sin rastreo, sin analítica y sin recogida de datos personales.**
- Sin cookies, sin almacenamiento local y sin peticiones a servicios externos: ningún CDN, fuente remota ni API.
- Contenido con fines educativos: **no sustituye** la atención médica, psicológica ni jurídica profesional.
- La sección de protección de menores es preventiva: no contiene imágenes de menores, representaciones gráficas del abuso ni enlaces a material ilegal.
- Los canales y normas indicados corresponden a **Colombia**; varían entre países y deben verificarse en las fuentes oficiales.

---

## 6. Fuentes principales

- OMS: datos de mortalidad materna (287.000 muertes en 2020; razón 223 por 100.000) y hojas informativas de salud sexual y reproductiva.
- UNFPA y OPS/OMS: informes de mortalidad materna (446.000 en 2000; razón 545 en África subsahariana; meta ODS 3.1 < 70 en 2030).
- UNESCO: *International Technical Guidance on Sexuality Education* (2018) — la evidencia no muestra que la educación sexual aumente la actividad sexual.
- Colombia: Fiscalía (`sicecon.fiscalia.gov.co/denuncia/ingresoPrincipal`, línea 122, 018000 919 748), ICBF Línea 141 y 018000 91 80 80, Policía 123 y `caivirtual.policia.gov.co`, Te Protejo (`teprotejo.org`), Línea 155, Superintendencia de Industria y Comercio.
- Normativa: Leyes 1620/2013 (ciberacoso escolar), 1257/2008, 1273/2009, 1581/2012, 599/2000 y sentencias de la Corte Constitucional (T-339/22).

### Créditos de fotografías (`assets/images/fotos/`)

Todas con licencia libre (CC0, CC BY o CC BY-SA) y alojadas localmente; el autor y la licencia aparecen también en el pie de cada imagen en la página.

| Imagen | Autor | Licencia | Fuente |
|---|---|---|---|
| Venus de Willendorf | archeoseby | CC BY 2.0 | flickr.com/photos/7896611@N07/2945898157 |
| Papiro Libro de los Muertos | Gary Lee Todd | CC0 | flickr.com/photos/101561334@N08/28671180651 |
| Cerámica griega (Museo Británico) | nikoretro | CC BY-SA 2.0 | flickr.com/photos/22768390@N00/167742226 |
| Manuscrito medieval | CollectibleBooks | CC BY 2.0 | flickr.com/photos/118809695@N05/23723227270 |
| Lámina anatómica (1898) | rawpixel | CC BY | flickr.com/photos/153584064@N07/43332101252 |
| Preservativo con manual de 1813 | MatthiasKabel | CC BY-SA 3.0 | commons.wikimedia.org · File:Condom with manual from 1813.jpg |
| Aplicaciones de citas | Scribbler.com Images | CC BY 2.0 | flickr.com/photos/193667744@N08/51352283326 |
| Redes sociales en el móvil | Semtrio | CC BY | flickr.com/photos/163837264@N07/30141407018 |
| Cinta VHS | Toby Hudson | CC BY-SA 2.5 | commons.wikimedia.org · File:VHS cassette tape 05.JPG |
| Candados | Horia Varlan | CC BY 2.0 | flickr.com/photos/10361931@N06/4268291295 |
| Mazo judicial | weiss_paarz_photos | CC BY-SA 2.0 | flickr.com/photos/141290938@N03/26682691294 |
| Investigación de vacunas | Japanexperterna.se | CC BY 2.0 | commons.wikimedia.org · File:Japanese female scientist… |
| Realidad virtual | david.lohner | CC0 | flickr.com/photos/171116975@N07/46835000225 |
| Robonauta (NASA) | NASA Robonaut | CC BY 2.0 | flickr.com/photos/50180177@N07/6795540116 |

---

## 7. Cómo mantenerla

1. **Editar texto**: todo el contenido vive en `index.html`; busca el `id` de la sección en la tabla anterior.
2. **Editar estilos**: variables de color y tipografía en `:root` (línea inicial de `css/styles.css`); componentes numerados por secciones comentadas.
3. **Editar interacción**: `js/main.js` está dividido en módulos autónomos (`initNav`, `initCompare`, `initQuiz`…); cada uno se registra en la inicialización al final del archivo y tolera la ausencia de su sección.
4. **Añadir ilustraciones**: crea un SVG `viewBox="0 0 800 500"` en `assets/images/`. Las figuras usan `object-fit: cover`; si la figura es `.figure--tall` (4/5) el recorte deja visible solo la franja central `x ∈ [200, 600]`: sitúa los textos dentro de esa zona.
5. **Verificación recomendada tras cada cambio**
   - Sintaxis JS: `node --check js/main.js` (o cualquier *checker* equivalente).
   - Etiquetas HTML: comprobar que no quedan etiquetas sin cerrar.
   - SVG: abrirlos o validarlos como XML.
   - Revisión visual por tamaños 1440 / 1200 / 768 / 390 px.

---

*Proyecto estático, portátil y auditable: no hay pasos de instalación ni build.*
