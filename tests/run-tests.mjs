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

test("el formulario mapea sin huecos las columnas C a AG", () => {
  assert.equal(FORM_SCHEMA.length, 6);
  assert.equal(ALL_FIELDS.length, 31);
  const expected = Array.from({ length: 31 }, (_, index) => excelColumn(index + 3));
  assert.deepEqual(ALL_FIELDS.map((field) => field.column), expected);
  assert.equal(new Set(ALL_FIELDS.map((field) => field.id)).size, 31);
});

test("todas las listas contienen opciones válidas y sin duplicados", () => {
  for (const field of ALL_FIELDS.filter((item) => item.type === "select")) {
    assert.ok(field.options.length >= 2, `${field.id} requiere al menos dos opciones`);
    assert.equal(new Set(field.options).size, field.options.length, `${field.id} contiene opciones duplicadas`);
  }
});

test("las nuevas reglas condicionales están configuradas", () => {
  assert.deepEqual(FIELD_BY_ID.ubicacion.dependsOn, { field: "riesgoInundacion", equals: "Si" });
  assert.deepEqual(FIELD_BY_ID.estadoSuciedadRejilla.dependsOn, { field: "ductosVentilacion", equals: "Si" });
  assert.deepEqual(FIELD_BY_ID.estadoPerdidaAceite.dependsOn, { field: "perdidaAceite", equals: "Si" });
  for (const id of ["ventilacionCantidad", "ventilacionOperatividad", "ventiladorCubierta", "presentaBakelita", "estadoConexionado", "baseSoporteTermicoTimer"]) {
    assert.deepEqual(FIELD_BY_ID[id].dependsOn, { field: "ventilacionPresenta", equals: "Si" });
  }
});

test("las opciones solicitadas están presentes", () => {
  assert.deepEqual(FIELD_BY_ID.tipoTapa.options, ["Tipo plancha", "Tipo rejilla", "Tipo mixta"]);
  assert.deepEqual(FIELD_BY_ID.estadoConexionado.options, ["Buen estado", "Desconectado", "Descolgado", "Sin tubo corrugado", "No tiene"]);
  assert.deepEqual(FIELD_BY_ID.baseSoporteTermicoTimer.options, ["Buen estado", "Descolgado", "Sin soporte madera"]);
  assert.deepEqual(FIELD_BY_ID.estadoPerdidaAceite.options, ["Mancha activa", "Mancha seca", "No tiene"]);
  assert.deepEqual(FIELD_BY_ID.estadoTablero.options, ["Presenta agujeros", "Corroído", "No cuenta con pernos de anclaje", "Conforme"]);
});

test("la lista de acceso contiene exactamente los cinco inspectores", () => {
  assert.equal(APP_CONFIG.inspectorUsers.length, 5);
  assert.equal(new Set(APP_CONFIG.inspectorUsers).size, 5);
  assert.ok(APP_CONFIG.inspectorUsers.includes("Rodriguez Cabriles Oscar Enrique"));
  assert.ok(APP_CONFIG.inspectorUsers.includes("Quispe Massa Cesar Hipolito"));
});
