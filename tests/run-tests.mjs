import assert from "node:assert/strict";
import test from "node:test";
import { APP_CONFIG } from "../assets/js/config.js";
import { BASE_RECORDS } from "../assets/js/data/base-records.js";
import { ALL_FIELDS, FIELD_BY_ID, FORM_SCHEMA } from "../assets/js/data/form-schema.js";
import { createLookupService } from "../assets/js/services/lookup-service.js";
import { findSuggestions } from "../assets/js/components/autocomplete.js";

function excelColumn(number) {
  let value = number;
  let result = "";
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
}

test("el catálogo conserva los 533 registros del libro", () => {
  assert.equal(BASE_RECORDS.length, 533);
  assert.equal(new Set(BASE_RECORDS.map((row) => row.numero.toUpperCase())).size, 533);
  assert.ok(BASE_RECORDS.every((row) => row.numero && row.alimentador));
});

test("la búsqueda es exacta, tolera espacios y no distingue mayúsculas", () => {
  const lookup = createLookupService(BASE_RECORDS);
  assert.deepEqual(lookup.findByNumber(" 05008c "), { alimentador: "B07", numero: "05008C" });
  assert.equal(lookup.findByNumber("NO-EXISTE"), null);
});

test("las sugerencias muestran coincidencias con SED y alimentador", () => {
  const suggestions = findSuggestions(BASE_RECORDS, "051", 8);
  assert.ok(suggestions.length > 1 && suggestions.length <= 8);
  assert.ok(suggestions.every((row) => row.numero.includes("051") || row.alimentador.includes("051")));
  assert.ok(suggestions.every((row) => row.numero && row.alimentador));
});

test("el formulario conserva C–AJ, usa AL–BK y no ocupa AK", () => {
  assert.equal(FORM_SCHEMA.length, 10);
  assert.equal(ALL_FIELDS.length, 82);
  const expected = [
    ...Array.from({ length: 34 }, (_, index) => excelColumn(index + 3)),
    ...Array.from({ length: 26 }, (_, index) => excelColumn(index + 38)),
  ].sort();
  const dataFields = ALL_FIELDS.filter((field) => field.column);
  assert.deepEqual(dataFields.map((field) => field.column).sort(), expected);
  assert.equal(dataFields.length, 60);
  assert.equal(new Set(ALL_FIELDS.map((field) => field.id)).size, 82);
  assert.ok(!ALL_FIELDS.some((field) => field.column === "AK"));
});

test("todas las listas contienen opciones válidas y sin duplicados", () => {
  for (const field of ALL_FIELDS.filter((item) => ["select", "multiselect"].includes(item.type))) {
    assert.ok(field.options.length >= 2, `${field.id} requiere al menos dos opciones`);
    assert.equal(new Set(field.options).size, field.options.length, `${field.id} contiene opciones duplicadas`);
  }
});

test("las nuevas reglas condicionales están configuradas", () => {
  assert.deepEqual(FIELD_BY_ID.ubicacion.dependsOn, { field: "riesgoInundacion", equals: "Si" });
  assert.deepEqual(FIELD_BY_ID.estadoSuciedadRejilla.dependsOn, { field: "ductosVentilacion", equals: "Si" });
  assert.deepEqual(FIELD_BY_ID.nivelSuciedadDuctos.dependsOn, { field: "ductosVentilacion", equals: "Si" });
  assert.deepEqual(FIELD_BY_ID.estadoPerdidaAceite.dependsOn, { field: "perdidaAceite", equals: "Si" });
  assert.deepEqual(FIELD_BY_ID.componenteRuido.dependsOn, { field: "presentaRuido", equals: "Si" });
  assert.deepEqual(FIELD_BY_ID.cantidadDecibeles.dependsOn, { field: "presentaRuido", equals: "Si" });
  for (const id of ["ventilacionCantidad", "ventilacionOperatividad", "ventiladorCubierta", "presentaBakelita", "estadoConexionado", "baseSoporteTermicoTimer"]) {
    assert.deepEqual(FIELD_BY_ID[id].dependsOn, { field: "ventilacionPresenta", equals: "Si" });
  }
});

