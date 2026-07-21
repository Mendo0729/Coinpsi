import { icon } from "../icons.js";
import { escapeHtml, formatEventDate } from "../utils.js";

function normalizeFilter(value) {
  return String(value || "evento")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "evento";
}

export function renderEventsShell() {
  return `
    <section id="eventos" class="section events-section">
      <div class="container">
        <div class="section-row-heading reveal">
          <div>
            <span class="eyebrow"><span></span>CALENDARIO ACADEMICO Y DE BIENESTAR</span>
            <h2>Proximos Talleres, Conferencias y Actividades</h2>
          </div>
          <div id="event-filters" class="filter-tabs event-filters"></div>
        </div>
        <div id="events-list" class="event-list">${renderEventsLoading()}</div>
      </div>
    </section>
  `;
}

export function renderEventFilters(events) {
  const container = document.getElementById("event-filters");
  if (!container) return;

  const filters = new Map();
  events.forEach((event) => {
    filters.set(normalizeFilter(event.type), event.type || "Evento");
  });

  container.innerHTML = [
    '<button class="active" data-event-filter="todos">Ver todos</button>',
    ...Array.from(filters, ([key, label]) => (
      `<button data-event-filter="${escapeHtml(key)}">${escapeHtml(label)}</button>`
    ))
  ].join("");
}

export function renderEventsLoading() {
  return `
    <div class="public-events-state" role="status">
      <span class="public-events-spinner" aria-hidden="true"></span>
      <div><strong>Cargando eventos</strong><p>Consultando las actividades publicadas por COINPSI.</p></div>
    </div>
  `;
}

export function renderEventsError(message) {
  const list = document.getElementById("events-list");
  if (!list) return;

  list.innerHTML = `
    <div class="public-events-state public-events-error" role="alert">
      <span class="public-events-state-icon">!</span>
      <div><strong>No fue posible cargar los eventos</strong><p>${escapeHtml(message)}</p></div>
    </div>
  `;
}

function renderEventsEmpty() {
  return `
    <div class="public-events-state">
      <span class="public-events-state-icon">${icon("Calendar")}</span>
      <div><strong>No hay eventos publicados</strong><p>Las proximas actividades apareceran aqui cuando sean publicadas.</p></div>
    </div>
  `;
}

export function renderEventsList(events, filter = "todos") {
  const list = document.getElementById("events-list");
  if (!list) return;

  const filtered = filter === "todos"
    ? events
    : events.filter((event) => normalizeFilter(event.type) === filter);

  if (!filtered.length) {
    list.innerHTML = renderEventsEmpty();
    return;
  }

  list.innerHTML = filtered.map((event) => {
    const date = formatEventDate(event.date);
    const id = escapeHtml(event.id);

    return `
      <article id="event-row-${id}" class="event-row reveal">
        <div class="date-stamp"><strong>${escapeHtml(date.month)}</strong><span>${escapeHtml(date.day)}</span><small>${escapeHtml(event.type)}</small></div>
        <div class="event-info">
          <span>${escapeHtml(event.tagline)}</span>
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.description)}</p>
          <div class="event-meta">
            <span>${icon("Clock")}${escapeHtml(event.time)}</span>
            <span>${icon("MapPin")}${escapeHtml(event.location)}</span>
            <span>${icon("Users")}${escapeHtml(event.capacity)}</span>
          </div>
        </div>
        <div class="event-action">
          <button id="btn-rsvp-event-${id}" class="btn btn-dark event-rsvp" data-event-id="${id}"><span>Ver detalles y reservar</span>${icon("ChevronRight")}</button>
        </div>
      </article>
    `;
  }).join("");
}

export function eventFormTemplate(event) {
  const date = formatEventDate(event.date);
  return `
    <div id="event-rsvp-modal" class="modal-shell scrollable">
      <button class="modal-backdrop" data-close-modal aria-label="Cerrar"></button>
      <article class="modal-card event-modal fade-in-up">
        <button class="icon-button floating-close" data-close-modal>${icon("X")}</button>
        <div class="rsvp-form-stage">
          <span class="type-pill">${escapeHtml(event.type)}</span>
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.tagline)}</p>
          <div class="event-modal-meta">
            <span>${icon("Calendar")}${escapeHtml(date.fullDate)}</span>
            <span>${icon("Clock")}${escapeHtml(event.time)}</span>
            <span>${icon("MapPin")}${escapeHtml(event.location)}</span>
          </div>
          <form id="rsvp-form" data-event-id="${escapeHtml(event.id)}">
            <label>Nombre completo<input name="fullName" type="text" required placeholder="Ej. Andrea Gomez" /></label>
            <label>Correo de contacto<input name="email" type="email" required placeholder="ejemplo@organizacion.com" /></label>
            <button class="btn btn-primary form-submit" type="submit"><span>Registrar inscripcion</span>${icon("ArrowRight")}</button>
          </form>
        </div>
      </article>
    </div>
  `;
}

export function showRsvpConfirmation(event, fullName, email, ticket) {
  const card = document.querySelector("#event-rsvp-modal .event-modal");
  const date = formatEventDate(event.date);
  if (!card) return;

  card.innerHTML = `
    <button class="icon-button floating-close" data-close-modal>${icon("X")}</button>
    <div class="ticket-stage fade-in">
      <span class="success-icon">${icon("CheckCircle2")}</span>
      <h3>Asistencia confirmada</h3>
      <p>Gracias, <strong>${escapeHtml(fullName)}</strong>. El registro fue asociado al correo <strong>${escapeHtml(email)}</strong>.</p>
      <div class="ticket-card">
        <small>Pase virtual oficial</small>
        <h4>${escapeHtml(event.title)}</h4>
        <div>
          <span><small>Boleto</small><strong>${escapeHtml(ticket)}</strong></span>
          <span><small>Lugar</small><strong>${escapeHtml(event.location.split(" & ")[0])}</strong></span>
          <span><small>Fecha</small><strong>${escapeHtml(date.fullDate)}</strong></span>
          <span><small>Hora</small><strong>${escapeHtml(event.time.split(" - ")[0])}</strong></span>
        </div>
      </div>
      <button class="btn btn-dark full" data-close-modal>Entendido</button>
    </div>
  `;
}
