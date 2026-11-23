"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

async function loadClient() {
  const source = read("src/services/contact.service.js");
  const originalImport = 'import { API_BASE_URL } from "../config.js";';
  assert.ok(source.includes(originalImport), "Expected API base import");
  const executable = source.replace(originalImport, 'const API_BASE_URL = "https://coinpsi-api.example.test";');
  return import("data:text/javascript;base64," + Buffer.from(executable).toString("base64"));
}

test("el formulario no mantiene consultas en localStorage ni simula envíos", () => {
  const source = read("src/components/contact.js");
  assert.doesNotMatch(source, /localStorage|renderInbox|setTimeout\(/);
  assert.match(source, /await sendContact\(data\)/);
  assert.match(source, /name="website"/);
  assert.match(source, /No incluyas datos clínicos/);
});

test("la API Key no aparece en el código de la web estática", () => {
  const code = read("src/components/contact.js") + read("src/services/contact.service.js");
  assert.doesNotMatch(code, /RESEND_API_KEY|api\.resend\.com|re_[a-zA-Z0-9]{16,}/);
});

test("el cliente comunica éxito solo después de una respuesta correcta", async () => {
  const { sendContact } = await loadClient();
  const previous = global.fetch;
  let request;
  global.fetch = async (url, init) => {
    request = { url, init };
    return new Response(JSON.stringify({ status: "ok", message: "Enviado" }), {
      status: 200, headers: { "content-type": "application/json" }
    });
  };
  try {
    const result = await sendContact({ fullName: "Ana" });
    assert.equal(result.status, "ok");
    assert.equal(request.url, "https://coinpsi-api.example.test/api/v1/contact");
    assert.equal(request.init.method, "POST");
    assert.equal(request.init.headers["Content-Type"], "application/json");
  } finally {
    global.fetch = previous;
  }
});

test("el cliente rechaza errores 503 y no presenta éxito", async () => {
  const { sendContact } = await loadClient();
  const previous = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ error: "CONTACT_UNAVAILABLE" }), {
    status: 503, headers: { "content-type": "application/json" }
  });
  try {
    await assert.rejects(sendContact({}), /formulario no está disponible temporalmente/);
  } finally {
    global.fetch = previous;
  }
});

test("un error de validación de servidor conserva detalle de campos", async () => {
  const { sendContact } = await loadClient();
  const previous = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({
    error: "VALIDATION_ERROR",
    fields: { email: "Formato inválido" },
    message: "Revise los campos"
  }), { status: 422, headers: { "content-type": "application/json" } });
  try {
    await assert.rejects(sendContact({}), (error) =>
      error.code === "VALIDATION_ERROR" && error.fields.email === "Formato inválido");
  } finally {
    global.fetch = previous;
  }
});
