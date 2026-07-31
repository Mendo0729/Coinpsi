import { icon } from "../icons.js";

const benefits = [
  ["Autoconocimiento", "BookOpen", "Brindamos herramientas y espacios de reflexión que ayudan a cada persona a comprender mejor sus emociones, pensamientos y fortalezas, favoreciendo una mayor conexión consigo misma.", '"Conocerse a uno mismo es el primer paso para construir bienestar duradero."'],
  ["Inteligencia Emocional", "BrainCircuit", "Promovemos el reconocimiento, la comprensión y la gestión saludable de las emociones para fortalecer las relaciones interpersonales y afrontar los desafíos cotidianos con mayor equilibrio.", '"Las emociones no se controlan, se comprenden y se gestionan."'],
  ["Comunicación Efectiva", "MessageSquareCode", "Fomentamos la escucha activa, la empatía y el diálogo respetuoso como herramientas esenciales para construir relaciones más sanas y entornos de confianza.", '"Escuchar con atención es una de las formas más poderosas de apoyo."'],
  ["Bienestar Integral", "ShieldCheck", "Impulsamos el equilibrio entre la salud emocional, mental y social, reconociendo que el bienestar se construye día a día a través de pequeñas acciones conscientes.", '"Cuidarte no es un lujo, es una necesidad."']
];

export function renderTomateUnBreak() {
  return `
    <section id="responsabilidad-social" class="section dream-section">
      <div class="container">
        <div class="dream-intro reveal">
          <div class="section-copy dream-heading">
            <span class="eyebrow"><span></span>PROGRAMA DE BIENESTAR Y PAUSA ACTIVA</span>
            <h2>Transformando una pausa en una oportunidad de bienestar</h2>
            <p>Tómate un Break es un programa comunitario impulsado por COINPSI que promueve el autocuidado, la escucha activa y el bienestar emocional. A través de espacios de conversación, reflexión y acompañamiento, buscamos fortalecer la salud mental, fomentar conexiones humanas significativas y contribuir al desarrollo de comunidades más saludables y resilientes.</p>
          </div>
          <div class="dream-logo-wrap" aria-label="Logo oficial de Tómate un Break">
            <img src="./src/assets/images/Tomate_break_logo.jpeg" alt="Logo oficial de Tómate un Break" referrerpolicy="no-referrer" />
          </div>
        </div>
        <div class="dream-grid">
          <div class="dream-media reveal">
            <figure class="image-card dream-image">
              <img src="./src/assets/images/Tomate_break.png" alt="Tómate un Break de COINPSI" referrerpolicy="no-referrer" />
              <span class="badge">${icon("Star")}Pausa Activa Guiada</span>
            </figure>
          </div>
          <div class="dream-content reveal delay-1">
            <div class="mini-heading">
              <strong>${icon("Sparkles", "pulse")}PILARES FUNDAMENTALES DE TÓMATE UN BREAK</strong>
              <p>Haz clic en cada pilar para descubrir cómo este espacio promueve el bienestar emocional y el crecimiento personal.</p>
            </div>
            <div class="accordion">
              ${benefits.map(([title, iconName, desc, quote], index) => `
                <article id="dream-benefit-toggle-${index}" class="accordion-item ${index === 0 ? "active" : ""}" data-dream-index="${index}">
                  <span class="accordion-icon">${icon(iconName)}</span>
                  <div>
                    <button class="accordion-title" type="button">
                      <span>${title}</span>${icon("ChevronRight")}
                    </button>
                    <div class="accordion-body">
                      <p>${desc}</p>
                      <blockquote>${quote}</blockquote>
                    </div>
                  </div>
                </article>
              `).join("")}
            </div>
            <div class="section-action">
              <a id="dream-week-cta" href="#contacto" class="btn btn-dark"><span>Solicitar el programa</span>${icon("ChevronRight")}</a>
              <span>Espacios gratuitos y abiertos para toda la comunidad.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function handleTomateUnBreakClick(target) {
  const dreamItem = target.closest(".accordion-item");
  if (!dreamItem) return false;
  document.querySelectorAll(".accordion-item").forEach((item) => item.classList.remove("active"));
  dreamItem.classList.add("active");
  return true;
}
