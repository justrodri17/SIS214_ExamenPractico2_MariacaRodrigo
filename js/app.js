"use strict";

/*
 * CONFIGURACIÓN PERSONAL
 * Usa únicamente la Public Key de EmailJS.
 * Nunca coloques una Private Key en este archivo.
 */
const CONFIG = Object.freeze({
  githubUser: "justrodri17",

  emailjs: Object.freeze({
    publicKey: "703VUSsqboj1KTVVp",
    serviceId: "service_7k7es66",
    templateId: "template_enzbr2v",
  }),
});

/*
 * Datos originales inmutables.
 * El buscador genera nuevas colecciones sin modificar este arreglo.
 */
const PROJECTS = Object.freeze([
  Object.freeze({
    title: "Portafolio Nativo",
    category: "Desarrollo web",
    description:
      "CV interactivo con diseño adaptable, temas, formulario de contacto y consumo de una API REST.",
    technologies: Object.freeze(["HTML5", "CSS3", "JavaScript"]),
  }),

  Object.freeze({
    title: "SaludDigital",
    category: "Arquitectura de datos",
    description:
      "Modelado relacional de expedientes médicos y normalización de la información hasta la tercera forma normal.",
    technologies: Object.freeze(["SQL", "PostgreSQL", "Modelado de datos"]),
  }),

  Object.freeze({
    title: "RouteMaster",
    category: "Lógica de software",
    description:
      "Diseño de clases y algoritmos para organizar un sistema de transporte universitario.",
    technologies: Object.freeze(["Java", "POO", "Algoritmos"]),
  }),
]);

const select = (selector) => document.querySelector(selector);

/* Crea nodos sin interpretar datos externos como código HTML. */
function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function setFeedback(element, state, message) {
  element.dataset.state = state;
  element.textContent = message;
}

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* =====================================================
   1. TEMA: DOM + JSON + LOCALSTORAGE
   ===================================================== */

function initTheme() {
  const button = select("#theme-button");
  const icon = select("#theme-icon");
  const themeMeta = select('meta[name="theme-color"]');
  const storageKey = "rodrigo-portfolio-theme";

  let initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));

    if (saved && ["light", "dark"].includes(saved.theme)) {
      initialTheme = saved.theme;
    }
  } catch {
    /*
     * Un almacenamiento bloqueado o un JSON inválido
     * no debe impedir el funcionamiento del sitio.
     */
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.dataset.theme = theme;
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute(
      "aria-label",
      isDark ? "Activar modo claro" : "Activar modo oscuro",
    );

    button.title = isDark ? "Activar modo claro" : "Activar modo oscuro";
    icon.textContent = isDark ? "☀" : "☾";

    themeMeta.content = isDark ? "#0d1320" : "#f5f7fc";
  }

  applyTheme(initialTheme);

  button.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
      localStorage.setItem(storageKey, JSON.stringify({ theme: nextTheme }));
    } catch {
      /* El cambio visual sigue funcionando sin persistencia. */
    }
  });
}

/* =====================================================
   2. MENÚ HAMBURGUESA + ARIA + TECLADO
   ===================================================== */

