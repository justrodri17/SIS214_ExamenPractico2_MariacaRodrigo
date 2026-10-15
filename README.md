# Portafolio interactivo — Rodrigo Mariaca

CV y portafolio personal desarrollado para el segundo examen práctico
de Tecnologías Web I (SIS-214), Universidad Católica Boliviana “San Pablo”.

## Autor

Reynaldo Rodrigo Mariaca Cutipa.

## Tecnologías

- HTML5 semántico.
- CSS3 con variables, Flexbox y CSS Grid.
- JavaScript ES6+.
- LocalStorage.
- Fetch API.
- API pública de GitHub.
- EmailJS Browser SDK v4.

## Estructura

```text
assets/
  audios/
    presentacion.mp3
  images/
    FotoPropia.jpg
    proyecto.svg
  videos/
    presentacion.mp4
css/
  animations.css
  base.css
  components.css
  layout.css
  styles.css
  variables.css
js/
  app.js
index.html
README.md
```

## Arquitectura

index.html contiene la estructura semántica y los componentes accesibles.

styles.css importa las hojas de estilos:

- variables.css: tokens de diseño y temas.
- base.css: reset, tipografía y elementos base.
- layout.css: distribución y puntos de ruptura.
- components.css: tarjetas, navegación, formularios y controles.
- animations.css: transiciones y preferencias de movimiento reducido.

app.js organiza la lógica en funciones de inicialización independientes:
tema, navegación, proyectos, GitHub y contacto.

## Funcionalidades

1. Tema claro y oscuro con persistencia mediante JSON y localStorage.
2. Menú hamburguesa para móvil y tablet con aria-expanded,
   cierre con Escape y control de foco.
3. Buscador de proyectos con datos inmutables y tubería filter().map().
4. Formulario con preventDefault(), restricciones HTML5,
   validación mediante input y envío con EmailJS.
5. Consulta REST a GitHub con Fetch, async/await, try/catch,
   response.ok, manejo de estados HTTP y estados de interfaz.

## Diseño adaptable

- Móvil: menos de 768px, estilos base.
- Tablet: desde 768px hasta 1024px.
- Escritorio: desde 1025px.

## Ejecución local

1. Clonar o descargar el repositorio.
2. Abrir la carpeta con Visual Studio Code.
3. Abrir index.html mediante Live Server.

También puede utilizarse Python:

```bash
python -m http.server 5500
```

Abrir http://localhost:5500 en el navegador.

## Configuración

En js/app.js completar:

- CONFIG.githubUser.
- CONFIG.emailjs.publicKey.
- CONFIG.emailjs.serviceId.
- CONFIG.emailjs.templateId.

La plantilla de EmailJS debe usar las variables:
from_name, reply_to, subject y message.

El correo de destino se configura directamente en la plantilla.
No se incluyen claves privadas en el código.

## Servicios externos

La consulta de repositorios requiere acceso a api.github.com.
El envío de mensajes requiere cargar el SDK y acceder a EmailJS.

Los errores de red, límites de uso y errores de configuración
se muestran en la interfaz. Un fallo de un servicio externo
no debe interrumpir el resto de las funciones.

## Accesibilidad

- Etiquetas semánticas HTML5.
- Enlace para saltar al contenido.
- Etiquetas y mensajes asociados a los campos.
- aria-expanded y aria-controls en navegación.
- Estados anunciados mediante role="status".
- Foco visible y navegación por teclado.
- Respeto de prefers-reduced-motion.

Los recursos multimedia con voz deben contar con subtítulos
o transcripciones equivalentes antes de afirmar conformidad
completa con WCAG.
