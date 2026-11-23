import { API_BASE_URL } from "../config.js";

export async function sendContact(data) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(18000)
    });
  } catch (error) {
    if (error?.name === "TimeoutError") {
      throw new Error("El servidor tardó demasiado en responder. Puedes intentar nuevamente.");
    }
    throw new Error("No se pudo conectar con COINPSI. Intenta nuevamente o escribe a info@coinpsi.org.");
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.status !== "ok") {
    const errors = {
      429: "Has realizado varias solicitudes. Intenta nuevamente más tarde.",
      502: "No se pudo enviar el correo. Intenta nuevamente más tarde o escribe a info@coinpsi.org.",
      503: "El formulario no está disponible temporalmente. Puedes escribir a info@coinpsi.org."
    };
    const error = new Error(errors[response.status] || result.message || "No fue posible enviar tu consulta.");
    error.code = result.error || "CONTACT_ERROR";
    error.fields = result.fields && typeof result.fields === "object" ? result.fields : null;
    throw error;
  }

  return result;
}
