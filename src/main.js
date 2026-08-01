import { COINPSI_DATA } from "./data.js";
import { renderHeader, initHeader } from "./components/header.js";
import { renderHero } from "./components/hero.js";
import { renderAbout, initAbout } from "./components/about.js";
import { renderServices, openServiceModal } from "./components/services.js";
import { renderTomateUnBreak, handleTomateUnBreakClick } from "./components/tomateUnBreak.js";
import {
  getInitialEventView,
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
import {
  knowledgeModalTemplate,
  renderKnowledgeEmpty,
  renderKnowledgeError,
  renderKnowledgePosts,
  renderKnowledgeShell
} from "./components/knowledge.js";
import { renderAllies } from "./components/allies.js";
import { renderContact, initContact, handleContactSubmit } from "./components/contact.js";
import { renderFooter, initFooter } from "./components/footer.js";
import { getPublishedEvents } from "./services/event.service.js";
import { getPublishedGalleryItems } from "./services/gallery.service.js";
import { getPublishedKnowledgePosts } from "./services/knowledge.service.js";

const { services, allies } = COINPSI_DATA;
let events = [];
let eventView = null;
let galleryItems = [];
let knowledgePosts = [];
let knowledgePage = 1;

function renderApp() {
  document.getElementById("app").innerHTML = `
    ${renderHeader()}
    <main>
      ${renderHero()}
      ${renderAbout()}
      ${renderServices(services)}
      ${renderTomateUnBreak()}
      ${renderKnowledgeShell()}
      ${renderEventsShell()}
      ${renderGalleryShell()}
      ${renderAllies(allies)}
      ${renderContact(services)}
    </main>
    ${renderFooter()}
    <div id="modal-root"></div>
  `;
}

function renderEventCalendar() {
  if (!eventView) eventView = getInitialEventView(events);
  renderEventFilters(events, eventView);
  const pagination = renderEventsList(events, eventView);
  eventView.page = pagination.page;
  observeReveal();
}

function renderKnowledgePage() {
  const pagination = renderKnowledgePosts(knowledgePosts, knowledgePage);
  knowledgePage = pagination.page;
  observeReveal();
}

async function loadPublishedEvents() {
  try {
    events = await getPublishedEvents();
    eventView = getInitialEventView(events);
    renderEventCalendar();
  } catch (error) {
    events = [];
    eventView = getInitialEventView(events);
    renderEventFilters(events, eventView);
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

async function loadPublishedKnowledge() {
  try {
    knowledgePosts = await getPublishedKnowledgePosts();
    knowledgePage = 1;

    if (knowledgePosts.length) {
      renderKnowledgePage();
    } else {
      renderKnowledgeEmpty();
    }
  } catch (error) {
    knowledgePosts = [];
    knowledgePage = 1;
    renderKnowledgeError(error.message || "No fue posible cargar Espacio del Saber.");
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
    loadPublishedGallery(),
    loadPublishedKnowledge()
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

    const knowledgePageButton = event.target.closest("[data-knowledge-page]");
    if (knowledgePageButton) {
      knowledgePage += knowledgePageButton.dataset.knowledgePage === "next" ? 1 : -1;
      renderKnowledgePage();
      document.getElementById("espacio-del-saber")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const knowledgeButton = event.target.closest("[data-knowledge-id]");
    if (knowledgeButton) {
      const post = knowledgePosts.find((item) => item.id === knowledgeButton.dataset.knowledgeId);
      if (post) openModal(knowledgeModalTemplate(post));
      return;
    }

    const galleryCard = event.target.closest(".gallery-card");
    if (galleryCard) {
      const item = galleryItems.find((entry) => entry.id === galleryCard.dataset.galleryId);
      if (item) openModal(lightboxTemplate(item));
      return;
    }

    const eventPageButton = event.target.closest("[data-event-page]");
    if (eventPageButton && eventView) {
      const direction = eventPageButton.dataset.eventPage;
      eventView.page += direction === "next" ? 1 : -1;
      renderEventCalendar();
      document.getElementById("eventos")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  document.addEventListener("change", (event) => {
    if (event.target.id !== "event-month-select" || !eventView) return;

    const month = Number(event.target.value);
    if (!Number.isInteger(month) || month < 1 || month > 12) return;

    eventView.month = month;
    eventView.page = 1;
    renderEventCalendar();
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
