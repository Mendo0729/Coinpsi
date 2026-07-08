import { icon } from "../icons.js";
import { sectionHeader } from "../utils.js";

const categories = [
  ["todos", "Todos"],
  ["Talleres", "Talleres"],
  ["Ferias", "Ferias de Salud"],
  ["Grupales", "Actividades Grupales"],
  ["Conferencias", "Conferencias"]
];

export function renderGalleryShell() {
  return `
    <section id="galeria" class="section gallery-section">
      <div class="container">
        ${sectionHeader("GALERÍA DE ACTIVIDADES", "Nuestra Labor en Acción", "Explora instantes reales de nuestras ferias, retiros, talleres vivenciales y capacitaciones ejecutivas diseñadas para inspirar cambio.")}
        <div class="filter-tabs gallery-filters">
          ${categories.map(([id, name]) => `<button class="${id === "todos" ? "active" : ""}" data-gallery-filter="${id}">${name}</button>`).join("")}
        </div>
        <div id="gallery-grid" class="gallery-grid"></div>
      </div>
    </section>
  `;
}

export function renderGalleryGrid(galleryItems, filter = "todos") {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const filtered = filter === "todos" ? galleryItems : galleryItems.filter((item) => item.category === filter);
  grid.innerHTML = filtered.map((item) => `
    <article id="gallery-item-card-${item.id}" class="gallery-card reveal" data-gallery-id="${item.id}">
      <img src="${item.imageUrl}" alt="${item.title}" referrerpolicy="no-referrer" />
      <div class="gallery-overlay">
        <span class="zoom-icon">${icon("ZoomIn")}</span>
        <small>${item.category}</small>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </article>
  `).join("");
}

export function lightboxTemplate(item) {
  return `
    <div id="gallery-lightbox-modal" class="lightbox">
      <button class="icon-button lightbox-close" data-close-modal aria-label="Cerrar galería">${icon("X")}</button>
      <button class="lightbox-backdrop" data-close-modal aria-label="Cerrar"></button>
      <article class="lightbox-card fade-in-up">
        <img src="${item.imageUrl}" alt="${item.title}" referrerpolicy="no-referrer" />
        <div>
          <span>${icon("Sparkles")}${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>
    </div>
  `;
}
