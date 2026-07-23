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
  renderEventsList
} from "./components/events.js";
import {
  lightboxTemplate,
  renderGalleryEmpty,
  renderGalleryError,
  renderGalleryFilters,
  renderGalleryGrid,
  renderGalleryShell
} from "./components/gallery.js";
import { renderAllies } from "./components/allies.js";
import { renderContact, initContact, handleContactSubmit } from "./components/contact.js";
import { renderFooter, initFooter } from "./components/footer.js";
import { getPublishedEvents } from "./services/event.service.js";
import { getPublishedGalleryItems } from "./services/gallery.service.js";

const { services, allies } = COINPSI_DATA;
let events = [];
let galleryItems = [];

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

async function loadPublishedGallery() {
  try {
    galleryItems = await getPublishedGalleryItems();
    renderGalleryFilters(galleryItems);

    if (galleryItems.length) {
      renderGalleryGrid(galleryItems);
      observeReveal();
    } else {
      renderGalleryEmpty();
    }
  } catch (error) {
    galleryItems = [];
    renderGalleryFilters(galleryItems);
    renderGalleryError(error.message || "No fue posible cargar la galeria.");
  }
}

async function initApp() {
  initHeader();
  initAbout();
  initFooter();
  initContact();

  initGlobalClickHandlers();
  initFormHandlers();
  observeReveal();

  await Promise.all([
    loadPublishedEvents(),
    loadPublishedGallery()
  ]);
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
    if (event.target.id === "contact-form") handleContactSubmit(event);
  });
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
