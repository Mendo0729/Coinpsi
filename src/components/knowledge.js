import { icon } from "../icons.js";
import { escapeHtml } from "../utils.js";

export const KNOWLEDGE_PAGE_SIZE = 2;

function getContentPreview(content, maxLength = 620) {
  const normalized = String(content || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
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
        <div id="knowledge-list" class="knowledge-list">${renderKnowledgeLoading()}</div>
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

function renderKnowledgeCard(post) {
  return `
    <article class="knowledge-card reveal">
      <div class="knowledge-card-topline">
        <span class="knowledge-category">${escapeHtml(post.category.name)}</span>
        <span class="knowledge-card-date">${escapeHtml(post.publishedDate)}</span>
      </div>

      <h3>${escapeHtml(post.title)}</h3>
      <p class="knowledge-card-summary">${escapeHtml(post.summary)}</p>
      <p class="knowledge-card-text">${escapeHtml(getContentPreview(post.content))}</p>

      <footer class="knowledge-card-footer">
        <span class="knowledge-card-author">Por ${escapeHtml(post.authorName)}</span>
        <button class="knowledge-read-button" type="button" data-knowledge-id="${escapeHtml(post.id)}">
          Leer cápsula completa ${icon("ArrowRight")}
        </button>
      </footer>
    </article>
  `;
}

function renderPagination(page, totalPages, totalItems) {
  if (totalPages <= 1) return "";

  return `
    <nav class="knowledge-pagination" aria-label="Paginación de Espacio del Saber">
      <button type="button" data-knowledge-page="previous" ${page <= 1 ? "disabled" : ""}>Anterior</button>
      <span>Página ${page} de ${totalPages} · ${totalItems} cápsulas</span>
      <button type="button" data-knowledge-page="next" ${page >= totalPages ? "disabled" : ""}>Siguiente</button>
    </nav>
  `;
}

export function renderKnowledgePosts(posts, requestedPage = 1) {
  const list = document.getElementById("knowledge-list");
  if (!list) return { page: 1, totalPages: 1, totalItems: 0 };

  if (!posts.length) {
    renderKnowledgeEmpty();
    return { page: 1, totalPages: 1, totalItems: 0 };
  }

  const visiblePosts = posts.slice(0, 10);
  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / KNOWLEDGE_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(requestedPage) || 1), totalPages);
  const start = (page - 1) * KNOWLEDGE_PAGE_SIZE;
  const pageItems = visiblePosts.slice(start, start + KNOWLEDGE_PAGE_SIZE);

  list.innerHTML = `
    <div class="knowledge-grid">
      ${pageItems.map(renderKnowledgeCard).join("")}
    </div>
    ${renderPagination(page, totalPages, visiblePosts.length)}
  `;

  return {
    page,
    totalPages,
    totalItems: visiblePosts.length
  };
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
    <div class="modal-shell knowledge-modal-overlay">
      <button class="modal-backdrop" data-close-modal aria-label="Cerrar cápsula"></button>
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