test("las opciones solicitadas están presentes", () => {
  assert.deepEqual(FIELD_BY_ID.tipoTapa.options, ["Tipo plancha", "Tipo rejilla", "Tipo mixta"]);
  assert.deepEqual(FIELD_BY_ID.estadoConexionado.options, ["Desconectado", "Fijado sin tubo corrugado", "Fijado con tubo corrugado", "Descolgado sin tubo corrugado", "Descolgado con tubo corrugado"]);
  assert.deepEqual(FIELD_BY_ID.baseSoporteTermicoTimer.options, ["Con soporte de madera", "Soldado a la rejilla", "Descolgado"]);
  assert.deepEqual(FIELD_BY_ID.estadoPerdidaAceite.options, ["Mancha activa", "Mancha seca", "No tiene"]);
  assert.equal(FIELD_BY_ID.estadoTablero.type, "multiselect");
  assert.equal(FIELD_BY_ID.estadoTablero.options.length, 7);
  assert.equal(FIELD_BY_ID.estadoTablero.exclusiveOption, "Conforme");
  assert.equal(FIELD_BY_ID.estadoConectoresCodo.type, "multiselect");
  assert.deepEqual(FIELD_BY_ID.taponBushing.options, ["Si (normado)", "Si (simple)", "No"]);
  assert.deepEqual(FIELD_BY_ID.transformadorCuentaTapon.options, ["Transporte (rojo)", "Servicio (verde)", "Gris con ranura", "Gris sin ranura"]);
  assert.deepEqual(FIELD_BY_ID.incidenciaSolTapa.options, ["Mañana", "Tarde", "Mañana y tarde"]);
  assert.deepEqual(FIELD_BY_ID.ventilacionSensacionTermica.options, ["Baja", "Media", "Alta"]);
  assert.deepEqual(FIELD_BY_ID.soporteCableMT.options, ["Si tiene", "No tiene"]);
  assert.deepEqual(FIELD_BY_ID.estadoCableBT.options, ["Buen estado", "Pérdida de aislamiento"]);
  assert.deepEqual(FIELD_BY_ID.anomaliaLlavesCableBT.options, ["Si", "No"]);
  assert.deepEqual(FIELD_BY_ID.presentaRuido.options, ["Si", "No"]);
  assert.deepEqual(FIELD_BY_ID.componenteRuido.options, ["Conector codo", "Borne de B.T.", "Portafusible", "Cuba del transformador"]);
});

test("los campos de medición muestran las unidades correctas", () => {
  for (const id of ["corrienteR", "corrienteS", "corrienteT"]) assert.equal(FIELD_BY_ID[id].unit, "A");
  for (const field of ALL_FIELDS.filter((item) => item.id.startsWith("temperatura"))) assert.equal(field.unit, "°C");
  assert.equal(FIELD_BY_ID.cantidadDecibeles.unit, "dB");
  assert.equal(FIELD_BY_ID.profundidadSueloRejilla.unit, "m");
  assert.equal(FIELD_BY_ID.profundidadSueloPlataforma.unit, "m");
});

test("la pantalla Fotos solicita 21 imágenes y permite una anomalía opcional", () => {
  const photos = ALL_FIELDS.filter((field) => field.type === "file");
  assert.equal(photos.length, 22);
  const requiredImages = photos.reduce((sum, field) => sum + (field.required ? (field.minFiles ?? 1) : 0), 0);
  const maximumImages = photos.reduce((sum, field) => sum + (field.maxFiles ?? 1), 0);
  assert.equal(requiredImages, 21);
  assert.equal(maximumImages, 22);
  assert.equal(FIELD_BY_ID.fotoBovedaAnomalia.required, false);
  assert.ok(["fotoCorrienteR", "fotoCorrienteS", "fotoCorrienteT"].every((id) => FIELD_BY_ID[id].required));
  assert.ok(["fotoTermicaCodo01", "fotoTermicaCodo02"].every((id) => FIELD_BY_ID[id].required));
  assert.ok(["fotoUltrasonidoCodo01", "fotoUltrasonidoCodo02"].every((id) => FIELD_BY_ID[id].required));
});

test("la versión y los límites de fotos corresponden a la versión 4", () => {
  assert.equal(APP_CONFIG.schemaVersion, "4.0.0");
  assert.equal(APP_CONFIG.photos.maxDimension, 1600);
  assert.ok(APP_CONFIG.photos.maxPayloadBytes > APP_CONFIG.photos.maxInputBytes);
});

test("la lista de acceso contiene exactamente los cinco inspectores", () => {
  assert.equal(APP_CONFIG.inspectorUsers.length, 5);
  assert.equal(new Set(APP_CONFIG.inspectorUsers).size, 5);
  assert.ok(APP_CONFIG.inspectorUsers.includes("Rodriguez Cabriles Oscar Enrique"));
  assert.ok(APP_CONFIG.inspectorUsers.includes("Quispe Massa Cesar Hipolito"));
});
