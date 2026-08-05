# Formulario de inspección de bóvedas

Aplicación web estática construida a partir de `InfoBase.xlsx`. Permite identificar al inspector, buscar cualquiera de los 533 números de SED y completar la inspección desde celular o computadora mediante pantallas con barra de progreso.

## Uso

1. Selecciona uno de los cinco usuarios autorizados y pulsa **Continuar**.
2. Busca un número de SED, por ejemplo `05008C`.
3. Completa las seis secciones. Las preguntas dependientes aparecen únicamente cuando corresponde.
4. Revisa y envía la inspección. La integración con Power Automate ya está configurada en el código.

El borrador se guarda por usuario y SED en el dispositivo. La opción **Cambiar usuario** regresa a la pantalla inicial sin borrar los borradores guardados.

## Contrato enviado a Power Automate

El cuerpo se envía como JSON mediante `text/plain;charset=UTF-8`. Incluye:

- `schemaVersion`, `submissionId` y `submittedAt`.
- `inspector.name`: usuario que inició la inspección.
- `asset`: alimentador y número de SED.
- `inspection`: las 34 respuestas con nombres estables.
- `excelRow`: alimentador y SED en A–B, respuestas en C–AJ e inspector en AK.
- `source`: metadatos básicos de la aplicación.

En Power Automate, el esquema y la acción de Excel deben contemplar `excelRow.A` hasta `excelRow.AK`. Las columnas C–AG conservan su asignación anterior; las preguntas nuevas usan AH–AJ y el inspector usa AK.

## Desarrollo local

```bash
npm test
npm run serve
```

Luego abre `http://localhost:8080`.

## Configuración

La URL del flujo está centralizada en `assets/js/config.js`, junto con la lista de usuarios y la versión del esquema. El catálogo vive en `assets/js/data/base-records.js` y el cuestionario en `assets/js/data/form-schema.js`.

## Despliegue en GitHub

El flujo `.github/workflows/pages.yml` ejecuta las pruebas y publica el sitio al hacer `push` a `main`.

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
