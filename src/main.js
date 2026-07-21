import { COINPSI_DATA } from "./data.js";
import { renderHeader, initHeader } from "./components/header.js";
import { renderHero } from "./components/hero.js";
import { renderAbout, initAbout } from "./components/about.js";
import { renderServices, openServiceModal } from "./components/services.js";
import { renderTomateUnBreak, handleTomateUnBreakClick } from "./components/tomateUnBreak.js";
import {
  renderEventFilters,
  renderEventsError,
  renderEventsShell,
  renderEventsList,
  eventFormTemplate,
  showRsvpConfirmation
} from "./components/events.js";
import { renderGalleryShell, renderGalleryGrid, lightboxTemplate } from "./components/gallery.js";
import { renderAllies } from "./components/allies.js";
import { renderContact, initContact, handleContactSubmit } from "./components/contact.js";
import { renderFooter, initFooter } from "./components/footer.js";
import { getPublishedEvents } from "./services/event.service.js";

const { services, galleryItems, allies } = COINPSI_DATA;
let events = [];

function renderApp() {
  document.getElementById("app").innerHTML = `
    ${renderHeader()}
    <main>
      ${renderHero()}
      ${renderAbout()}
      ${renderServices(services)}
      ${renderTomateUnBreak()}
      ${renderEventsShell()}
      ${renderGalleryShell()}
      ${renderAllies(allies)}
      ${renderContact(services)}
    </main>
    ${renderFooter()}
    <div id="modal-root"></div>
  `;
}

async function loadPublishedEvents() {
  try {
    events = await getPublishedEvents();
    renderEventFilters(events);
    renderEventsList(events);
    observeReveal();
  } catch (error) {
    events = [];
    renderEventFilters(events);
    renderEventsError(error.message || "No fue posible cargar los eventos.");
  }
}

async function initApp() {
  initHeader();
  initAbout();
  initFooter();
  initContact();

  renderGalleryGrid(galleryItems);

  initGlobalClickHandlers();
  initFormHandlers();
  observeReveal();

  await loadPublishedEvents();
}

function initGlobalClickHandlers() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) {
      closeModal();
      return;
    }

    if (handleTomateUnBreakClick(event.target)) return;

    const serviceBtn = event.target.closest(".service-info-btn");
    if (serviceBtn) {
      const service = services.find((item) => item.id === serviceBtn.dataset.serviceId);
      if (service) openModal(openServiceModal(service));
      return;
    }

    const rsvpBtn = event.target.closest(".event-rsvp");
    if (rsvpBtn) {
      const selectedEvent = events.find((item) => item.id === rsvpBtn.dataset.eventId);
      if (selectedEvent) openModal(eventFormTemplate(selectedEvent));
      return;
    }

    const galleryCard = event.target.closest(".gallery-card");
    if (galleryCard) {
      const item = galleryItems.find((entry) => entry.id === galleryCard.dataset.galleryId);
      if (item) openModal(lightboxTemplate(item));
      return;
    }

    const eventFilter = event.target.closest("[data-event-filter]");
    if (eventFilter) {
      document.querySelectorAll("[data-event-filter]").forEach((btn) => btn.classList.remove("active"));
      eventFilter.classList.add("active");
      renderEventsList(events, eventFilter.dataset.eventFilter);
      observeReveal();
      return;
    }

    const galleryFilter = event.target.closest("[data-gallery-filter]");
    if (galleryFilter) {
      document.querySelectorAll("[data-gallery-filter]").forEach((btn) => btn.classList.remove("active"));
      galleryFilter.classList.add("active");
      renderGalleryGrid(galleryItems, galleryFilter.dataset.galleryFilter);
      observeReveal();
    }
  });
}

function initFormHandlers() {
  document.addEventListener("submit", (event) => {
    if (event.target.id === "rsvp-form") handleRsvpSubmit(event);
    if (event.target.id === "contact-form") handleContactSubmit(event);
  });
}

function handleRsvpSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const selectedEvent = events.find((item) => item.id === form.dataset.eventId);
  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  if (!selectedEvent || !fullName || !email) return;

  const button = form.querySelector("button");
  button.innerHTML = '<span class="spinner"></span>';
  button.disabled = true;

  setTimeout(() => {
    const ticket = `COINPSI-${Math.floor(100000 + Math.random() * 900000)}`;
    const registrations = JSON.parse(localStorage.getItem("coinpsi_event_registrations") || "[]");
    registrations.push({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      fullName,
      email,
      ticket,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("coinpsi_event_registrations", JSON.stringify(registrations));
    showRsvpConfirmation(selectedEvent, fullName, email, ticket);
  }, 1200);
}

function openModal(html) {
  document.getElementById("modal-root").innerHTML = html;
  document.body.classList.add("modal-open");
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
  document.body.classList.remove("modal-open");
}

function observeReveal() {
  const items = document.querySelectorAll(".reveal:not(.revealed)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  items.forEach((item) => observer.observe(item));
}

renderApp();
initApp();
