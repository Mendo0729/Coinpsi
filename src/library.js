import {renderHeader,initHeader} from "./components/header.js";
import {renderFooter,initFooter} from "./components/footer.js";
import {renderPublicationCard} from "./components/knowledge.js";
import {getCatalog,getCategories,getPublication,recordView,downloadUrl} from "./services/knowledge.service.js";
import {drivePreview,documentLabel,safeImage} from "./services/knowledge-links.js";
import {escapeHtml as e} from "./utils.js";
const slug=new URLSearchParams(location.search).get("articulo");
document.getElementById("app").innerHTML=renderHeader()+'<main class="library-main" id="library-main"></main>'+renderFooter();
initHeader();initFooter();
const main=document.getElementById("library-main");
const base="/espacio-del-saber/";
function message(text){return '<p class="library-note" role="status">'+e(text)+'</p>';}
async function detail(){
 main.innerHTML='<div class="container library-detail"><a href="'+base+'">← Volver al catálogo</a><div id="detail-result">'+message("Cargando documento…")+'</div></div>';
 const result=document.getElementById("detail-result");
 try{
 const post=await getPublication(slug);const preview=drivePreview(post);const cover=safeImage(post.coverImageUrl);
 document.title=post.title+" | Espacio del Saber | COINPSI";
 document.querySelector('meta[name="description"]')?.setAttribute("content",post.summary);
 result.innerHTML=`<article><div class="library-detail-meta"><span class="knowledge-category">${e(post.category.name)}</span> · ${e(documentLabel(post.documentType))}</div><h1>${e(post.title)}</h1><p class="library-byline">Por ${e(post.authorName)} · ${e(post.publishedDate)}</p>${cover?`<img class="library-detail-cover" src="${e(cover)}" alt="" referrerpolicy="no-referrer">`:""}<h2>Resumen</h2><p class="library-abstract">${e(post.summary)}</p><div class="library-keywords">${post.keywords.map(k=>'<span>'+e(k)+'</span>').join("")}</div><div class="library-detail-actions"><a class="btn btn-primary" href="${e(downloadUrl(post.slug))}" target="_blank" rel="noopener noreferrer">Descargar PDF ↓</a><button class="btn library-outline" id="share-publication">Compartir</button></div><p id="share-feedback" role="status"></p><h2>Leer documento</h2>${preview?`<iframe class="library-viewer" src="${e(preview)}" title="Documento PDF" referrerpolicy="no-referrer" loading="lazy"></iframe><p>Si el visor no carga, <a href="${e(preview)}" target="_blank" rel="noopener noreferrer">abre el documento en Google Drive</a>.</p>`:message("Vista previa no disponible.")}</article>`;
 document.getElementById("share-publication").onclick=async()=>{try{if(navigator.share)await navigator.share({title:post.title,url:location.href});else{await navigator.clipboard.writeText(location.href);document.getElementById("share-feedback").textContent="Enlace copiado.";}}catch(err){if(err.name!=="AbortError")document.getElementById("share-feedback").textContent="Copia el enlace desde la barra de direcciones.";}};
 recordView(slug).catch(()=>{});
 }catch(err){result.innerHTML=message(err.message);}
}
function catalog(){
 main.innerHTML=`<section class="library-hero"><div class="container"><span class="eyebrow"><span></span>BIBLIOTECA DIGITAL COINPSI</span><h1>Espacio del Saber</h1><p>Investigaciones, artículos y recursos para comprender mejor la psicología y el desarrollo humano.</p></div></section>
 <div class="container library-layout"><form id="library-filters" class="library-filters"><h2>Explorar publicaciones</h2><label>Buscar<input name="search" type="search" maxlength="180" placeholder="Título, autor o palabra clave"></label><label>Categoría<select name="category"><option value="">Todas</option></select></label><label>Tipo de documento<select name="type"><option value="">Todos</option><option value="research">Investigación</option><option value="article">Artículo</option><option value="guide">Guía</option><option value="report">Informe</option><option value="journal">Revista</option></select></label><label>Año<input name="year" type="number" min="1000" max="9999" placeholder="Todos"></label><label>Ordenar<select name="sort"><option value="newest">Más recientes</option><option value="oldest">Más antiguas</option></select></label><button class="btn btn-primary" type="submit">Buscar</button><button class="btn library-outline" type="reset">Limpiar filtros</button></form><section class="library-results"><h2>Publicaciones</h2><p id="library-count" aria-live="polite"></p><div id="library-results">${message("Cargando publicaciones…")}</div><nav class="knowledge-pagination" id="library-pagination" aria-label="Paginación"></nav></section></div>`;
 const form=document.getElementById("library-filters"),results=document.getElementById("library-results"),count=document.getElementById("library-count"),nav=document.getElementById("library-pagination");
 let page=1,controller;
 async function load(){
 controller?.abort();const current=new AbortController();controller=current;
 const params=Object.fromEntries([...new FormData(form)].filter(([,v])=>v!==""));params.page=String(page);params.limit="12";
 results.innerHTML=message("Cargando publicaciones…");nav.innerHTML="";count.textContent="";
 try{const data=await getCatalog(params,current.signal);if(current.signal.aborted)return;
 count.textContent=data.total+" publicaciones";results.innerHTML=data.posts.length?'<div class="library-grid">'+data.posts.map(renderPublicationCard).join("")+'</div>':message("No encontramos publicaciones con estos filtros.");
 const pages=Math.max(1,Math.ceil(data.total/data.limit));if(page>pages){page=pages;return load();}
 if(pages>1){nav.innerHTML='<button id="library-prev" '+(page===1?"disabled":"")+'>Anterior</button><span>Página '+page+' de '+pages+'</span><button id="library-next" '+(page>=pages?"disabled":"")+'>Siguiente</button>';document.getElementById("library-prev").onclick=()=>{page--;load();};document.getElementById("library-next").onclick=()=>{page++;load();};}
 }catch(err){if(current.signal.aborted)return;results.innerHTML=message("No fue posible cargar el catálogo. Intenta nuevamente.");const retry=document.createElement("button");retry.className="btn library-outline";retry.textContent="Reintentar";retry.onclick=load;results.append(retry);}
 }
 form.onsubmit=event=>{event.preventDefault();page=1;load();};form.onreset=()=>{setTimeout(()=>{page=1;load();},0);};form.querySelectorAll("select").forEach(select=>select.onchange=()=>{page=1;load();});
 getCategories().then(categories=>{for(const c of categories){const o=document.createElement("option");o.value=c.slug;o.textContent=c.name;form.elements.category.append(o);}}).catch(()=>{});
 load();
}
if(slug)detail();else catalog();
