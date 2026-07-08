import { icon } from "../icons.js";
import { escapeHtml } from "../utils.js";

function contactInfoItem(iconName, title, main, sub) {
  return `<div class="contact-item"><span>${icon(iconName)}</span><div><h4>${title}</h4>${main}<small>${sub}</small></div></div>`;
}

export function renderContact(services) {
  return `
    <section id="contacto" class="section contact-section section-soft">
      <div class="section-orb contact-orb"></div>
      <div class="container contact-grid">
        <div class="contact-info reveal">
          <span class="eyebrow"><span></span>FORMULARIO DE CONTACTO</span>
          <h2>Iniciemos un Diálogo de Bienestar</h2>
          <p>Toda consulta es gestionada con absoluta confidencialidad y rigor ético profesional por parte de nuestro equipo. Escríbenos o llámanos hoy mismo.</p>
          <div class="contact-list">
            ${contactInfoItem("Phone", "Teléfono de atención", '<a href="tel:+573004567890">+57 300 456 7890</a>', "Lunes a Viernes: 8:00 AM - 6:00 PM")}
            ${contactInfoItem("Mail", "Correo Institucional", '<a href="mailto:contacto@coinpsi.org">contacto@coinpsi.org</a>', "Consultas corporativas y presupuestos")}
            ${contactInfoItem("MapPin", "Dirección Sede Principal", "<strong>Edificio Corporativo Alianza, Piso 7, Oficina 704</strong>", "Eje Central Financiero, Ciudad de Origen")}
          </div>
          <div class="social-block">
            <h4>Redes Sociales</h4>
            <div class="social-links">
              ${["Facebook", "Linkedin", "Instagram", "Twitter"].map((name) => `<a href="#${name.toLowerCase()}" aria-label="${name}">${icon(name)}</a>`).join("")}
            </div>
          </div>
        </div>
        <div class="contact-form-zone reveal delay-1">
          <div class="form-card">
            <h3>Envía tu Consulta Profesional</h3>
            <form id="contact-form" novalidate>
              <label>Nombre Completo<input name="fullName" type="text" placeholder="Ej. Dr. Andrés Gamarra" /></label>
              <div class="form-row">
                <label>Correo Electrónico<input name="email" type="email" placeholder="correo@empresa.com" /></label>
                <label>Teléfono de Contacto<input name="phone" type="text" placeholder="Ej. +57 300 456 7890" /></label>
              </div>
              <label>Tipo de servicio requerido
                <select name="serviceType">
                  ${services.map((service) => `<option value="${service.id}">${service.title}</option>`).join("")}
                </select>
              </label>
              <label>Mensaje / Consulta específica<textarea name="message" rows="4" placeholder="Describe los objetivos o contexto de tu organización o duda..."></textarea></label>
              <button class="btn btn-primary form-submit" type="submit"><span>Enviar consulta</span>${icon("Send")}</button>
            </form>
            <div id="contact-success" class="success-box hidden">
              ${icon("CheckCircle2")}
              <div><strong>¡Consulta recibida con éxito!</strong><span>Un psicólogo de nuestro comité científico evaluará tu solicitud y se comunicará contigo en menos de 24 horas hábiles.</span></div>
              <button type="button">Cerrar</button>
            </div>
          </div>
          <div id="inbox-zone"></div>
        </div>
      </div>
    </section>
  `;
}

export function initContact() {
  document.getElementById("contact-success").querySelector("button").addEventListener("click", () => {
    document.getElementById("contact-success").classList.add("hidden");
  });
  renderInbox();
}

export function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    serviceType: form.serviceType.value,
    message: form.message.value.trim()
  };

  const errors = {};
  if (!data.fullName) errors.fullName = "El nombre es obligatorio.";
  if (!data.email) errors.email = "El correo electrónico es obligatorio.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Ingrese un formato de correo válido.";
  if (!data.phone) errors.phone = "El teléfono de contacto es obligatorio.";
  else if (!/^\+?[\d\s-]{7,15}$/.test(data.phone)) errors.phone = "Ingrese un número telefónico válido.";
  if (!data.message) errors.message = "Escriba un mensaje para su consulta.";

  form.querySelectorAll(".field-error").forEach((node) => node.remove());
  form.querySelectorAll(".invalid").forEach((node) => node.classList.remove("invalid"));

  Object.entries(errors).forEach(([field, message]) => {
    const input = form[field];
    input.classList.add("invalid");
    input.insertAdjacentHTML("afterend", `<span class="field-error">${message}</span>`);
  });

  if (Object.keys(errors).length) return;

  const button = form.querySelector("button");
  button.innerHTML = '<span class="spinner"></span>';
  button.disabled = true;

  setTimeout(() => {
    const inquiry = {
      id: `msg-${Math.floor(100000 + Math.random() * 90000)}-${Date.now()}`,
      ...data,
      timestamp: `${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} ${new Date().toLocaleDateString("es-ES")}`
    };
    const stored = JSON.parse(localStorage.getItem("coinpsi_contacts") || "[]");
    stored.unshift(inquiry);
    localStorage.setItem("coinpsi_contacts", JSON.stringify(stored));
    form.reset();
    button.innerHTML = `<span>Enviar consulta</span>${icon("Send")}`;
    button.disabled = false;
    document.getElementById("contact-success").classList.remove("hidden");
    renderInbox();
  }, 1200);
}

function renderInbox() {
  const zone = document.getElementById("inbox-zone");
  if (!zone) return;
  const messages = JSON.parse(localStorage.getItem("coinpsi_contacts") || "[]");
  if (!messages.length) {
    zone.innerHTML = "";
    return;
  }
  zone.innerHTML = `
    <div class="inbox-block">
      <button id="toggle-inbox" class="inbox-toggle">${icon("Inbox")}<span>Ver consultas enviadas (${messages.length})</span></button>
      <div id="inbox-list" class="inbox-list hidden">
        ${messages.map((msg) => `
          <article class="inbox-message">
            <div><div><h4>${escapeHtml(msg.fullName)}</h4><p>${escapeHtml(msg.email)} | ${escapeHtml(msg.phone)}</p><strong>Servicio: ${escapeHtml(msg.serviceType).replace(/-/g, " ")}</strong></div><button data-delete-inquiry="${msg.id}" title="Borrar de la bandeja">${icon("Trash2")}</button></div>
            <p>"${escapeHtml(msg.message)}"</p>
            <small>${icon("Clock")}${escapeHtml(msg.timestamp)}</small>
          </article>
        `).join("")}
      </div>
    </div>
  `;

  document.getElementById("toggle-inbox").addEventListener("click", () => {
    const list = document.getElementById("inbox-list");
    list.classList.toggle("hidden");
    document.querySelector("#toggle-inbox span").textContent = `${list.classList.contains("hidden") ? "Ver" : "Ocultar"} consultas enviadas (${messages.length})`;
  });

  zone.querySelectorAll("[data-delete-inquiry]").forEach((button) => {
    button.addEventListener("click", () => {
      const updated = messages.filter((msg) => msg.id !== button.dataset.deleteInquiry);
      localStorage.setItem("coinpsi_contacts", JSON.stringify(updated));
      renderInbox();
    });
  });
}
