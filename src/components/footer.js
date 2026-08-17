import { icon } from "../icons.js";
import { logoTemplate } from "../utils.js";

const WHATSAPP_NUMBER = "50760000000";
const WHATSAPP_DISPLAY = "+507 6000-0000";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, deseo recibir información sobre los servicios de COINPSI."
);
const INSTAGRAM_URL = "https://www.instagram.com/coinpsi?igsh=MXYxbXZkaW85N3FhOQ==";

export function renderFooter() {
  return `
    <footer id="main-footer" class="footer">
      <div class="footer-line"></div>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            ${logoTemplate("small")}
            <p>Corporación de Investigaciones Psicológicas. Comprometidos con el desarrollo de metodologías científicas para fomentar la felicidad, bienestar integral y resiliencia organizacional de forma colectiva.</p>
            <div class="social-links">
              <span class="social-link-disabled" aria-label="LinkedIn próximamente" title="LinkedIn próximamente">${icon("Linkedin")}</span>
              <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="Instagram de COINPSI" title="Instagram">${icon("Instagram")}</a>
            </div>
            <small class="social-note">LinkedIn estará disponible próximamente.</small>
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
              <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}" target="_blank" rel="noopener noreferrer">
                ${icon("Phone")}<span>WhatsApp: ${WHATSAPP_DISPLAY}</span>
              </a>
              <a href="mailto:info@coinpsi.org">
                ${icon("Mail")}<span>info@coinpsi.org</span>
              </a>
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
