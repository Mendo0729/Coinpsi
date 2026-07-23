import { icon } from "../icons.js";

const ABOUT_TABS = ["creemos", "mision", "vision", "valores"];

export function renderAbout() {
  return `
    <section id="quienes-somos" class="section about-section">
      <div class="section-orb top-right"></div>
      <div class="section-orb bottom-left"></div>
      <div class="container">
        <div class="split-grid">
          <div class="section-copy reveal">
            <span class="eyebrow"><span></span>¿QUIÉNES SOMOS?</span>
            <h2>Potenciamos el desarrollo humano con psicología, ciencia y propósito.</h2>
            <p>Somos una corporación especializada en psicología dedicada a promover el desarrollo integral de las personas, las organizaciones y las comunidades.</p>
            <p class="muted">Trabajamos para fortalecer las competencias humanas, potenciar las capacidades individuales y colectivas, y favorecer el bienestar emocional mediante procesos de formación, investigación, intervención y acompañamiento profesional.</p>
            <div class="micro-counters" aria-label="Pilares de COINPSI">
              <div><strong>Ciencia</strong><span>Práctica basada en evidencia</span></div>
              <div><strong>Bienestar</strong><span>Desarrollo integral</span></div>
            </div>
          </div>
          <div class="tabs-panel reveal delay-1">
            <div class="tabs" role="tablist" aria-label="Identidad institucional de COINPSI">
              <button id="tab-creemos" class="tab-button active" type="button" role="tab" aria-selected="true" aria-controls="about-tab-content" data-tab="creemos">${icon("HeartHandshake")}<span>Qué creemos</span></button>
              <button id="tab-mision" class="tab-button" type="button" role="tab" aria-selected="false" aria-controls="about-tab-content" data-tab="mision">${icon("Target")}<span>Misión</span></button>
              <button id="tab-vision" class="tab-button" type="button" role="tab" aria-selected="false" aria-controls="about-tab-content" data-tab="vision">${icon("Eye")}<span>Visión</span></button>
              <button id="tab-valores" class="tab-button" type="button" role="tab" aria-selected="false" aria-controls="about-tab-content" data-tab="valores">${icon("Award")}<span>Valores</span></button>
            </div>
            <div id="about-tab-content" class="tab-content" role="tabpanel" aria-live="polite" aria-labelledby="tab-creemos"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initAbout() {
  const buttons = [...document.querySelectorAll(".tab-button")];

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateAboutTab(button.dataset.tab));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = buttons.length - 1;

      buttons[nextIndex].focus();
      activateAboutTab(buttons[nextIndex].dataset.tab);
    });
  });

  activateAboutTab("creemos");
}

function activateAboutTab(tab) {
  if (!ABOUT_TABS.includes(tab)) return;

  document.querySelectorAll(".tab-button").forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  renderAboutTab(tab);
}

function renderAboutTab(tab = "creemos") {
  const target = document.getElementById("about-tab-content");
  if (!target) return;

  const content = {
    creemos: `
      <div class="tab-pane fade-in">
        <span class="tab-icon">${icon("HeartHandshake")}</span>
        <div>
          <h3>Creemos en el potencial de cada persona</h3>
          <p>Creemos que cada persona posee un enorme potencial para crecer, transformarse y generar cambios positivos en su entorno. Por ello, impulsamos estrategias basadas en la evidencia científica, el compromiso ético y una visión humanista que contribuyen a la construcción de una sociedad más saludable, resiliente y consciente.</p>
        </div>
        <div class="commitment">${icon("CheckCircle")}<span>Evidencia científica, ética y visión humanista</span></div>
      </div>
    `,
    mision: `
      <div class="tab-pane fade-in">
        <span class="tab-icon">${icon("Target")}</span>
        <div>
          <h3>Nuestra misión</h3>
          <p>Potenciar el desarrollo integral de individuos, organizaciones y comunidades mediante servicios psicológicos que fortalezcan sus competencias frente a los desafíos de una sociedad en constante transformación, contribuyendo a su bienestar emocional, salud mental y crecimiento personal.</p>
        </div>
        <div class="commitment">${icon("CheckCircle")}<span>Bienestar emocional, salud mental y crecimiento</span></div>
      </div>
    `,
    vision: `
      <div class="tab-pane fade-in">
        <span class="tab-icon">${icon("Eye")}</span>
        <div>
          <h3>Nuestra visión</h3>
          <p>Ser una corporación líder de la psicología a nivel nacional e internacional, con enfoque bio-psico-socio-espiritual, reconocida por la excelencia de sus servicios y por promover el bienestar integral del ser humano y su entorno.</p>
        </div>
        <div class="commitment">${icon("CheckCircle")}<span>Liderazgo con enfoque integral</span></div>
      </div>
    `,
    valores: `
      <div class="values-grid fade-in" aria-label="Valores institucionales de COINPSI">
        ${[
          ["Honestidad y transparencia", "ShieldCheck"],
          ["Responsabilidad social", "HeartHandshake"],
          ["Dedicación y excelencia", "Award"],
          ["Respeto y confidencialidad", "Shield"],
          ["Comunicación asertiva", "MessageSquareCode"],
          ["Innovación e investigación", "Compass"],
          ["Trabajo colaborativo", "Users"]
        ].map(([name, iconName]) => `<div class="value-card value-name-card"><span>${icon(iconName)}</span><strong>${name}</strong></div>`).join("")}
      </div>
    `
  };

  target.setAttribute("aria-labelledby", `tab-${tab}`);
  target.innerHTML = content[tab];
}
