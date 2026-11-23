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
  assert.match(await homepage.text(), /COINPSI/);

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
  assert.match(await fallback.text(), /COINPSI/);

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
