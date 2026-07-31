import { icon } from "../icons.js";
import { escapeHtml } from "../utils.js";

function renderCover(post) {
  if (post.coverImageUrl) {
    return `
      <div class="knowledge-card-cover">
        <img src="${escapeHtml(post.coverImageUrl)}" alt="Portada de ${escapeHtml(post.title)}" loading="lazy" />
      </div>
    `;
  }

  return `
    <div class="knowledge-card-cover knowledge-card-placeholder" aria-hidden="true">
      ${icon("Sparkles")}
      <span>${escapeHtml(post.category.name)}</span>
    </div>
  `;
}

export function renderKnowledgeShell() {
  return `
    <section id="espacio-del-saber" class="section knowledge-section">
      <div class="container">
        <div class="section-row-heading reveal knowledge-heading">
          <div>
            <span class="eyebrow"><span></span>CÁPSULAS DE CONOCIMIENTO COINPSI</span>
            <h2>Espacio del Saber</h2>
          </div>
          <p>Ideas, herramientas y reflexiones creadas para acercar el conocimiento psicológico a nuestra comunidad.</p>
        </div>
        <div id="knowledge-list" class="knowledge-grid">${renderKnowledgeLoading()}</div>
      </div>
    </section>
  `;
}

export function renderKnowledgeLoading() {
  return `
    <div class="public-knowledge-state" role="status">
      <span class="public-knowledge-spinner" aria-hidden="true"></span>
      <div><strong>Cargando cápsulas</strong><p>Consultando el contenido publicado por COINPSI.</p></div>
    </div>
  `;
}

export function renderKnowledgeEmpty() {
  const list = document.getElementById("knowledge-list");
  if (!list) return;

  list.innerHTML = `
    <div class="public-knowledge-state">
      <span class="public-knowledge-state-icon">${icon("Sparkles")}</span>
      <div><strong>Próximamente nuevas cápsulas</strong><p>Estamos preparando contenido para compartir en este espacio.</p></div>
    </div>
  `;
}

export function renderKnowledgeError(message) {
  const list = document.getElementById("knowledge-list");
  if (!list) return;

  list.innerHTML = `
    <div class="public-knowledge-state public-knowledge-error" role="alert">
      <span class="public-knowledge-state-icon">!</span>
      <div><strong>No fue posible cargar Espacio del Saber</strong><p>${escapeHtml(message)}</p></div>
    </div>
  `;
}

export function renderKnowledgePosts(posts) {
  const list = document.getElementById("knowledge-list");
  if (!list) return;

  if (!posts.length) {
    renderKnowledgeEmpty();
    return;
  }

  list.innerHTML = posts.map((post) => `
    <article class="knowledge-card reveal ${post.isFeatured ? "knowledge-card-featured" : ""}" data-knowledge-id="${escapeHtml(post.id)}">
      ${renderCover(post)}
      <div class="knowledge-card-body">
        <div class="knowledge-card-topline">
          <span class="knowledge-category">${escapeHtml(post.category.name)}</span>
          ${post.isFeatured ? '<span class="knowledge-highlight">Destacada</span>' : ""}
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.summary)}</p>
        <div class="knowledge-card-meta">
          <span>Por ${escapeHtml(post.authorName)}</span>
          <span>${escapeHtml(post.publishedDate)}</span>
        </div>
        <button class="knowledge-read-button" type="button" data-knowledge-id="${escapeHtml(post.id)}">
          Leer cápsula ${icon("ArrowRight")}
        </button>
      </div>
    </article>
  `).join("");
}

function renderContent(content) {
  const paragraphs = String(content || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) return "<p>Contenido no disponible.</p>";

  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

export function knowledgeModalTemplate(post) {
  return `
    <div class="modal-overlay knowledge-modal-overlay" data-close-modal>
      <article class="modal-card knowledge-reader" role="dialog" aria-modal="true" aria-labelledby="knowledge-reader-title">
        <button class="modal-close knowledge-reader-close" data-close-modal aria-label="Cerrar">×</button>
        ${post.coverImageUrl ? `
          <div class="knowledge-reader-cover">
            <img src="${escapeHtml(post.coverImageUrl)}" alt="Portada de ${escapeHtml(post.title)}" />
          </div>
        ` : ""}
        <div class="knowledge-reader-content">
          <span class="knowledge-category">${escapeHtml(post.category.name)}</span>
          <h2 id="knowledge-reader-title">${escapeHtml(post.title)}</h2>
          <div class="knowledge-reader-meta">
            <span>Por ${escapeHtml(post.authorName)}</span>
            <span>${escapeHtml(post.publishedDate)}</span>
          </div>
          <p class="knowledge-reader-summary">${escapeHtml(post.summary)}</p>
          <div class="knowledge-reader-body">${renderContent(post.content)}</div>
        </div>
      </article>
    </div>
  `;
}
