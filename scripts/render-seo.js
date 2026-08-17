const fs = require("fs");
const path = require("path");

const SEO_MARKER = "<!-- SEO_META -->";

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function loadSeoConfig(projectRoot) {
  const configPath = path.join(projectRoot, "seo", "seo.config.json");
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function buildSeoMarkup(config) {
  const organizationId = `${config.url}#organization`;
  const websiteId = `${config.url}#website`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: config.organizationName,
        alternateName: config.siteName,
        legalName: config.legalName,
        url: config.url,
        logo: config.logo,
        image: config.image,
        description: config.description,
        email: config.email,
        areaServed: {
          "@type": "Country",
          name: config.country
        },
        sameAs: config.socialProfiles
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: config.url,
        name: config.siteName,
        alternateName: config.organizationName,
        publisher: {
          "@id": organizationId
        },
        inLanguage: config.language
      }
    ]
  };

  const jsonLd = JSON.stringify(structuredData, null, 2).replace(/</g, "\\u003c");

  return `
    <title>${escapeAttribute(config.title)}</title>
    <meta name="description" content="${escapeAttribute(config.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${escapeAttribute(config.url)}" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${escapeAttribute(config.locale)}" />
    <meta property="og:site_name" content="${escapeAttribute(config.siteName)}" />
    <meta property="og:title" content="${escapeAttribute(config.title)}" />
    <meta property="og:description" content="${escapeAttribute(config.socialDescription)}" />
    <meta property="og:url" content="${escapeAttribute(config.url)}" />
    <meta property="og:image" content="${escapeAttribute(config.image)}" />
    <meta property="og:image:alt" content="${escapeAttribute(`${config.siteName} - ${config.organizationName}`)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(config.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(config.socialDescription)}" />
    <meta name="twitter:image" content="${escapeAttribute(config.image)}" />
    <meta name="twitter:image:alt" content="${escapeAttribute(`${config.siteName} - ${config.organizationName}`)}" />

    <script type="application/ld+json">
${jsonLd}
    </script>`;
}

function injectSeo(html, config) {
  if (!html.includes(SEO_MARKER)) {
    throw new Error(`No se encontró el marcador ${SEO_MARKER} en index.html`);
  }

  return html.replace(SEO_MARKER, buildSeoMarkup(config));
}

module.exports = {
  SEO_MARKER,
  loadSeoConfig,
  buildSeoMarkup,
  injectSeo
};
