const yesNo = Object.freeze(["Si", "No"]);

export const FORM_SCHEMA = Object.freeze([
  {
    id: "entorno",
    title: "Condiciones del entorno",
    description: "Características de acceso, superficie y condiciones visibles.",
    fields: [
      { id: "riesgoInundacion", column: "C", label: "Riesgo de inundación", type: "select", options: yesNo, required: true },
      { id: "ubicacion", column: "D", label: "Ubicación", type: "select", options: ["Pendiente", "Base de Olla"], required: true },
      { id: "tipoTerreno", column: "E", label: "Tipo de terreno", type: "select", options: ["Concreto/Vereda", "Tierra"], required: true },
      { id: "tipoTransito", column: "F", label: "Tipo de tránsito", type: "select", options: ["Zona Alta Densidad", "Zona Media Densidad", "Zona Baja Densidad"], required: true },
      { id: "tipoTapa", column: "G", label: "Tipo de tapa", type: "select", options: ["Tipo Plancha", "Tipo Ranura"], required: true },
      { id: "ductosVentilacion", column: "H", label: "Presenta ductos de ventilación", type: "select", options: yesNo, required: true },
      { id: "estadoSuciedadRejilla", column: "I", label: "Estado de suciedad de rejilla", type: "select", options: ["A: Alto", "B: Medio", "C: Bajo"], required: true },
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
      { id: "ventilacionPresenta", column: "O", label: "Presenta ventilación", type: "select", options: yesNo, required: true },
      { id: "ventilacionCantidad", column: "P", label: "Cantidad", type: "number", min: 1, step: 1, required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "ventilacionOperatividad", column: "Q", label: "Operatividad", type: "select", options: ["Funciona", "No funciona"], required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "ventiladorCubierta", column: "R", label: "Ventilador presenta cubierta", type: "select", options: yesNo, required: true, dependsOn: { field: "ventilacionPresenta", equals: "Si" } },
      { id: "presentaBakelita", column: "S", label: "Presenta bakelita", type: "select", options: yesNo, required: true },
      { id: "estadoConexionado", column: "T", label: "Estado del conexionado", type: "select", options: ["Buen estado", "Mal estado"], required: true },
      { id: "baseSoporteTermicoTimer", column: "U", label: "Base soporte térmico + timer", type: "select", options: yesNo, required: true },
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
    ],
  },
]);

export const ALL_FIELDS = Object.freeze(FORM_SCHEMA.flatMap((section) => section.fields));
export const FIELD_BY_ID = Object.freeze(Object.fromEntries(ALL_FIELDS.map((field) => [field.id, field])));
