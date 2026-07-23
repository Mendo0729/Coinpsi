import { icon } from "../icons.js";
import { escapeHtml, formatEventDate } from "../utils.js";

export const EVENT_PAGE_SIZE = 2;

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

function parseEventDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  };
}

function getPanamaCalendarNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Panama",
    year: "numeric",
    month: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    year: Number(values.year),
    month: Number(values.month)
  };
}

function getEventsForMonth(events, year, month) {
  return events
    .filter((event) => {
      const date = parseEventDate(event.date);
      return date?.year === year && date?.month === month;
    })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function getInitialEventView(events) {
  const current = getPanamaCalendarNow();
  const currentYearMonths = events
    .map((event) => parseEventDate(event.date))
    .filter((date) => date?.year === current.year)
    .map((date) => date.month);

  let month = current.month;
  if (!currentYearMonths.includes(month)) {
    month = currentYearMonths
      .filter((candidate) => candidate > current.month)
      .sort((a, b) => a - b)[0]
      || [...currentYearMonths].sort((a, b) => a - b)[0]
      || current.month;
  }

  return {
    year: current.year,
    month,
    page: 1
  };
}

export function renderEventsShell() {
  return `
    <section id="eventos" class="section events-section">
      <div class="container">
        <div class="section-row-heading reveal event-section-heading">
          <div>
            <span class="eyebrow"><span></span>CALENDARIO ACADEMICO Y DE BIENESTAR</span>
            <h2>Proximos Talleres, Conferencias y Actividades</h2>
          </div>
          <div id="event-filters" class="event-calendar-controls"></div>
        </div>
        <div id="events-list" class="event-list">${renderEventsLoading()}</div>
      </div>
    </section>
  `;
}

export function renderEventFilters(events, view) {
  const container = document.getElementById("event-filters");
  if (!container || !view) return;

  const counts = new Map();
  events.forEach((event) => {
    const date = parseEventDate(event.date);
    if (date?.year !== view.year) return;
    counts.set(date.month, (counts.get(date.month) || 0) + 1);
  });

  container.innerHTML = `
    <div class="event-year-control" aria-label="Ano del calendario">
      <span>Ano</span>
      <strong>${escapeHtml(view.year)}</strong>
    </div>
    <label class="event-month-control" for="event-month-select">
      <span>Mes</span>
      <select id="event-month-select" aria-label="Seleccionar mes de eventos">
        ${MONTHS.map((monthName, index) => {
          const month = index + 1;
          const count = counts.get(month) || 0;
          const suffix = count ? ` (${count})` : "";
          return `<option value="${month}" ${month === view.month ? "selected" : ""}>${monthName}${suffix}</option>`;
        }).join("")}
      </select>
    </label>
  `;
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

function renderEventsEmpty(view) {
  const monthName = MONTHS[view.month - 1] || "el mes seleccionado";
  return `
    <div class="public-events-state">
      <span class="public-events-state-icon">${icon("Calendar")}</span>
      <div><strong>No hay eventos en ${escapeHtml(monthName)} de ${escapeHtml(view.year)}</strong><p>Selecciona otro mes para consultar las actividades publicadas.</p></div>
    </div>
  `;
}

function renderWhatsappAction(event) {
  if (!event.whatsappUrl) return "";

  return `
    <a
      class="event-whatsapp-button"
      href="${escapeHtml(event.whatsappUrl)}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp sobre ${escapeHtml(event.title)}"
      title="Contactar por WhatsApp"
    >${icon("Phone")}</a>
  `;
}

function renderPagination(page, totalPages, totalItems) {
  if (totalPages <= 1) return "";

  return `
    <nav class="public-event-pagination" aria-label="Paginacion de eventos">
      <button type="button" data-event-page="previous" ${page <= 1 ? "disabled" : ""}>Anterior</button>
      <span>Pagina ${page} de ${totalPages} · ${totalItems} eventos</span>
      <button type="button" data-event-page="next" ${page >= totalPages ? "disabled" : ""}>Siguiente</button>
    </nav>
  `;
}

export function renderEventsList(events, view) {
  const list = document.getElementById("events-list");
  if (!list || !view) return { page: 1, totalPages: 1, totalItems: 0 };

  const filtered = getEventsForMonth(events, view.year, view.month);
  const totalPages = Math.max(1, Math.ceil(filtered.length / EVENT_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(view.page) || 1), totalPages);

  if (!filtered.length) {
    list.innerHTML = renderEventsEmpty(view);
    return { page: 1, totalPages: 1, totalItems: 0 };
  }

  const start = (page - 1) * EVENT_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + EVENT_PAGE_SIZE);

  list.innerHTML = `
    ${pageItems.map((event) => {
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
            ${renderWhatsappAction(event)}
          </div>
        </article>
      `;
    }).join("")}
    ${renderPagination(page, totalPages, filtered.length)}
  `;

  return {
    page,
    totalPages,
    totalItems: filtered.length
  };
}
