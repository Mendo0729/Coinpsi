# COINPSI — Sitio web público

Web institucional de COINPSI implementada con HTML, CSS y JavaScript modular. Su despliegue en Render utiliza **Static Site** y publica únicamente la carpeta `dist/`.

## Dependencias

**No hay dependencias externas de npm.** El proyecto utiliza Node.js para construir el sitio estático y para facilitar un servidor de desarrollo local. El script de compilación y el generador de metadatos SEO usan exclusivamente `node:fs` y `node:path`. El servidor local usa `node:http` y `node:fs/promises`, en lugar de Express.

Las fuentes de Google Fonts y los servicios remotos usados por el navegador, incluida Coinpsi-API, son recursos de ejecución distintos de las dependencias npm.

## Comandos

- `npm ci`: verifica el archivo de bloqueo sin instalar paquetes externos.
- `npm run build`: crea `dist/`, copia los recursos e inyecta SEO y la URL de la API.
- `npm start`: servidor local en `http://localhost:3000`.
- `npm run dev`: servidor local usando `.env.development` (archivo local, no se publica).
- `npm test`: verifica servidor, recursos, SEO y manifiestos.
- `npm audit`: revisa las dependencias npm.

## Render

- Tipo de servicio: **Static Site**.
- Build command: `npm ci && npm run build`.
- Publish directory: `dist`.
- Variable de entorno opcional: `API_BASE_URL` (valor predeterminado en el build: `https://coinpsi-api.mendotech.lat`).

El archivo `seo/seo.config.json` se utiliza únicamente durante la compilación. La salida contiene el título, la descripción, el canonical y los datos estructurados generados para el dominio `https://coinpsi.org/`.

## Formulario de contacto

La web envía consultas a `POST /api/v1/contact` en la API de COINPSI. El formulario comunica éxito **solo** cuando la API confirma que el proveedor Resend aceptó la solicitud. Los errores de red, validación y límite de envíos se muestran a la persona sin borrar los datos del formulario.

El formulario ya no guarda consultas ni datos personales en `localStorage` y no presenta una falsa bandeja de entrada pública. El backend debe configurar `RESEND_API_KEY` en Render (nunca en esta web estática). No se agregan dependencias al frontend.

La primera entrega no almacena consultas en PostgreSQL: la información solo se envía al buzón institucional `info@coinpsi.org`. No incluir datos clínicos sensibles.
