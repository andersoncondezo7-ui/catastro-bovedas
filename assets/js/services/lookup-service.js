function normalize(value) {
  return String(value ?? "").trim().toLocaleUpperCase("es-PE");
}

export function createLookupService(records) {
  const byNumber = new Map(records.map((record) => [normalize(record.numero), record]));

  return Object.freeze({
    findByNumber(number) {
      const normalized = normalize(number);
      return normalized ? byNumber.get(normalized) ?? null : null;
    },
    size: byNumber.size,
  });
}
