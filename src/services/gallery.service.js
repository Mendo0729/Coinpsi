import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/api/v1/gallery`;

function normalizeImageUrl(imagePath) {
  try {
    return new URL(String(imagePath || ""), `${API_BASE_URL}/`).href;
  } catch {
    return "";
  }
}

function mapGalleryItem(item) {
  const id = String(item?.id || "").trim();
  const imageUrl = normalizeImageUrl(item?.imagePath);
  if (!id || !imageUrl) return null;

  return {
    id,
    title: String(item.title || "Actividad COINPSI").trim(),
    description: String(item.description || "Actividad realizada por COINPSI.").trim(),
    category: String(item.category || "Galeria").trim(),
    isFeatured: Boolean(item.isFeatured),
    imageUrl
  };
}

export async function getPublishedGalleryItems() {
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
    const error = new Error(data.message || "No fue posible consultar la galeria.");
    error.code = data.error || "API_ERROR";
    error.status = response.status;
    throw error;
  }

  return (data.items || [])
    .map(mapGalleryItem)
    .filter(Boolean)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
}
