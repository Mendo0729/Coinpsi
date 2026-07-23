import { icon } from "../icons.js";
import { sectionHeader } from "../utils.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCategories(galleryItems) {
  const categories = [...new Set(
    galleryItems
      .map((item) => String(item.category || "").trim())
      .filter(Boolean)
  )];

  return [["todos", "Todos"], ...categories.map((category) => [category, category])];
}

export function renderGalleryShell() {
  return `
    <section id="galeria" class="section gallery-section">
      <div class="container">
        ${sectionHeader("GALERIA DE ACTIVIDADES", "Nuestra Labor en Accion", "Explora instantes reales de nuestras ferias, retiros, talleres vivenciales y capacitaciones ejecutivas disenadas para inspirar cambio.")}
        <div id="gallery-filters" class="filter-tabs gallery-filters"></div>
        <div id="gallery-grid" class="gallery-grid">
          ${renderGalleryLoadingMarkup()}
        </div>
      </div>
    </section>
  `;
}

function renderGalleryLoadingMarkup() {
  return `
    <div class="gallery-api-state" role="status">
      <span class="gallery-api-spinner" aria-hidden="true"></span>
      <div>
        <strong>Cargando galeria</strong>
        <p>Consultando las imagenes publicadas por COINPSI.</p>
      </div>
    </div>
  `;
}

export function renderGalleryLoading() {
  const grid = document.getElementById("gallery-grid");
  if (grid) grid.innerHTML = renderGalleryLoadingMarkup();
}

export function renderGalleryFilters(galleryItems) {
  const container = document.getElementById("gallery-filters");
  if (!container) return;

  const categories = getCategories(galleryItems);
  container.innerHTML = categories.map(([id, name]) => `
    <button
      class="${id === "todos" ? "active" : ""}"
      type="button"
      data-gallery-filter="${escapeHtml(id)}"
    >${escapeHtml(name)}</button>
  `).join("");
}

export function renderGalleryGrid(galleryItems, filter = "todos") {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const filtered = filter === "todos"
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="gallery-api-state">
        <span class="gallery-api-icon">0</span>
        <div>
          <strong>No hay imagenes en esta categoria</strong>
          <p>Selecciona otra categoria para continuar.</p>
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((item) => `
    <article id="gallery-item-card-${escapeHtml(item.id)}" class="gallery-card reveal" data-gallery-id="${escapeHtml(item.id)}">
      <img
        src="${escapeHtml(item.imageUrl)}"
        alt="${escapeHtml(item.title)}"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
      />
      <div class="gallery-overlay">
        <span class="zoom-icon">${icon("ZoomIn")}</span>
        ${item.isFeatured ? '<span class="gallery-featured-badge">Destacada</span>' : ""}
        <small>${escapeHtml(item.category)}</small>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </article>
  `).join("");
}

export function renderGalleryEmpty() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  grid.innerHTML = `
    <div class="gallery-api-state">
      <span class="gallery-api-icon">0</span>
      <div>
        <strong>Galeria en preparacion</strong>
        <p>Todavia no se han publicado fotografias desde el panel administrativo.</p>
      </div>
    </div>
  `;
}

export function renderGalleryError(message) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  grid.innerHTML = `
    <div class="gallery-api-state gallery-api-error" role="alert">
      <span class="gallery-api-icon">!</span>
      <div>
        <strong>No fue posible cargar la galeria</strong>
        <p>${escapeHtml(message || "Intenta nuevamente mas tarde.")}</p>
      </div>
    </div>
  `;
}

export function lightboxTemplate(item) {
  return `
    <div id="gallery-lightbox-modal" class="lightbox">
      <button class="icon-button lightbox-close" data-close-modal aria-label="Cerrar galeria">${icon("X")}</button>
      <button class="lightbox-backdrop" data-close-modal aria-label="Cerrar"></button>
      <article class="lightbox-card fade-in-up">
        <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" referrerpolicy="no-referrer" />
        <div>
          <span>${icon("Sparkles")}${escapeHtml(item.category)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </article>
    </div>
  `;
}
