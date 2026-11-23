import { icon } from "../icons.js";
import { escapeHtml } from "../utils.js";
import { sendContact } from "../services/contact.service.js";

import { WHATSAPP_DISPLAY, WHATSAPP_URL, LINKEDIN_URL, INSTAGRAM_URL } from "../contact-details.js";

function contactInfoItem(iconName, title, main, sub = "") {
  return `<div class="contact-item"><span>${icon(iconName)}</span><div><h4>${title}</h4>${main}${sub ? `<small>${sub}</small>` : ""}</div></div>`;
}

export function renderContact(services) {
  return `
    <section id="contacto" class="section contact-section section-soft">
      <div class="section-orb contact-orb"></div>
      <div class="container contact-grid">
        <div class="contact-info reveal">
          <span class="eyebrow"><span></span>FORMULARIO DE CONTACTO</span>
          <h2>Iniciemos un Diálogo de Bienestar</h2>
          <p>Toda consulta es gestionada con absoluta confidencialidad y rigor ético profesional por parte de nuestro equipo. Escríbenos por WhatsApp o correo electrónico.</p>
          <div class="contact-list">
            ${contactInfoItem(
              "PhoneCall",
              "Contacto por WhatsApp",
              `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">${WHATSAPP_DISPLAY}</a>`,
              "Atención y consultas sobre nuestros servicios"
            )}
            ${contactInfoItem(
              "Mail",
              "Correo institucional",
              '<a href="mailto:info@coinpsi.org">info@coinpsi.org</a>',
              "Consultas corporativas y solicitudes de información"
            )}
          </div>
          <div class="social-block">
            <h4>Redes sociales</h4>
            <div class="social-links">
              <a class="whatsapp-social-link" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de COINPSI" title="Escríbenos por WhatsApp"><img class="whatsapp-logo" src="./src/assets/images/logotipo-grande-de-whatssapp.png" width="24" height="24" alt="" loading="lazy" /></a>
              <a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de COINPSI" title="LinkedIn">${icon("Linkedin")}</a>
              <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="Instagram de COINPSI" title="Instagram">${icon("Instagram")}</a>
            </div>
          </div>
        </div>
        <div class="contact-form-zone reveal delay-1">
          <div class="form-card">
            <h3>Envía tu Consulta Profesional</h3>
            <form id="contact-form" novalidate>
              <label>Nombre Completo<input name="fullName" type="text" autocomplete="name" maxlength="120" placeholder="Ej. Ana Pérez" required /></label>
              <div class="form-row">
                <label>Correo Electrónico<input name="email" type="email" autocomplete="email" maxlength="254" placeholder="correo@empresa.com" required /></label>
                <label>Teléfono de Contacto<input name="phone" type="tel" autocomplete="tel" maxlength="25" placeholder="Ej. +507 6000-0000" required /></label>
              </div>
              <label>Tipo de servicio requerido
                <select name="serviceType" required>
                  ${services.map((service) => `<option value="${escapeHtml(service.id)}">${escapeHtml(service.title)}</option>`).join("")}
                </select>
              </label>
              <label>Mensaje / Consulta específica<textarea name="message" rows="4" maxlength="3000" placeholder="Describe brevemente el motivo de tu consulta..." required></textarea></label>
              <label class="contact-honeypot" aria-hidden="true">Sitio web<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
              <p class="contact-privacy-note">No incluyas datos clínicos, diagnósticos ni información sensible. Nuestro equipo podrá contactarte por los datos facilitados.</p>
              <button class="btn btn-primary form-submit" type="submit"><span>Enviar consulta</span>${icon("Send")}</button>
              <div id="contact-error" class="contact-error hidden" role="alert" aria-live="assertive"></div>
            </form>
            <div id="contact-success" class="success-box hidden" role="status" aria-live="polite">
              ${icon("CheckCircle2")}
              <div><strong>¡Consulta enviada correctamente!</strong><span>Hemos recibido tu solicitud y nuestro equipo se pondrá en contacto contigo.</span></div>
              <button type="button">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initContact() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("contact-success");

  success.querySelector("button").addEventListener("click", () => {
    success.classList.add("hidden");
  });

  // Editing a failed request starts a new submission; retrying unchanged data
  // reuses the same idempotency key to avoid duplicate emails.
  const resetSubmissionId = () => { delete form.dataset.submissionId; };
  form.addEventListener("input", resetSubmissionId);
  form.addEventListener("change", resetSubmissionId);
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field-error").forEach((element) => element.remove());
  form.querySelectorAll(".invalid").forEach((element) => element.classList.remove("invalid"));
}

function showFieldErrors(form, errors) {
  for (const [field, message] of Object.entries(errors)) {
    const input = form.elements.namedItem(field);
    if (!input || !["fullName", "email", "phone", "serviceType", "message"].includes(field)) continue;
    input.classList.add("invalid");
    const hint = document.createElement("span");
    hint.className = "field-error";
    hint.textContent = String(message);
    input.insertAdjacentElement("afterend", hint);
  }
}

function validateForm(form, data) {
  const errors = {};
  if (data.fullName.length < 2 || data.fullName.length > 120) errors.fullName = "El nombre debe contener entre 2 y 120 caracteres.";
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Ingrese un correo electrónico válido.";
  const digits = data.phone.replace(/\D/g, "");
  if (!/^[+()\d\s.-]{7,25}$/.test(data.phone) || digits.length < 7 || digits.length > 15) errors.phone = "Ingrese un teléfono válido (entre 7 y 15 dígitos).";
  if (!Array.from(form.querySelectorAll('select[name="serviceType"] option')).some((option) => option.value === data.serviceType)) {
    errors.serviceType = "Seleccione un servicio válido.";
  }
  if (data.message.length < 10 || data.message.length > 3000) errors.message = "El mensaje debe contener entre 10 y 3000 caracteres.";
  return errors;
}

export async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector(".form-submit");
  if (button.disabled) return;

  const values = new FormData(form);
  const data = {
    fullName: String(values.get("fullName") || "").trim(),
    email: String(values.get("email") || "").trim(),
    phone: String(values.get("phone") || "").trim(),
    serviceType: String(values.get("serviceType") || "").trim(),
    message: String(values.get("message") || "").trim(),
    website: String(values.get("website") || "").trim()
  };

  const errorBox = document.getElementById("contact-error");
  const success = document.getElementById("contact-success");
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
  success.classList.add("hidden");
  clearFieldErrors(form);

  const errors = validateForm(form, data);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    form.elements.namedItem(Object.keys(errors)[0])?.focus();
    return;
  }

  const submissionId = form.dataset.submissionId || globalThis.crypto?.randomUUID?.();
  if (submissionId) {
    form.dataset.submissionId = submissionId;
    data.submissionId = submissionId;
  }

  button.disabled = true;
  button.innerHTML = '<span class="spinner"></span><span>Enviando...</span>';
  form.setAttribute("aria-busy", "true");

  try {
    await sendContact(data);
    form.reset();
    delete form.dataset.submissionId;
    success.classList.remove("hidden");
  } catch (error) {
    if (error.fields) showFieldErrors(form, error.fields);
    errorBox.textContent = error.message || "No se pudo enviar tu consulta. Intenta nuevamente más tarde.";
    errorBox.classList.remove("hidden");
  } finally {
    button.disabled = false;
    button.innerHTML = `<span>Enviar consulta</span>${icon("Send")}`;
    form.removeAttribute("aria-busy");
  }
}
