import { icon } from "../icons.js";
import { logoTemplate } from "../utils.js";

export function renderFooter() {
  return `
    <footer id="main-footer" class="footer">
      <div class="footer-line"></div>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            ${logoTemplate("small")}
            <p>Corporación de Investigaciones Psicológicas. Comprometidos con el desarrollo de metodologías científicas para fomentar la felicidad, bienestar integral y resiliencia organizacional de forma colectiva.</p>
            <div class="social-links">${["Facebook", "Linkedin", "Instagram", "Twitter"].map((name) => `<a href="#${name.toLowerCase().slice(0, 2)}" aria-label="${name}">${icon(name)}</a>`).join("")}</div>
          </div>
          <div>
            <h4>Menú Rápido</h4>
            <nav class="footer-menu">
              <a href="#quienes-somos">¿Quiénes Somos?</a>
              <a href="#servicios">Nuestros Servicios</a>
              <a href="#dream-week">Tómate un Break</a>
              <a href="#eventos" class="highlight">Próximos Eventos</a>
              <a href="#galeria">Galería de Fotos</a>
            </nav>
          </div>
          <div>
            <h4>Información de Atención</h4>
            <div class="footer-contact">
              <span>${icon("MapPin")}Edificio Corporativo Alianza, Piso 7, Oficina 704. Eje Central Financiero.</span>
              <span>${icon("Phone")}+57 300 456 7890</span>
              <span>${icon("Mail")}contacto@coinpsi.org</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} COINPSI (Corporación de Investigaciones Psicológicas). Todos los derechos reservados.</span>
          <div>
            <a href="#terms">Términos de servicio</a>
            <a href="#privacy">Privacidad y Confidencialidad</a>
            <button id="footer-back-to-top" class="icon-button" title="Volver Arriba">${icon("ChevronUp")}</button>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function initFooter() {
  document.getElementById("footer-back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
