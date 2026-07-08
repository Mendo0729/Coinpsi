import { icon } from "../icons.js";
import { escapeHtml, formatEventDate } from "../utils.js";

export function renderEventsShell() {
  return `
    <section id="eventos" class="section events-section">
      <div class="container">
        <div class="section-row-heading reveal">
          <div>
            <span class="eyebrow"><span></span>CALENDARIO ACADÉMICO Y DE BIENESTAR</span>
            <h2>Próximos Talleres, Conferencias y Actividades</h2>
          </div>
          <div class="filter-tabs event-filters">
            ${["todos", "taller", "conferencia", "feria"].map((cat) => `<button class="${cat === "todos" ? "active" : ""}" data-event-filter="${cat}">${cat === "todos" ? "Ver Todos" : `${cat}s`}</button>`).join("")}
          </div>
        </div>
        <div id="events-list" class="event-list"></div>
      </div>
    </section>
  `;
}

export function renderEventsList(events, filter = "todos") {
  const list = document.getElementById("events-list");
  if (!list) return;
  const filtered = filter === "todos" ? events : events.filter((event) => event.type.toLowerCase() === filter);
  list.innerHTML = filtered.map((event) => {
    const date = formatEventDate(event.date);
    return `
      <article id="event-row-${event.id}" class="event-row reveal">
        <div class="date-stamp"><strong>${date.month}</strong><span>${date.day}</span><small>${event.type}</small></div>
        <div class="event-info">
          <span>${event.tagline}</span>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <div class="event-meta">
            <span>${icon("Clock")}${event.time}</span>
            <span>${icon("MapPin")}${event.location}</span>
            <span>${icon("Users")}${event.capacity}</span>
          </div>
        </div>
        <div class="event-action">
          <button id="btn-rsvp-event-${event.id}" class="btn btn-dark event-rsvp" data-event-id="${event.id}"><span>Ver Detalles y Reservar</span>${icon("ChevronRight")}</button>
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
          <span class="type-pill">${event.type}</span>
          <h3>${event.title}</h3>
          <p>${event.tagline}</p>
          <div class="event-modal-meta">
            <span>${icon("Calendar")}${date.fullDate}</span>
            <span>${icon("Clock")}${event.time}</span>
            <span>${icon("MapPin")}${event.location}</span>
          </div>
          <form id="rsvp-form" data-event-id="${event.id}">
            <label>Nombre Completo<input name="fullName" type="text" required placeholder="Ej. Dr. Andrés Gamarra" /></label>
            <label>Correo de Contacto<input name="email" type="email" required placeholder="ejemplo@organizacion.com" /></label>
            <button class="btn btn-primary form-submit" type="submit"><span>Registrar Inscripción</span>${icon("ArrowRight")}</button>
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
      <h3>¡Asistencia Confirmada!</h3>
      <p>Agradecemos tu interés, <strong>${escapeHtml(fullName)}</strong>. Hemos enviado las credenciales de acceso virtuales y recordatorios a <strong>${escapeHtml(email)}</strong>.</p>
      <div class="ticket-card">
        <small>Pase Virtual Oficial</small>
        <h4>${event.title}</h4>
        <div>
          <span><small>Boleto</small><strong>${ticket}</strong></span>
          <span><small>Lugar</small><strong>${event.location.split(" & ")[0]}</strong></span>
          <span><small>Fecha</small><strong>${date.fullDate}</strong></span>
          <span><small>Hora</small><strong>${event.time.split(" - ")[0]}</strong></span>
        </div>
      </div>
      <button class="btn btn-dark full" data-close-modal>Entendido</button>
    </div>
  `;
}
