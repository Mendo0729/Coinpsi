import { icon } from "../icons.js";

export function renderAbout() {
  return `
    <section id="quienes-somos" class="section about-section">
      <div class="section-orb top-right"></div>
      <div class="section-orb bottom-left"></div>
      <div class="container">
        <div class="split-grid">
          <div class="section-copy reveal">
            <span class="eyebrow"><span></span>¿QUIÉNES SOMOS?</span>
            <h2>Respaldamos el factor humano con ciencia y empatía certificada.</h2>
            <p>La <strong>Corporación de Investigaciones Psicológicas (COINPSI)</strong> nace con el propósito de fusionar la rigurosidad científica de la psicología aplicada con las necesidades reales de desarrollo de personas, empresas e instituciones educativas.</p>
            <p class="muted">A través de evaluaciones de salud ocupacional, talleres psicoterapéuticos interactivos e investigaciones sociológicas de comportamiento, ayudamos a crear espacios de respeto, crecimiento integral y alta motivación.</p>
            <div class="micro-counters">
              <div><strong>100%</strong><span>Criterio Científico</span></div>
              <div><strong>AA</strong><span>Estándar de Seguridad</span></div>
            </div>
          </div>
          <div class="tabs-panel reveal delay-1">
            <div class="tabs" role="tablist">
              <button class="tab-button active" data-tab="mision">${icon("Target")}<span>Misión</span></button>
              <button class="tab-button" data-tab="vision">${icon("Eye")}<span>Visión</span></button>
              <button class="tab-button" data-tab="valores">${icon("Award")}<span>Valores</span></button>
            </div>
            <div id="about-tab-content" class="tab-content"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initAbout() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderAboutTab(button.dataset.tab);
    });
  });
  renderAboutTab("mision");
}

function renderAboutTab(tab = "mision") {
  const target = document.getElementById("about-tab-content");
  if (!target) return;

  const content = {
    mision: `
      <div class="tab-pane fade-in">
        <span class="tab-icon">${icon("Target")}</span>
        <div><h3>Nuestra Misión Institucional</h3><p>Investigar, diseñar y ejecutar soluciones psicológicas asertivas que fortalezcan la salud mental y potencien el desarrollo humano en organizaciones públicas, privadas y el ámbito socioeducativo, sustentados siempre en metodologías basadas en evidencia científica y un trato profundamente empático.</p></div>
        <div class="commitment">${icon("CheckCircle")}<span>Compromiso Certificado por COINPSI</span></div>
      </div>
    `,
    vision: `
      <div class="tab-pane fade-in">
        <span class="tab-icon">${icon("Eye")}</span>
        <div><h3>Nuestra Visión a Futuro</h3><p>Consolidarnos para el año 2028 como la corporación líder en investigación del comportamiento organizacional, desarrollo psicoterapéutico y bienestar integral de América Latina, siendo reconocidos por nuestro rigor metodológico, la excelencia de nuestro equipo clínico y la calidez en el servicio.</p></div>
        <div class="commitment">${icon("CheckCircle")}<span>Hacia un liderazgo científico continental</span></div>
      </div>
    `,
    valores: `
      <div class="values-grid fade-in">
        ${[
          ["Rigor Científico", "Sustentamos todas nuestras metodologías en investigaciones y evidencia científica sólida.", "ShieldCheck"],
          ["Empatía Genuina", "Ubicamos el bienestar integral de la persona en el centro de cada una de nuestras intervenciones.", "HeartHandshake"],
          ["Confidencialidad Absoluta", "Garantizamos un trato ético, transparente e íntegro en el manejo de toda la información.", "ShieldCheck"],
          ["Innovación Humana", "Diseñamos herramientas dinámicas adaptables al cambio de las organizaciones actuales.", "Compass"]
        ].map(([name, desc, iconName]) => `<div class="value-card"><span>${icon(iconName)}</span><div><strong>${name}</strong><p>${desc}</p></div></div>`).join("")}
      </div>
    `
  };

  target.innerHTML = content[tab];
}