function initNavigation() {
  const button = select("#menu-button");
  const navigation = select("#main-navigation");
  const desktopQuery = window.matchMedia("(min-width: 1025px)");

  const links = [...navigation.querySelectorAll("a")];

  /*
   * Solo selecciona las secciones principales.
   * No afecta artículos ni otros elementos internos.
   */
  const sections = [
    select("#inicio"),
    ...document.querySelectorAll(".content-layout > section"),
  ];

  const contentLayout = select(".content-layout");

  function setMenu(open, restoreFocus = false) {
    const shouldOpen = open && !desktopQuery.matches;

    navigation.classList.toggle("is-open", shouldOpen);

    button.setAttribute("aria-expanded", String(shouldOpen));

    button.setAttribute(
      "aria-label",
      shouldOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación",
    );

    navigation.inert = !desktopQuery.matches && !shouldOpen;

    if (restoreFocus) {
      button.focus();
    }
  }

  function showSection(hash, moveFocus = false) {
    /*
     * Busca únicamente entre las secciones conocidas.
     * Si la dirección no existe, muestra el inicio.
     */
    const target =
      sections.find((section) => `#${section.id}` === hash) ||
      select("#inicio");

    sections.forEach((section) => {
      section.hidden = section !== target;
    });

    /*
     * En el inicio se oculta también el contenedor
     * de las demás secciones.
     */
    contentLayout.hidden = target.id === "inicio";

    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${target.id}`;

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (moveFocus) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }

    setMenu(false);

    if (moveFocus) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    setMenu(!isOpen);
  });

  /*
   * Captura los enlaces internos de toda la página:
   * menú, logotipo, botones del inicio y volver arriba.
   */
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");

    if (!link) {
      return;
    }

    /*
     * Respeta los clics modificados para abrir enlaces
     * en otra pestaña.
     */
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const hash = link.getAttribute("href");

    const isSectionLink = sections.some((section) => `#${section.id}` === hash);

    if (!isSectionLink) {
      return;
    }

    event.preventDefault();

    if (window.location.hash !== hash) {
      history.pushState(null, "", hash);
    }

    showSection(hash, true);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      button.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    const clickedOutside =
      !navigation.contains(event.target) && !button.contains(event.target);

    if (clickedOutside) {
      const focusInside = navigation.contains(document.activeElement);

      setMenu(false, focusInside);
    }
  });

  desktopQuery.addEventListener("change", () => {
    const focusWillBeHidden =
      !desktopQuery.matches && navigation.contains(document.activeElement);

    setMenu(false, focusWillBeHidden);
  });

  /*
   * Permite usar Atrás / Adelante del navegador
   * y abrir directamente una sección mediante su URL.
   */
  window.addEventListener("popstate", () => {
    showSection(window.location.hash || "#inicio", true);
  });

  window.addEventListener("hashchange", () => {
    showSection(window.location.hash || "#inicio", true);
  });

  setMenu(false);
  showSection(window.location.hash || "#inicio");
}

/* =====================================================
   3. FILTRO INMUTABLE: .filter().map()
   ===================================================== */

function createProjectCard(project) {
  const article = createElement("article", "small-card");

  article.append(
    createElement("p", "item-meta", project.category),
    createElement("h3", "", project.title),
    createElement("p", "", project.description),
  );

  const tags = createElement("div", "tag-list");

  project.technologies.forEach((technology) => {
    tags.append(createElement("span", "tag", technology));
  });

  article.append(tags);

  return article;
}

function initProjects() {
  const search = select("#project-search");
  const list = select("#project-list");
  const count = select("#project-count");

  function renderProjects() {
    const query = normalizeText(search.value);

    /*
     * Tubería funcional exigida por la rúbrica:
     * filter crea una colección nueva y map crea los nodos.
     */
    const cards = PROJECTS.filter((project) => {
      const searchableText = [
        project.title,
        project.category,
        project.description,
        ...project.technologies,
      ].join(" ");

      return normalizeText(searchableText).includes(query);
    }).map((project) => createProjectCard(project));

    list.replaceChildren(...cards);

    count.textContent = `${cards.length} de ${PROJECTS.length} proyectos encontrados.`;

    if (cards.length === 0) {
      list.append(
        createElement(
          "p",
          "empty-state",
          "No hay coincidencias. Prueba con otra tecnología o nombre.",
        ),
      );
    }
  }

  search.addEventListener("input", renderProjects);
  renderProjects();
}

/* =====================================================
   4. API REST: FETCH + ASYNC/AWAIT + ESTADOS
   ===================================================== */

