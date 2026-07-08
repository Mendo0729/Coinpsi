import { icon } from "../icons.js";
import { logoTemplate } from "../utils.js";

const navLinks = [
  ["Quiénes Somos", "#quienes-somos"],
  ["Servicios", "#servicios"],
  ["Tómate un Break", "#dream-week"],
  ["Eventos", "#eventos"],
  ["Galería", "#galeria"]
];

export function renderHeader() {
  return `
    <header id="main-header" class="site-header">
      <div class="container">
        <div class="header-row">
          ${logoTemplate()}
          <nav class="desktop-nav">
            ${navLinks.map(([name, href]) => `<a href="${href}">${name}</a>`).join("")}
          </nav>
          <a id="header-contact-btn" href="#contacto" class="btn btn-primary header-cta">
            ${icon("PhoneCall")}<span>Solicitar Información</span>
          </a>
          <button id="mobile-menu-toggle" class="icon-button mobile-toggle" aria-label="Abrir menú">
            ${icon("Menu", "menu-icon")}${icon("X", "close-icon")}
          </button>
        </div>
      </div>
      <nav id="mobile-navigation-drawer" class="mobile-drawer">
        <div class="mobile-drawer-inner">
          ${navLinks.map(([name, href]) => `<a href="${href}">${name}</a>`).join("")}
          <a id="mobile-header-contact-btn" href="#contacto" class="btn btn-primary mobile-contact">${icon("PhoneCall")}<span>Solicitar Información</span></a>
        </div>
      </nav>
    </header>
  `;
}

export function initHeader() {
  const header = document.getElementById("main-header");
  const toggle = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-navigation-drawer");

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll);
  onScroll();

  toggle.addEventListener("click", () => {
    header.classList.toggle("menu-open");
    drawer.classList.toggle("open");
  });

  drawer.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      header.classList.remove("menu-open");
      drawer.classList.remove("open");
    }
  });
}
