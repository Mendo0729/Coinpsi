import { escapeHtml } from "../utils.js";
import { icon } from "../icons.js";
import { publicationHref, safeImage, documentLabel } from "../services/knowledge-links.js";
import {downloadUrl} from "../services/knowledge.service.js";
export function renderKnowledgeShell(){return `
<section id="espacio-del-saber" class="section knowledge-section"><div class="container">
<div class="section-row-heading knowledge-heading"><div><span class="eyebrow"><span></span>BIBLIOTECA DIGITAL COINPSI</span><h2>Espacio del Saber</h2></div><p>Investigaciones y recursos especializados en psicología, bienestar y desarrollo humano.</p></div>
<div id="knowledge-list" class="knowledge-list"><p role="status">Cargando publicaciones…</p></div>
<div class="knowledge-library-cta"><a class="btn btn-primary" href="/espacio-del-saber/">Explorar Espacio del Saber ${icon("ArrowRight")}</a></div></div></section>`;}
export function renderKnowledgeEmpty(){const el=document.getElementById("knowledge-list");if(el)el.innerHTML='<p class="library-note">Próximamente nuevas publicaciones.</p>';}
export function renderKnowledgeError(){const el=document.getElementById("knowledge-list");if(el)el.innerHTML='<p class="library-note">Consulta el catálogo para descubrir nuestras publicaciones.</p>';}
export function renderPublicationCard(post){
 const cover=safeImage(post.coverImageUrl);
 return `<article class="library-card">
 <a class="library-cover" href="${escapeHtml(publicationHref(post.slug))}" aria-label="Leer ${escapeHtml(post.title)}">${cover?`<img src="${escapeHtml(cover)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:'<span class="library-document-icon" aria-hidden="true">PDF</span>'}</a>
 <div class="library-card-body"><span class="knowledge-category">${escapeHtml(post.category.name)}</span><small class="library-type">${escapeHtml(documentLabel(post.documentType))} · ${escapeHtml(post.publishedDate)}</small>
 <h3><a href="${escapeHtml(publicationHref(post.slug))}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.summary)}</p><small>Por ${escapeHtml(post.authorName)}</small>
 <div class="library-card-actions"><a href="${escapeHtml(publicationHref(post.slug))}">Leer →</a><a href="${escapeHtml(downloadUrl(post.slug))}" target="_blank" rel="noopener noreferrer">Descargar PDF ↓</a></div></div></article>`;
}
export function renderKnowledgePosts(posts){const el=document.getElementById("knowledge-list");if(el)el.innerHTML='<div class="library-grid">'+posts.slice(0,3).map(renderPublicationCard).join("")+'</div>';return {page:1,totalPages:1,totalItems:Math.min(3,posts.length)};}