function getGithubError(status) {
  switch (status) {
    case 400:
      return "La solicitud a GitHub no es válida (HTTP 400).";
    case 401:
      return "GitHub rechazó la autorización (HTTP 401).";
    case 403:
      return "GitHub bloqueó la solicitud o se alcanzó el límite de consultas (HTTP 403).";
    case 404:
      return "No se encontró el usuario de GitHub (HTTP 404).";
    case 429:
      return "Demasiadas consultas. Intenta nuevamente más tarde (HTTP 429).";
    default:
      return status >= 500
        ? `GitHub presenta un problema temporal (HTTP ${status}).`
        : `No se pudo completar la consulta (HTTP ${status}).`;
  }
}

function createRepositoryCard(repository) {
  const article = createElement("article", "small-card");

  article.append(
    createElement(
      "p",
      "item-meta",
      repository.language || "Sin lenguaje principal",
    ),
    createElement("h3", "", repository.name),
    createElement(
      "p",
      "",
      repository.description || "Este repositorio no tiene descripción.",
    ),
  );

  const metadata = createElement(
    "p",
    "item-meta",
    `★ ${repository.stargazers_count} · Forks: ${repository.forks_count}`,
  );

  const link = createElement("a", "repository-link", "Ver repositorio ↗");

  /*
   * Construye la dirección usando el dominio esperado,
   * sin insertar HTML recibido desde la API.
   */
  link.href =
    `https://github.com/${encodeURIComponent(CONFIG.githubUser)}/` +
    encodeURIComponent(repository.name);

  link.target = "_blank";
  link.rel = "noopener noreferrer";

  article.append(metadata, link);

  return article;
}

function initGithub() {
  const button = select("#github-button");
  const status = select("#github-status");
  const list = select("#github-list");

  button.addEventListener("click", async () => {
    const username = CONFIG.githubUser.trim();

    if (!username || username === "TU_USUARIO_GITHUB") {
      setFeedback(
        status,
        "error",
        "Falta configurar tu usuario de GitHub en js/app.js.",
      );
      return;
    }

    button.disabled = true;
    button.textContent = "Consultando…";
    list.setAttribute("aria-busy", "true");
    list.replaceChildren();

    setFeedback(status, "loading", "Cargando repositorios públicos…");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const endpoint =
        `https://api.github.com/users/${encodeURIComponent(username)}` +
        "/repos?sort=updated&per_page=6&type=owner";

      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(getGithubError(response.status));
      }

      const repositories = await response.json();

      if (!Array.isArray(repositories)) {
        throw new Error("GitHub devolvió un formato de datos inesperado.");
      }

      const cards = repositories.map(createRepositoryCard);
      list.replaceChildren(...cards);

      setFeedback(
        status,
        "success",
        cards.length > 0
          ? `${cards.length} repositorios cargados correctamente.`
          : "La consulta fue correcta, pero este usuario no tiene repositorios públicos.",
      );
    } catch (error) {
      let message = error.message;

      if (error.name === "AbortError") {
        message = "La consulta tardó demasiado. Intenta nuevamente.";
      } else if (error instanceof TypeError) {
        message = "No se pudo conectar con GitHub. Revisa tu conexión.";
      }

      setFeedback(status, "error", message);
    } finally {
      window.clearTimeout(timeout);
      button.disabled = false;
      button.textContent = "Actualizar repositorios ↗";
      list.setAttribute("aria-busy", "false");
    }
  });
}

/* =====================================================
   5. FORMULARIO + VALIDACIÓN NATIVA + EMAILJS
   ===================================================== */

