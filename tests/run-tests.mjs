import assert from "node:assert/strict";
import test from "node:test";
import { BASE_RECORDS } from "../assets/js/data/base-records.js";
import { ALL_FIELDS, FORM_SCHEMA } from "../assets/js/data/form-schema.js";
import { createLookupService } from "../assets/js/services/lookup-service.js";
import { findSuggestions } from "../assets/js/components/autocomplete.js";

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

test("el formulario mapea sin huecos las columnas C a Z", () => {
  assert.equal(FORM_SCHEMA.length, 5);
  assert.equal(ALL_FIELDS.length, 24);
  const expected = Array.from({ length: 24 }, (_, index) => String.fromCharCode("C".charCodeAt(0) + index));
  assert.deepEqual(ALL_FIELDS.map((field) => field.column), expected);
  assert.equal(new Set(ALL_FIELDS.map((field) => field.id)).size, 24);
});

test("todas las listas contienen opciones válidas y sin duplicados", () => {
  for (const field of ALL_FIELDS.filter((item) => item.type === "select")) {
    assert.ok(field.options.length >= 2, `${field.id} requiere al menos dos opciones`);
    assert.equal(new Set(field.options).size, field.options.length, `${field.id} contiene opciones duplicadas`);
  }
});
