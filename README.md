# Formulario de inspección de bóvedas

Aplicación web estática construida a partir de `InfoBase.xlsx`. Permite identificar al inspector, buscar cualquiera de los 533 números de SED y completar la inspección desde celular o computadora mediante pantallas con barra de progreso.

## Uso

1. Selecciona uno de los cinco usuarios autorizados y pulsa **Continuar**.
2. Busca un número de SED, por ejemplo `05008C`.
3. Completa las secciones. Las preguntas dependientes aparecen únicamente cuando corresponde. La última pantalla ("Comentarios generales") permite anotar de forma opcional cualquier anomalía no contemplada.
4. Revisa y envía la inspección. La integración con Power Automate ya está configurada en el código.

El borrador de las respuestas se guarda por usuario y SED en el dispositivo. Por seguridad y espacio, las fotografías deben volver a seleccionarse si se recarga la página.

## Contrato enviado a Power Automate

El cuerpo se envía como JSON mediante `text/plain;charset=UTF-8`. Incluye:

- `schemaVersion`, `submissionId` y `submittedAt`.
- `inspector.name`: usuario que inició la inspección.
- `asset`: alimentador y número de SED.
- `inspection`: las respuestas técnicas y el comentario general; las selecciones múltiples se conservan como listas.
- `excelRow`: fecha en A, alimentador y SED en B–C, inspector en D y las 64 respuestas en E–BP siguiendo exactamente el orden de las pantallas. La columna BP contiene el comentario general opcional.
- `photos`: 21 fotografías obligatorias y una evidencia opcional, comprimidas como JPEG y codificadas en Base64.
- `photoSummary`: cantidad de fotos y tamaño total comprimido.
- `source`: metadatos básicos de la aplicación.

En Power Automate, el esquema y la acción de Excel deben contemplar `excelRow.A` hasta `excelRow.BP`. Los datos generales ocupan A–D y las respuestas se guardan secuencialmente en E–BP según el orden de las pantallas.

Las fotos deben guardarse en SharePoint, OneDrive u otro repositorio usando `photos[].contentBase64`; no se almacenan dentro de celdas de Excel.

## Mediciones

- **Parámetros eléctricos:** corrientes R, S y T en amperios (A).
- **Parámetros de temperatura:** codos de las ternas 01 y 02, bornes B.T., cable de comunicación y cuba en grados Celsius (°C).
- **Parámetro de decibeles:** ruido, componente asociado y cantidad en dB.

## Evidencia fotográfica

Las pantallas de fotos contienen controles separados para cada imagen: panorámicas, tablero, bóveda, corrientes, imágenes térmicas y ultrasonido. Cada control permite tomar la foto con la cámara o elegirla desde la galería del celular, de modo que si la aplicación se cierra no es necesario repetir las fotos ya capturadas. La aplicación reduce cada imagen a un máximo de 1600 px y controla el tamaño total antes de enviarla.

## Desarrollo local

```bash
npm test
npm run serve
```

Luego abre `http://localhost:8080`.

## Configuración

La URL del flujo está centralizada en `assets/js/config.js`, junto con la lista de usuarios, límites de fotos y versión del esquema. El catálogo vive en `assets/js/data/base-records.js` y el cuestionario en `assets/js/data/form-schema.js`.

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
