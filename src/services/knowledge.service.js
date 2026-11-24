import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/api/v1/knowledge/posts`;

function formatPublishedDate(value) {
  if (!value) return "Fecha no disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-PA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Panama"
  }).format(date);
}

export function mapKnowledgePost(post) {
  return {
    id: String(post.id),
    title: post.title || "Cápsula de conocimiento",
    slug: post.slug || "",
    summary: post.summary || "",
    driveUrl: post.driveUrl || "",
    driveFileId: post.driveFileId || "",
    documentType: post.documentType || "research",
    keywords: Array.isArray(post.keywords) ? post.keywords : [],
    publicationDate: post.publicationDate || null,
    coverImageUrl: post.coverImageUrl || "",
    authorName: post.authorName || "Equipo COINPSI",
    publishedAt: post.publishedAt || null,
    publishedDate: formatPublishedDate(post.publicationDate ? String(post.publicationDate).slice(0,10)+"T12:00:00Z" : post.publishedAt),
    displayOrder: Number(post.displayOrder || 0),
    category: {
      id: String(post.category?.id || ""),
      name: post.category?.name || "Conocimiento",
      slug: post.category?.slug || "conocimiento"
    }
  };
}

export async function getPublishedKnowledgePosts() {
  let response;

  try {
    response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
  } catch {
    const error = new Error("No se pudo conectar con Coinpsi-API.");
    error.code = "API_UNAVAILABLE";
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "No fue posible consultar Espacio del Saber.");
    error.code = data.error || "API_ERROR";
    error.status = response.status;
    throw error;
  }

  return (data.posts || []).map(mapKnowledgePost).slice(0, 10);
}

const ROOT = API_URL.replace(/\/posts$/, "");
async function request(path, options={}) {
  const response=await fetch(ROOT+path,{...options,headers:{Accept:"application/json"}});
  if(!response.ok){const error=new Error(response.status===404?"Publicación no disponible.":"No fue posible consultar Espacio del Saber.");error.status=response.status;throw error;}
  return response.status===204?null:response.json();
}
export async function getCatalog(filters,signal) {
 const data=await request("/catalog?"+new URLSearchParams(filters),{signal});
 return {...data,posts:(data.posts||[]).map(mapKnowledgePost)};
}
export async function getCategories(){return (await request("/categories")).categories||[];}
export async function getPublication(slug){return mapKnowledgePost((await request("/catalog/"+encodeURIComponent(slug))).post);}
export function recordView(slug){return request("/catalog/"+encodeURIComponent(slug)+"/view",{method:"POST"});}
export function downloadUrl(slug){return ROOT+"/catalog/"+encodeURIComponent(slug)+"/download";}
