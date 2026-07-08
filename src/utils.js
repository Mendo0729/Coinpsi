export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

export function formatEventDate(dateStr) {
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const [year, month, day] = dateStr.split("-");
  const monthName = months[Number(month) - 1];
  return {
    day: Number(day),
    month: monthName.substring(0, 3).toUpperCase(),
    fullDate: `${day} de ${monthName}, ${year}`
  };
}

export function sectionHeader(label, title, text) {
  return `
    <div class="section-header reveal">
      <span class="eyebrow centered"><span></span>${label}<span></span></span>
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
  `;
}

export function logoTemplate(size = "large") {
  return `
    <a href="#hero" class="brand brand-${size}">
      <img class="brand-logo" src="./src/assets/images/Logo_coinpsi.png" alt="COINPSI Corporación de Investigaciones Psicológicas" />
    </a>
  `;
}
