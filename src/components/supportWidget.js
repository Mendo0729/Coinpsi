import { icon } from "../icons.js";

export function renderSupportWidget() {
  return `
    <div class="support-widget">
      <button id="btn-trigger-support-bubble" class="support-trigger" title="Líneas de ayuda de emergencia y crisis emocional">
        ${icon("HeartCrack", "pulse")}<span>Orientación en Crisis</span>
      </button>
      <div id="support-dialog-panel" class="support-panel hidden">
        <div class="support-head">
          <div><span class="support-icon">${icon("HeartCrack", "pulse")}</span><div><h4>Contacto & Orientación en Crisis</h4><small>Ayuda Inmediata 24/7</small></div></div>
          <button class="icon-button support-close">${icon("X")}</button>
        </div>
        <p>En <strong>COINPSI</strong> velamos por la vida. Si tú o un ser querido se encuentran en una situación de crisis emocional severa, depresión profunda o ideaciones urgentes, te compartimos líneas oficiales gratuitas e inmediatas de atención en salud mental:</p>
        <div class="help-lines">
          <div>${icon("Phone")}<span><strong>Línea Nacional de Salud Mental</strong><a href="tel:192">Marcar 192 (Servicio Gratuito)</a></span></div>
          <div>${icon("Phone")}<span><strong>Línea de Vida y Solidaridad</strong><a href="tel:106">Marcar 106</a></span></div>
        </div>
        <div class="confidential">${icon("ShieldCheck")}<span>La contención clínica en estas líneas es confidencial y atendida por psiquiatras certificados.</span></div>
      </div>
    </div>
  `;
}

export function initSupportWidget() {
  const supportPanel = document.getElementById("support-dialog-panel");

  document.getElementById("btn-trigger-support-bubble").addEventListener("click", () => {
    supportPanel.classList.toggle("hidden");
  });

  document.querySelector(".support-close").addEventListener("click", () => {
    supportPanel.classList.add("hidden");
  });
}
