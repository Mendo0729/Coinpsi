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

function mapKnowledgePost(post) {
  return {
    id: String(post.id),
    title: post.title || "Cápsula de conocimiento",
    slug: post.slug || "",
    summary: post.summary || "",
    content: post.content || "",
    coverImageUrl: post.coverImageUrl || "",
    authorName: post.authorName || "Equipo COINPSI",
    publishedAt: post.publishedAt || null,
    publishedDate: formatPublishedDate(post.publishedAt),
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
