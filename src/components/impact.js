import { icon } from "../icons.js";

const stats = [
  ["participantes", 500, "+", "", "Participantes", "Personas empoderadas en programas, retiros y talleres.", "Users"],
  ["talleres", 30, "+", "", "Talleres Realizados", "Módulos prácticos ejecutados con éxito y rigor científico.", "Presentation"],
  ["organizaciones", 15, "+", "", "Organizaciones Atendidas", "Empresas, colegios y universidades de renombre nacional.", "Shield"],
  ["satisfaccion", 95, "", "%", "Satisfacción", "Calificación de excelencia de nuestros participantes.", "ThumbsUp"]
];

export function renderImpact() {
  return `
    <section id="impacto" class="section impact-section section-soft">
      <div class="container">
        <div class="section-header compact reveal">
          <span class="eyebrow centered"><span></span>NUESTRO IMPACTO REAL<span></span></span>
          <p>Respaldamos nuestra labor con datos e indicadores consistentes que reflejan el cambio cuantitativo y cualitativo en nuestros aliados.</p>
        </div>
        <div class="stats-grid">
          ${stats.map(([id, target, prefix, suffix, label, description, iconName]) => `
            <article id="impact-stat-card-${id}" class="stat-card reveal" data-target="${target}">
              <span class="card-icon">${icon(iconName)}</span>
              <div class="stat-number"><span>${prefix}</span><strong data-count="${id}">0</strong><span>${suffix}</span></div>
              <h3>${label}</h3>
              <p>${description}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

export function observeCounters() {
  const impact = document.getElementById("impacto");
  if (!impact) return;
  let started = false;
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    document.querySelectorAll(".stat-card").forEach((card) => {
      const output = card.querySelector("[data-count]");
      const target = Number(card.dataset.target);
      let step = 0;
      const steps = 30;
      const timer = setInterval(() => {
        step += 1;
        output.textContent = Math.min(target, Math.round((target / steps) * step));
        if (step >= steps) clearInterval(timer);
      }, 50);
    });
    observer.disconnect();
  }, { threshold: 0.1 });
  observer.observe(impact);
}
