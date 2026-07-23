import { API_BASE_URL } from "../config.js";

const API_URL = `${API_BASE_URL}/api/v1/events`;
const PANAMA_TIME_ZONE = "America/Panama";

function getPanamaDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PANAMA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => ["year", "month", "day"].includes(part.type))
      .map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function formatPanamaTime(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("es-PA", {
    timeZone: PANAMA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date).toUpperCase();
}

function formatTimeRange(startAt, endAt) {
  const start = formatPanamaTime(startAt);
  const end = formatPanamaTime(endAt);

  if (!start) return "Hora por confirmar";
  return end ? `${start} - ${end}` : start;
}

function getModalityLabel(modality) {
  const labels = {
    in_person: "Modalidad presencial",
    virtual: "Modalidad virtual",
    hybrid: "Modalidad hibrida"
  };

  return labels[modality] || "Modalidad por confirmar";
}

function createWhatsappUrl(event) {
  const number = String(event.whatsappNumber || "").replace(/\D/g, "");
  if (!number) return null;

  const message = String(
    event.whatsappMessage || `Hola, deseo recibir informacion sobre el evento ${event.title || "COINPSI"}.`
  ).trim();

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function mapPublishedEvent(event) {
  const date = getPanamaDate(event.startAt);
  if (!date) return null;

  return {
    id: String(event.id),
    slug: event.slug || "",
    title: event.title || "Evento COINPSI",
    date,
    time: formatTimeRange(event.startAt, event.endAt),
    location: event.location || "Lugar por confirmar",
    type: event.eventType || "Evento",
    tagline: "Actividad publicada por COINPSI.",
    description: event.description || "",
    capacity: getModalityLabel(event.modality),
    whatsappUrl: createWhatsappUrl(event)
  };
}

export async function getPublishedEvents() {
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
    const error = new Error(data.message || "No fue posible consultar los eventos.");
    error.code = data.error || "API_ERROR";
    error.status = response.status;
    throw error;
  }

  return (data.events || []).map(mapPublishedEvent).filter(Boolean);
}
