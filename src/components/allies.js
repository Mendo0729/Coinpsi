function renderAllyCards(allies, hidden = false) {
  return `
    <div class="ally-marquee-group" ${hidden ? 'aria-hidden="true"' : ''}>
      ${allies.map((ally) => `
        <div class="ally-card" title="${ally.name}">
          <img
            src="${ally.logoUrl}"
            alt="${hidden ? "" : ally.name}"
            loading="lazy"
            decoding="async"
          />
        </div>
      `).join("")}
    </div>
  `;
}

export function renderAllies(allies) {
  return `
    <section id="aliados" class="allies-section" aria-labelledby="allies-title">
      <div class="container">
        <p id="allies-title">Instituciones y organizaciones que confían en COINPSI</p>
      </div>
      <div class="marquee-wrap">
        <div class="marquee-edge left"></div>
        <div class="marquee-edge right"></div>
        <div class="scrolling-carousel-track">
          ${renderAllyCards(allies)}
          ${renderAllyCards(allies, true)}
        </div>
      </div>
    </section>
  `;
}
