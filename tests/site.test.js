"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const fs = require("node:fs");
const path = require("node:path");
const { createServer } = require("../server.js");
const { injectSeo, loadSeoConfig } = require("../scripts/render-seo.js");

const ROOT = path.resolve(__dirname, "..");

test("el servidor local entrega la landing, sus recursos y los archivos SEO", async (t) => {
  const server = createServer({ apiBaseUrl: "https://coinpsi-api.mendotech.lat/" });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const base = "http://127.0.0.1:" + server.address().port;
  const homepage = await fetch(base + "/");
  assert.equal(homepage.status, 200);
  assert.match(homepage.headers.get("content-type"), /text\/html/);
  assert.match(await homepage.text(), /<div id="app"><\/div>/);

  const config = await fetch(base + "/runtime-config.js");
  assert.equal(config.status, 200);
  assert.match(config.headers.get("cache-control"), /no-store/);
  assert.match(await config.text(), /https:\/\/coinpsi-api\.mendotech\.lat/);

  const publicResources = [
    ["/src/main.js", /javascript/],
    ["/src/index.css", /text\/css/],
    ["/src/assets/images/coinpsi-symbol.svg", /image\/svg\+xml/],
    ["/robots.txt", /text\/plain/],
    ["/sitemap.xml", /application\/xml/],
    ["/metadata.json", /application\/json/]
  ];
  for (const [uri, mime] of publicResources) {
    const result = await fetch(base + uri);
    assert.equal(result.status, 200, uri);
    assert.match(result.headers.get("content-type"), mime, uri);
  }

  for (const forbidden of [
    "/package.json",
    "/package-lock.json",
    "/server.js",
    "/scripts/build-static.js",
    "/seo/seo.config.json",
    "/.env",
    "/src/%2e%2e/package.json",
    "/src/nonexistent.js"
  ]) {
    const result = await fetch(base + forbidden);
    assert.equal(result.status, 404, forbidden);
  }

  const fallback = await fetch(base + "/pagina/no-encontrada");
  assert.equal(fallback.status, 200);
  assert.match(await fallback.text(), /<div id="app"><\/div>/);

  const head = await fetch(base + "/", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");

  const post = await fetch(base + "/", { method: "POST" });
  assert.equal(post.status, 405);
});

test("SEO genera metadatos y datos estructurados sin alterar la plantilla", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const config = loadSeoConfig(ROOT);
  assert.match(html, /<!-- SEO_META -->/);
  const output = injectSeo(html, config);
  assert.doesNotMatch(output, /<!-- SEO_META -->/);
  assert.match(output, /<link rel="canonical" href="https:\/\/coinpsi\.org\/"/);
  assert.match(output, /application\/ld\+json/);
  assert.match(output, /Corporación de Investigaciones Psicológicas/);
});

test("proyecto no tiene dependencias externas registradas", () => {
  const pkg = require("../package.json");
  const lock = require("../package-lock.json");
  assert.equal(Object.keys(pkg.dependencies || {}).length, 0);
  assert.equal(Object.keys(pkg.devDependencies || {}).length, 0);
  assert.deepEqual(Object.keys(lock.packages), [""]);
});

test("LinkedIn corporativo se publica en contacto, pie de página y SEO", () => {
  const details = fs.readFileSync(path.join(ROOT, "src/contact-details.js"), "utf8");
  const contact = fs.readFileSync(path.join(ROOT, "src/components/contact.js"), "utf8");
  const footer = fs.readFileSync(path.join(ROOT, "src/components/footer.js"), "utf8");
  const linkedIn = "https://www.linkedin.com/company/coinpsi/";

  assert.ok(details.includes(linkedIn));
  assert.ok(details.includes('export const WHATSAPP_NUMBER = "50760843053"'));
  assert.ok(details.includes('export const WHATSAPP_DISPLAY = "+507 6084-3053"'));
  assert.ok(details.includes("https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}"));
  assert.ok(!details.includes("50766449199"));
  for (const [componentName, content] of [["contacto", contact], ["pie", footer]]) {
    assert.ok(content.includes("from \"../contact-details.js\""), componentName);
    assert.ok(content.includes('href="${LINKEDIN_URL}"'), componentName);
    assert.ok(content.includes('aria-label="LinkedIn de COINPSI"'), componentName);
    assert.ok(content.includes('href="${WHATSAPP_URL}"'), componentName);
    assert.ok(content.includes('aria-label="WhatsApp de COINPSI"'), componentName);
    assert.equal(content.split('href="${WHATSAPP_URL}"').length - 1, 2, componentName);
    assert.ok(!content.includes("LinkedIn próximamente"), componentName);
  }
  const seo = loadSeoConfig(ROOT);
  assert.ok(seo.socialProfiles.includes(linkedIn));
  const html = injectSeo(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), seo);
  assert.ok(html.includes(linkedIn));
});

test("el logo institucional de WhatsApp aparece en contacto y pie de página", () => {
  const asset = "./src/assets/images/logotipo-grande-de-whatssapp.png";
  const fullPath = path.join(ROOT, "src/assets/images/logotipo-grande-de-whatssapp.png");
  const png = fs.readFileSync(fullPath);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 24);
  assert.equal(png.readUInt32BE(20), 24);

  for (const component of ["contact.js", "footer.js"]) {
    const content = fs.readFileSync(path.join(ROOT, "src/components", component), "utf8");
    assert.ok(content.includes('class="whatsapp-social-link"'), component);
    assert.ok(content.includes('class="whatsapp-logo"'), component);
    assert.ok(content.includes(`src="${asset}"`), component);
    assert.ok(content.includes('href="${WHATSAPP_URL}"'), component);
    assert.equal((content.match(/class="whatsapp-logo"/g) || []).length, 1, component);
  }
});

test("WhatsApp comparte el mismo hover y sombreado que los iconos sociales", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/index.css"), "utf8");
  const styles = fs.readFileSync(path.join(ROOT, "src/contact-updates.css"), "utf8");
  assert.match(css, /\.social-links a:hover\s*\{/);
  assert.match(css, /\.social-links a\s*\{[^}]*box-shadow:\s*var\(--shadow-sm\)/s);
  assert.doesNotMatch(styles, /\.social-links\s+\.whatsapp-social-link:hover/);
  assert.doesNotMatch(styles, /\.social-links\s+\.whatsapp-social-link:focus-visible/);
});