function initContact() {
  const form = select("#contact-form");
  const fieldset = select("#contact-fields");
  const button = select("#send-button");
  const status = select("#form-status");

  const fields = [
    select("#name"),
    select("#email"),
    select("#subject"),
    select("#message"),
  ];

  let sending = false;

  function validateField(field) {
    /*
     * Combina las restricciones nativas con una comprobación
     * de longitud real que descarta espacios vacíos.
     */
    field.setCustomValidity("");

    const trimmedValue = field.value.trim();
    const minimumLength = field.minLength;

    if (!trimmedValue) {
      field.setCustomValidity("Completa este campo.");
    } else if (minimumLength > 0 && trimmedValue.length < minimumLength) {
      field.setCustomValidity(
        `Escribe al menos ${minimumLength} caracteres, sin contar espacios al inicio o final.`,
      );
    }

    const valid = field.checkValidity();
    const message = select(`#${field.id}-error`);

    field.setAttribute("aria-invalid", String(!valid));
    message.classList.toggle("is-valid", valid);

    if (valid) {
      message.textContent = "Correcto.";
    } else if (field.validity.typeMismatch) {
      message.textContent =
        "Escribe un correo válido, por ejemplo: nombre@correo.com.";
    } else {
      message.textContent = field.validationMessage;
    }

    return valid;
  }

  /* Delegación: validación en tiempo real mediante input. */
  form.addEventListener("input", (event) => {
    if (fields.includes(event.target)) {
      validateField(event.target);

      if (status.dataset.state !== "loading") {
        setFeedback(status, "idle", "");
      }
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (sending) {
      return;
    }

    /*
     * map garantiza que se validen todos los campos.
     * every evalúa después el resultado completo.
     */
    const results = fields.map(validateField);
    const allValid = results.every((result) => result);

    if (!allValid) {
      setFeedback(
        status,
        "error",
        "Revisa los campos indicados antes de enviar.",
      );

      fields.find((field) => !field.validity.valid).focus();
      return;
    }

    const emailConfig = CONFIG.emailjs;
    const configured = [
      emailConfig.publicKey,
      emailConfig.serviceId,
      emailConfig.templateId,
    ].every((value) => value.trim() && !value.startsWith("TU_"));

    if (!configured) {
      setFeedback(
        status,
        "error",
        "Falta configurar Public Key, Service ID y Template ID de EmailJS en js/app.js.",
      );
      return;
    }

    if (!window.emailjs) {
      setFeedback(
        status,
        "error",
        "No se cargó EmailJS. Revisa la conexión y vuelve a cargar la página.",
      );
      return;
    }

    sending = true;
    fieldset.disabled = true;
    form.setAttribute("aria-busy", "true");
    button.textContent = "Enviando…";

    setFeedback(status, "loading", "Enviando tu mensaje…");

    try {
      const parameters = {
        from_name: select("#name").value.trim(),
        reply_to: select("#email").value.trim(),
        subject: select("#subject").value.trim(),
        message: select("#message").value.trim(),
      };

      const response = await window.emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        parameters,
        {
          publicKey: emailConfig.publicKey,
        },
      );

      if (response.status !== 200) {
        throw new Error("El servicio no confirmó el envío.");
      }

      form.reset();

      fields.forEach((field) => {
        field.setCustomValidity("");
        field.removeAttribute("aria-invalid");

        const message = select(`#${field.id}-error`);
        message.textContent = "";
        message.classList.remove("is-valid");
      });

      setFeedback(
        status,
        "success",
        "¡Mensaje enviado correctamente! Gracias por escribirme.",
      );
    } catch (error) {
      const code = Number(error.status);

      let message =
        "No se pudo enviar el mensaje. Tus datos siguen en el formulario para que puedas reintentarlo.";

      if (code === 429) {
        message = "Se alcanzó el límite de envíos. Intenta más tarde.";
      } else if ([400, 401, 403, 404].includes(code)) {
        message =
          "EmailJS rechazó la solicitud. Revisa el servicio, la plantilla, la Public Key y los dominios permitidos.";
      }

      setFeedback(status, "error", message);
    } finally {
      sending = false;
      fieldset.disabled = false;
      form.setAttribute("aria-busy", "false");
      button.textContent = "Enviar mensaje ↗";
    }
  });
}

/* Los scripts defer se ejecutan después de analizar el HTML. */
initTheme();
initNavigation();
initProjects();
initGithub();
initContact();

select("#year").textContent = new Date().getFullYear();
