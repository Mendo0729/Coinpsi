import { icon } from "../icons.js";

export function renderHero() {
  return `
    <section id="hero" class="hero section-dark">
      <div class="hero-bg">
        <div class="blur-orb orb-left"></div>
        <div class="blur-orb orb-right"></div>
        <svg class="hero-pattern" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="300" cy="100" r="200" stroke="white" stroke-width="1" stroke-dasharray="10 10"></circle>
          <circle cx="350" cy="150" r="150" stroke="white" stroke-width="2"></circle>
        </svg>
      </div>
      <div class="container hero-content">
        <div class="hero-grid">
          <div class="hero-text reveal">
            <span class="eyebrow eyebrow-dark">${icon("Sparkles")}<span>Corporación de Investigaciones Psicológicas</span></span>
            <h1>Transformamos el bienestar psicológico en <span>crecimiento personal, académico y organizacional.</span></h1>
            <p>Brindamos soluciones integrales de salud mental, capacitación de habilidades blandas e investigación aplicada para potenciar entornos humanos asertivos, prósperos y felices.</p>
            <div class="hero-actions">
              <a id="hero-cta-info" href="#contacto" class="btn btn-light"><span>Solicitar información</span>${icon("ArrowRight")}</a>
              <a id="hero-cta-services" href="#servicios" class="btn btn-ghost"><span>Conocer servicios</span></a>
            </div>
          </div>
          <div class="hero-media reveal delay-2">
            <div class="media-glow"></div>
            <figure class="image-card hero-image">
              <img src="./src/assets/images/Portada.png" alt="Capacitación psicológica interactiva de COINPSI" referrerpolicy="no-referrer" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  `;
}
