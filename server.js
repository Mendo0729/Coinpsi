const express = require("express");
const fs = require("fs");
const path = require("path");
const { loadSeoConfig, injectSeo } = require("./scripts/render-seo");

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_ROOT = __dirname;
const API_BASE_URL = String(
  process.env.API_BASE_URL || "http://localhost:3002"
).replace(/\/+$/, "");

const indexTemplate = fs.readFileSync(
  path.join(PROJECT_ROOT, "index.html"),
  "utf8"
);
const seoConfig = loadSeoConfig(PROJECT_ROOT);
const renderedIndex = injectSeo(indexTemplate, seoConfig);

app.get("/runtime-config.js", (req, res) => {
  res.type("application/javascript");
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.send(
    `window.COINPSI_CONFIG = Object.freeze(${JSON.stringify({ API_BASE_URL })});`
  );
});

app.use(express.static(PROJECT_ROOT, { index: false }));

app.get("*", (req, res) => {
  res.type("html");
  res.set("Cache-Control", "no-cache");
  res.send(renderedIndex);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`COINPSI corriendo en el puerto ${PORT}`);
});
