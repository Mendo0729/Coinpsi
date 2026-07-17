import { icon } from "../icons.js";
import { sectionHeader } from "../utils.js";

export function renderServices(services) {
  return `
    <section id="servicios" class="section services-section section-soft">
      <style>
        #servicios .services-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 640px) {
          #servicios .services-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <div class="section-orb mid-left"></div>
      <div class="section-orb mid-right accent"></div>
      <div class="container">
        ${sectionHeader(
          "NUESTROS SERVICIOS",
          "Servicios psicológicos para personas, familias, empresas y comunidades",
          "Diseñamos procesos de evaluación, acompañamiento e intervención profesional orientados al bienestar emocional, el desarrollo humano y la salud mental."
        )}
        <div class="card-grid services-grid">
          ${services.map((service) => `
            <article id="cards-service-${service.id}" class="service-card lift-card reveal">
              <div>
                <span class="card-icon">${icon(service.iconName)}</span>
                <h3>${service.title}</h3>
                <p>${service.shortDescription}</p>
              </div>
              <div class="card-footer">
                <button id="btn-service-info-${service.id}" class="text-button service-info-btn" data-service-id="${service.id}">
                  <span>Más información</span>${icon("ArrowRight")}
                </button>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

export function openServiceModal(service) {
  return `
    <div id="service-detail-modal" class="modal-shell">
      <button class="modal-backdrop" data-close-modal aria-label="Cerrar detalle del servicio"></button>
      <article class="modal-card service-modal fade-in-up" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
        <header class="modal-header dark">
          <div>
            <span class="modal-icon">${icon(service.iconName)}</span>
            <div><small>${icon("Sparkles")}Portafolio de Servicios COINPSI</small><h3 id="service-modal-title">${service.title}</h3></div>
          </div>
          <button class="icon-button" data-close-modal aria-label="Cerrar detalle del servicio">${icon("X")}</button>
        </header>
        <div class="modal-body">
          <p>${service.longDescription}</p>
          <h4>Este servicio incluye:</h4>
          <div class="benefit-list">
            ${service.benefits.map((benefit) => `<div>${icon("CheckCircle2")}<span>${benefit}</span></div>`).join("")}
          </div>
        </div>
        <footer class="modal-footer">
          <span>¿Deseas recibir más información sobre este servicio?</span>
          <div><button class="btn btn-outline" data-close-modal>Cerrar</button><a id="modal-cta-contact" href="#contacto" class="btn btn-primary" data-close-modal><span>Solicitar información</span>${icon("ArrowRight")}</a></div>
        </footer>
      </article>
    </div>
  `;
}