const yesNo = Object.freeze(["Si", "No"]);

export const FORM_SCHEMA = Object.freeze([
  {
    id: "entorno",
    title: "Condiciones del entorno",
    description: "Características de acceso, superficie y condiciones visibles.",
    fields: [
      { id: "riesgoInundacion", column: "C", label: "Riesgo de ubicación", type: "select", options: yesNo, required: true },
      { id: "ubicacion", column: "D", label: "Motivo", type: "select", options: ["Parque", "Pendiente", "Cercano a canal de regadío", "Terreno en depresión (Zona de acumulación de agua)"], required: true, dependsOn: { field: "riesgoInundacion", equals: "Si" } },
      { id: "tipoTerreno", column: "E", label: "Tipo de terreno", type: "select", options: ["Concreto/Vereda", "Tierra"], required: true },
      { id: "tipoTransito", column: "F", label: "Tipo de tránsito", type: "select", options: ["Zona Alta Densidad", "Zona Media Densidad", "Zona Baja Densidad"], required: true },
      { id: "tipoTapa", column: "G", label: "Tipo de tapa", type: "select", options: ["Tipo plancha", "Tipo rejilla", "Tipo mixta"], required: true },
      { id: "ductosVentilacion", column: "H", label: "Presenta ductos de ventilación", type: "select", options: yesNo, required: true },
      { id: "estadoSuciedadRejilla", column: "I", label: "Estado de suciedad de la tapa de la bóveda", type: "select", options: ["A: Alto", "B: Medio", "C: Bajo"], required: true, dependsOn: { field: "ductosVentilacion", equals: "Si" } },
      { id: "nivelSuciedadContorno", column: "J", label: "Nivel de suciedad en contorno del transformador", help: "Mide la distancia desde la tapa hasta el tope.", type: "select", options: ["Entre 0 a 1 metro: Tipo A", "Entre 1 a 1.5 metro: Tipo B", "Mayor a 1.5 metro: Tipo C"], required: true },
    ],
  },
  {
    id: "dimensionamiento",
    title: "Dimensionamiento",
    description: "Medidas internas expresadas en metros.",
    fields: [
      { id: "largoMetros", column: "K", label: "Largo (m)", type: "number", min: 0, step: 0.01, required: true },
      { id: "anchoMetros", column: "L", label: "Ancho (m)", type: "number", min: 0, step: 0.01, required: true },
    ],
  },
  {
    id: "paredes",
    title: "Paredes internas de la SEC",
    description: "Acabado y condición general de las paredes.",
    fields: [
      { id: "acabadoParedes", column: "M", label: "Acabado de paredes", type: "select", options: ["Con Tarrajeo", "Sin Tarrajeo"], required: true },
      { id: "condicionParedes", column: "N", label: "Condición", type: "select", options: ["A: Desmoronamiento", "B: Fisuras/Rajaduras", "C: Buen estado"], required: true },
    ],
  },
  {
    id: "ventilacion",
    title: "Ventilación",
    description: "Evaluación de ventiladores y sus elementos asociados.",
    fields: [
      { id: "ventilacionPresenta", column: "O", label: "Cuenta con ventilador", type: "select", options: yesNo, required: true },
      { id: "ventilacionSensacionTermica", column: "AH", label: "Ventilación (Sensación térmica)", type: "select", options: ["Baja", "Media", "Alta"], required: true },
      { id: "ventilacionCantidad", column: "P", label: "Cantidad", type: "number", min: 1, step: 1, required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "ventilacionOperatividad", column: "Q", label: "Operatividad", type: "select", options: ["Funciona", "No funciona"], required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "ventiladorCubierta", column: "R", label: "Ventilador cuenta con plancha de protección al motor", type: "select", options: yesNo, required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "presentaBakelita", column: "S", label: "Ventilador fijado con bakelita", type: "select", options: yesNo, required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "estadoConexionado", column: "T", label: "Estado del conexionado", type: "select", options: ["Buen estado", "Desconectado", "Descolgado", "Sin tubo corrugado", "No tiene"], required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "baseSoporteTermicoTimer", column: "U", label: "Estado del timer", type: "select", options: ["Buen estado", "Descolgado", "Sin soporte madera"], required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
    ],
  },
  {
    id: "transformador",
    title: "Transformador MTBT",
    description: "Estado y componentes asociados al transformador.",
    fields: [
      { id: "portafusibleMT", column: "V", label: "Portafusible MT", type: "select", options: ["Totalmente Cerrado", "Parcialmente Cerrado (Sobresale)"], required: true },
      { id: "presentaMastilBT", column: "W", label: "Presenta mástil BT", type: "select", options: yesNo, required: true },
      { id: "estadoSuciedadPlataforma", column: "X", label: "Estado de suciedad de plataforma", type: "select", options: ["A: Alto", "B: Medio", "C: Bajo"], required: true },
      { id: "perdidaAceite", column: "Y", label: "Presenta pérdida de aceite", type: "select", options: yesNo, required: true },
      { id: "taponBushing", column: "Z", label: "Presenta tapón en bushing (final de línea)", type: "select", options: yesNo, required: true },
      { id: "estadoPerdidaAceite", column: "AA", label: "Estado de la pérdida de aceite", type: "select", options: ["Mancha activa", "Mancha seca", "No tiene"], required: true, dependsOn: { field: "perdidaAceite", equals: "Si" } },
    ],
  },
  {
    id: "tableroConexiones",
    title: "Tablero y conexiones",
    description: "Verificación de conectores, pozo, tapas y tablero.",
    fields: [
      { id: "conectorCodoTierra", column: "AB", label: "Conector codo conectado a tierra", type: "select", options: ["Si", "No", "Seccionado"], required: true },
      { id: "cuentaPozoMT", column: "AC", label: "Cuenta con pozo MT", type: "select", options: ["Si", "No", "No visible"], required: true },
      { id: "tapaAseguradaBisagra", column: "AD", label: "Tapa se encuentra asegurada a bisagra", type: "select", options: yesNo, required: true },
      { id: "circuitosRotulacion", column: "AE", label: "Los circuitos cuentan con rotulación", type: "select", options: ["Si", "No", "Ilegible"], required: true },
      { id: "estadoTablero", column: "AF", label: "Estado del tablero", type: "select", options: ["Presenta agujeros", "Corroído", "No cuenta con pernos de anclaje", "Conforme"], required: true },
      { id: "estadoConectoresCodo", column: "AG", label: "Estado de conectores codo", type: "select", options: ["Hinchados", "Descarga en adaptadores", "Cable a tierra cortado"], required: true },
      { id: "soporteCableMT", column: "AI", label: "Soporte de cable en MT", type: "select", options: ["Si tiene", "No tiene"], required: true },
      { id: "estadoCableBT", column: "AJ", label: "Estado de cable de BT", type: "select", options: ["Buen estado", "Pérdida de aislamiento"], required: true },
    ],
  },
  {
    id: "parametrosElectricos",
    title: "Parámetros eléctricos",
    description: "Registro de corrientes por fase en amperios.",
    fields: [
      { id: "corrienteR", column: "AL", label: "Corriente R", type: "number", min: 0, step: 0.1, unit: "A", required: true },
      { id: "corrienteS", column: "AM", label: "Corriente S", type: "number", min: 0, step: 0.1, unit: "A", required: true },
      { id: "corrienteT", column: "AN", label: "Corriente T", type: "number", min: 0, step: 0.1, unit: "A", required: true },
    ],
  },
  {
    id: "parametrosTemperatura",
    title: "Parámetros de temperatura",
    description: "Mediciones de temperatura por fase y componente, expresadas en grados Celsius.",
    fields: [
      { id: "temperaturaCodosTerna01R", column: "AO", label: "Temperatura en codos · Terna 01 · R", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCodosTerna01S", column: "AP", label: "Temperatura en codos · Terna 01 · S", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCodosTerna01T", column: "AQ", label: "Temperatura en codos · Terna 01 · T", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCodosTerna02R", column: "AR", label: "Temperatura en codos · Terna 02 · R", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCodosTerna02S", column: "AS", label: "Temperatura en codos · Terna 02 · S", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCodosTerna02T", column: "AT", label: "Temperatura en codos · Terna 02 · T", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaBornesBTR", column: "AU", label: "Temperatura en bornes de B.T. · R", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaBornesBTS", column: "AV", label: "Temperatura en bornes de B.T. · S", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaBornesBTT", column: "AW", label: "Temperatura en bornes de B.T. · T", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCableComunicacionR", column: "AX", label: "Temperatura en cable de comunicación · R", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCableComunicacionS", column: "AY", label: "Temperatura en cable de comunicación · S", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCableComunicacionT", column: "AZ", label: "Temperatura en cable de comunicación · T", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "temperaturaCuba", column: "BA", label: "Temperatura en cuba", type: "number", step: 0.1, unit: "°C", required: true },
      { id: "anomaliaLlavesCableBT", column: "BB", label: "Presenta anomalía en llaves o cable de salida de B.T.", type: "select", options: yesNo, required: true },
    ],
  },
  {
    id: "parametroDecibeles",
    title: "Parámetro de decibeles",
    description: "Evaluación de ruido y medición de su intensidad.",
    fields: [
      { id: "presentaRuido", column: "BC", label: "Presenta ruido", type: "select", options: yesNo, required: true },
      { id: "componenteRuido", column: "BD", label: "¿En qué componente?", type: "select", options: ["Conector codo", "Borne de B.T.", "Portafusible", "Cuba del transformador"], required: true, dependsOn: { field: "presentaRuido", equals: "Si" } },
      { id: "cantidadDecibeles", column: "BE", label: "Cantidad de decibeles", type: "number", min: 0, step: 0.1, unit: "dB", required: true, dependsOn: { field: "presentaRuido", equals: "Si" } },
    ],
  },
]);

export const ALL_FIELDS = Object.freeze(FORM_SCHEMA.flatMap((section) => section.fields));
export const FIELD_BY_ID = Object.freeze(Object.fromEntries(ALL_FIELDS.map((field) => [field.id, field])));
