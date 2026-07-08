export function renderAllies(allies) {
  const marquee = allies.concat(allies);
  return `
    <section id="aliados" class="allies-section">
      <div class="container">
        <p>Instituciones y organizaciones que confían en COINPSI</p>
      </div>
      <div class="marquee-wrap">
        <div class="marquee-edge left"></div>
        <div class="marquee-edge right"></div>
        <div class="scrolling-carousel-track">
          ${marquee.map((ally) => `
            <div class="ally-card"><img src="${ally.logoUrl}" alt="${ally.name}" referrerpolicy="no-referrer" /></div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}
