# Formulario de inspección de bóvedas

Aplicación web estática construida a partir de `InfoBase.xlsx`. Permite buscar cualquiera de los 533 números de la columna B mediante sugerencias instantáneas que muestran SED y alimentador, completar los campos C–Z y enviar una fila normalizada a un flujo de Power Automate.

## Uso

1. Sirve la carpeta mediante un servidor web local (no abras `index.html` con doble clic, porque utiliza módulos JavaScript).
2. Busca un número, por ejemplo `05008C`.
3. Completa las secciones. El borrador se guarda automáticamente en el dispositivo.
4. Envía la inspección. La integración con Power Automate ya está configurada en el código.

Para una revisión local con las dependencias incluidas en tu equipo:

```bash
npm test
npm run serve
```

Luego abre `http://localhost:8080`.

## Contrato enviado a Power Automate

El cuerpo es JSON, enviado como `text/plain;charset=UTF-8` en modo compatible con sitios estáticos para evitar bloqueos CORS. El navegador confirma que la solicitud salió, mientras que el historial del flujo es la fuente de verdad de su procesamiento. El objeto contiene:

- `schemaVersion`, `submissionId` y `submittedAt`.
- `asset`: alimentador y número encontrado.
- `inspection`: respuestas con nombres estables.
- `excelRow`: valores ya ordenados por letras A–Z; esta es la rama más sencilla para escribir una fila en Excel.
- `source`: metadatos básicos de la aplicación.

En Power Automate, usa un disparador **Cuando se recibe una solicitud HTTP**, convierte el cuerpo a JSON si el diseñador lo entrega como texto y agrega una fila a una tabla de Excel usando `excelRow.A` … `excelRow.Z`.

## Configuración segura

La URL del flujo está configurada en `assets/js/config.js` para que todos los dispositivos puedan enviar sin preparación manual. **Importante:** la firma queda incluida en el código publicado y debe regenerarse si el acceso al sitio no es estrictamente controlado.

El catálogo de números y alimentadores sí forma parte del sitio. Si esa información es sensible, no publiques el sitio en un repositorio o GitHub Pages público; usa alojamiento con acceso restringido.

## Actualizar la base

El catálogo vive en `assets/js/data/base-records.js` y el cuestionario en `assets/js/data/form-schema.js`. Al recibir una nueva versión de Excel:

1. Regenera únicamente `base-records.js` si solo cambian los números/alimentadores.
2. Edita `form-schema.js` si cambian preguntas u opciones.
3. Mantén `column` con la letra Excel correspondiente.
4. Ejecuta `npm test`; la prueba detecta duplicados, huecos C–Z y opciones inválidas.

## Despliegue en GitHub

El flujo `.github/workflows/pages.yml` prueba y publica el sitio al hacer `push` a `main`. En el repositorio, habilita **Settings → Pages → Source: GitHub Actions**.

## Estructura

```text
index.html
assets/
  css/styles.css
  js/
    app.js
    config.js
    components/
    data/
    services/
tests/run-tests.mjs
.github/workflows/pages.yml
```

No hay framework ni librerías remotas: el sitio funciona con HTML, CSS y módulos JavaScript nativos, reduciendo mantenimiento y riesgo de dependencias rotas.
