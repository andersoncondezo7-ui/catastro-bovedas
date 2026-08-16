const BASE_FORM_SCHEMA = Object.freeze([
  {
    "id": "entorno",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Condiciones del entorno",
    "description": "Características de acceso, superficie y condiciones visibles.",
    "fields": [
      {
        "id": "riesgoInundacion",
        "column": "C",
        "label": "Riesgo de ubicación",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      },
      {
        "id": "ubicacion",
        "column": "D",
        "label": "Motivo",
        "type": "select",
        "options": [
          "Parque",
          "Pendiente",
          "Cercano a canal de regadío",
          "Terreno en depresión (Zona de acumulación de agua)"
        ],
        "required": true,
        "dependsOn": {
          "field": "riesgoInundacion",
          "equals": "Si"
        }
      },
      {
        "id": "tipoTerreno",
        "column": "E",
        "label": "Tipo de terreno",
        "type": "select",
        "options": [
          "Concreto/Vereda",
          "Tierra"
        ],
        "required": true
      },
      {
        "id": "tipoTransito",
        "column": "F",
        "label": "Tipo de tránsito",
        "type": "select",
        "options": [
          "Zona Alta Densidad",
          "Zona Media Densidad",
          "Zona Baja Densidad"
        ],
        "required": true
      },
      {
        "id": "tipoTapa",
        "column": "G",
        "label": "Tipo de tapa",
        "type": "select",
        "options": [
          "Tipo plancha",
          "Tipo rejilla",
          "Tipo mixta"
        ],
        "required": true
      },
      {
        "id": "incidenciaSolTapa",
        "column": "BF",
        "label": "Incidencia del sol sobre la tapa de la bóveda",
        "help": "Horario aproximado: mañana de 06:00 a 12:00; tarde de 12:00 a 18:00.",
        "type": "select",
        "options": [
          "Mañana",
          "Tarde",
          "Mañana y tarde"
        ],
        "required": true
      },
      {
        "id": "estadoMarcoBoveda",
        "column": "BG",
        "label": "Estado del marco de la bóveda",
        "type": "select",
        "options": [
          "Conforme",
          "Corroído",
          "Con desprendimiento de concreto",
          "Presenta desnivel"
        ],
        "required": true
      },
      {
        "id": "ductosVentilacion",
        "column": "H",
        "label": "Presenta ductos de ventilación",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      },
      {
        "id": "estadoSuciedadRejilla",
        "column": "I",
        "label": "Estado de suciedad de la tapa de la bóveda",
        "type": "select",
        "options": [
          "A: Alto",
          "B: Medio",
          "C: Bajo"
        ],
        "required": true,
        "dependsOn": {
          "field": "ductosVentilacion",
          "equals": "Si"
        }
      },
      {
        "id": "nivelSuciedadDuctos",
        "column": "BH",
        "label": "Nivel de suciedad",
        "type": "select",
        "options": [
          "Alta",
          "Media",
          "Baja"
        ],
        "required": true,
        "dependsOn": {
          "field": "ductosVentilacion",
          "equals": "Si"
        }
      },
      {
        "id": "nivelSuciedadContorno",
        "column": "J",
        "label": "Nivel de suciedad en bóveda",
        "help": "Clasificación según la profundidad medida en la bóveda.",
        "type": "select",
        "options": [
          "Profundidad entre 0 a 1 metro: Tipo A",
          "Profundidad entre 1 a 1.5 metros: Tipo B",
          "Profundidad mayor a 1.5 metros: Tipo C"
        ],
        "required": true
      }
    ]
  },
  {
    "id": "dimensionamiento",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Dimensionamiento",
    "description": "Medidas internas expresadas en metros.",
    "fields": [
      {
        "id": "largoMetros",
        "column": "K",
        "label": "Largo",
        "type": "number",
        "min": 0,
        "step": 0.01,
        "required": true,
        "unit": "m"
      },
      {
        "id": "anchoMetros",
        "column": "L",
        "label": "Ancho",
        "type": "number",
        "min": 0,
        "step": 0.01,
        "required": true,
        "unit": "m"
      },
      {
        "id": "profundidadSueloRejilla",
        "column": "BI",
        "label": "Profundidad del suelo de la bóveda a la rejilla",
        "type": "number",
        "min": 0,
        "step": 0.01,
        "unit": "m",
        "required": true
      },
      {
        "id": "profundidadSueloPlataforma",
        "column": "BJ",
        "label": "Profundidad del suelo de la bóveda a la plataforma del transformador",
        "type": "number",
        "min": 0,
        "step": 0.01,
        "unit": "m",
        "required": true
      }
    ]
  },
  {
    "id": "paredes",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Paredes internas de la SED",
    "description": "Acabado y condición general de las paredes.",
    "fields": [
      {
        "id": "acabadoParedes",
        "column": "M",
        "label": "Acabado de paredes",
        "type": "select",
        "options": [
          "Con Tarrajeo",
          "Sin Tarrajeo"
        ],
        "required": true
      },
      {
        "id": "condicionParedes",
        "column": "N",
        "label": "Condición",
        "type": "select",
        "options": [
          "A: Desmoronamiento",
          "B: Fisuras/Rajaduras",
          "C: Buen estado"
        ],
        "required": true
      }
    ]
  },
  {
    "id": "ventilacion",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Ventilación",
    "description": "Evaluación de ventiladores y sus elementos asociados.",
    "fields": [
      {
        "id": "ventilacionPresenta",
        "column": "O",
        "label": "Cuenta con ventilador",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      },
      {
        "id": "ventilacionSensacionTermica",
        "column": "AH",
        "label": "Ventilación (Sensación térmica)",
        "type": "select",
        "options": [
          "Baja",
          "Media",
          "Alta"
        ],
        "required": true
      },
      {
        "id": "ventilacionCantidad",
        "column": "P",
        "label": "Cantidad",
        "type": "number",
        "min": 1,
        "step": 1,
        "required": true,
        "dependsOn": {
          "field": "ventilacionPresenta",
          "equals": "Si"
        }
      },
      {
        "id": "ventilacionOperatividad",
        "column": "Q",
        "label": "Operatividad",
        "type": "select",
        "options": [
          "Funciona",
          "No funciona"
        ],
        "required": true,
        "dependsOn": {
          "field": "ventilacionPresenta",
          "equals": "Si"
        }
      },
      {
        "id": "ventiladorCubierta",
        "column": "R",
        "label": "Ventilador cuenta con plancha de protección al motor",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true,
        "dependsOn": {
          "field": "ventilacionPresenta",
          "equals": "Si"
        }
      },
      {
        "id": "presentaBakelita",
        "column": "S",
        "label": "Ventilador aislado con baquelita de la rejilla de bóveda",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true,
        "dependsOn": {
          "field": "ventilacionPresenta",
          "equals": "Si"
        }
      },
      {
        "id": "estadoConexionado",
        "column": "T",
        "label": "Estado del cableado del ventilador",
        "type": "select",
        "options": [
          "Desconectado",
          "Fijado sin tubo corrugado",
          "Fijado con tubo corrugado",
          "Descolgado sin tubo corrugado",
          "Descolgado con tubo corrugado"
        ],
        "required": true,
        "dependsOn": {
          "field": "ventilacionPresenta",
          "equals": "Si"
        }
      },
      {
        "id": "baseSoporteTermicoTimer",
        "column": "U",
        "label": "Estado del timer + termomagnético",
        "type": "select",
        "options": [
          "Con soporte de madera",
          "Soldado a la rejilla",
          "Descolgado"
        ],
        "required": true,
        "dependsOn": {
          "field": "ventilacionPresenta",
          "equals": "Si"
        }
      }
    ]
  },
  {
    "id": "transformador",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Transformador MT/BT",
    "description": "Estado y componentes asociados al transformador.",
    "fields": [
      {
        "id": "portafusibleMT",
        "column": "V",
        "label": "Portafusible MT",
        "type": "select",
        "options": [
          "Totalmente Cerrado",
          "Parcialmente Cerrado (Sobresale)"
        ],
        "required": true
      },
      {
        "id": "presentaMastilBT",
        "column": "W",
        "label": "Presenta cinta mastic en borne de B.T.",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      },
      {
        "id": "estadoSuciedadPlataforma",
        "column": "X",
        "label": "Estado de suciedad de plataforma",
        "type": "select",
        "options": [
          "A: Alto",
          "B: Medio",
          "C: Bajo"
        ],
        "required": true
      },
      {
        "id": "perdidaAceite",
        "column": "Y",
        "label": "Presenta pérdida de aceite",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      },
      {
        "id": "taponBushing",
        "column": "Z",
        "label": "Presenta tapón en bushing (final de línea)",
        "type": "select",
        "options": [
          "Si (normado)",
          "Si (simple)",
          "No"
        ],
        "required": true
      },
      {
        "id": "transformadorCuentaTapon",
        "column": "BK",
        "label": "Transformador cuenta con tapón",
        "type": "select",
        "options": [
          "Transporte (rojo)",
          "Servicio (verde)",
          "Gris con ranura",
          "Gris sin ranura"
        ],
        "required": true
      },
      {
        "id": "estadoPerdidaAceite",
        "column": "AA",
        "label": "Estado de la pérdida de aceite",
        "type": "select",
        "options": [
          "Mancha activa",
          "Mancha seca",
          "No tiene"
        ],
        "required": true,
        "dependsOn": {
          "field": "perdidaAceite",
          "equals": "Si"
        }
      }
    ]
  },
  {
    "id": "conexionesBoveda",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Tablero y conexiones",
    "description": "Conexiones y elementos de la bóveda asociados a MT y B.T.",
    "fields": [
      {
        "id": "conectorCodoTierra",
        "column": "AB",
        "label": "Conector codo conectado a tierra",
        "type": "select",
        "options": [
          "Si",
          "No",
          "Seccionado"
        ],
        "required": true
      },
      {
        "id": "cuentaPozoMT",
        "column": "AC",
        "label": "Cuenta con pozo MT",
        "type": "select",
        "options": [
          "Si",
          "No",
          "No visible"
        ],
        "required": true
      },
      {
        "id": "tapaAseguradaBisagra",
        "column": "AD",
        "label": "Tapa se encuentra asegurada a bisagra",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      },
      {
        "id": "circuitosRotulacion",
        "column": "AE",
        "label": "Los circuitos cuentan con rotulación",
        "type": "select",
        "options": [
          "Si",
          "No",
          "Ilegible"
        ],
        "required": true
      },
      {
        "id": "estadoConectoresCodo",
        "column": "AG",
        "label": "Estado de conectores codo",
        "type": "multiselect",
        "options": [
          "Hinchado",
          "Descarga en adaptador de tierra",
          "Cable de tierra seccionado",
          "Sin tapón en el punto de inducción"
        ],
        "required": true
      },
      {
        "id": "soporteCableMT",
        "column": "AI",
        "label": "Soporte de cable en MT",
        "type": "select",
        "options": [
          "Si tiene",
          "No tiene"
        ],
        "required": true
      },
      {
        "id": "estadoCableBT",
        "column": "AJ",
        "label": "Estado de cable de BT",
        "type": "select",
        "options": [
          "Buen estado",
          "Pérdida de aislamiento"
        ],
        "required": true
      }
    ]
  },
  {
    "id": "parametrosTemperaturaBoveda",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Parámetros de temperatura",
    "description": "Temperaturas del transformador y sus conexiones, expresadas en grados Celsius.",
    "fields": [
      {
        "id": "temperaturaCodosTerna01R",
        "column": "AO",
        "label": "Temperatura en codos · Terna 01 · R",
        "measurementGroup": "codos-terna-01",
        "measurementTitle": "Temperatura en codos — Terna 01",
        "phase": "R",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCodosTerna01S",
        "column": "AP",
        "label": "Temperatura en codos · Terna 01 · S",
        "measurementGroup": "codos-terna-01",
        "measurementTitle": "Temperatura en codos — Terna 01",
        "phase": "S",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCodosTerna01T",
        "column": "AQ",
        "label": "Temperatura en codos · Terna 01 · T",
        "measurementGroup": "codos-terna-01",
        "measurementTitle": "Temperatura en codos — Terna 01",
        "phase": "T",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCodosTerna02R",
        "column": "AR",
        "label": "Temperatura en codos · Terna 02 · R",
        "measurementGroup": "codos-terna-02",
        "measurementTitle": "Temperatura en codos — Terna 02",
        "phase": "R",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCodosTerna02S",
        "column": "AS",
        "label": "Temperatura en codos · Terna 02 · S",
        "measurementGroup": "codos-terna-02",
        "measurementTitle": "Temperatura en codos — Terna 02",
        "phase": "S",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCodosTerna02T",
        "column": "AT",
        "label": "Temperatura en codos · Terna 02 · T",
        "measurementGroup": "codos-terna-02",
        "measurementTitle": "Temperatura en codos — Terna 02",
        "phase": "T",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaBornesBTR",
        "column": "AU",
        "label": "Temperatura en bornes de B.T. · R",
        "measurementGroup": "bornes-bt",
        "measurementTitle": "Temperatura en bornes de B.T.",
        "phase": "R",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaBornesBTS",
        "column": "AV",
        "label": "Temperatura en bornes de B.T. · S",
        "measurementGroup": "bornes-bt",
        "measurementTitle": "Temperatura en bornes de B.T.",
        "phase": "S",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaBornesBTT",
        "column": "AW",
        "label": "Temperatura en bornes de B.T. · T",
        "measurementGroup": "bornes-bt",
        "measurementTitle": "Temperatura en bornes de B.T.",
        "phase": "T",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCuba",
        "column": "BA",
        "label": "Temperatura en cuba",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      }
    ]
  },
  {
    "id": "parametroDecibeles",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Parámetro de decibeles",
    "description": "Evaluación de ruido y medición de su intensidad.",
    "fields": [
      {
        "id": "presentaRuido",
        "column": "BC",
        "label": "Presenta ruido",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      },
      {
        "id": "componenteRuido",
        "column": "BD",
        "label": "¿En qué componente?",
        "type": "select",
        "options": [
          "Conector codo",
          "Borne de B.T.",
          "Portafusible",
          "Cuba del transformador"
        ],
        "required": true,
        "dependsOn": {
          "field": "presentaRuido",
          "equals": "Si"
        }
      },
      {
        "id": "cantidadDecibeles",
        "column": "BE",
        "label": "Cantidad de decibeles",
        "type": "number",
        "min": 0,
        "step": 0.1,
        "unit": "dB",
        "required": true,
        "dependsOn": {
          "field": "presentaRuido",
          "equals": "Si"
        }
      }
    ]
  },
  {
    "id": "fotosBoveda",
    "group": "Transformador + bóveda",
    "groupKey": "boveda",
    "title": "Fotos",
    "description": "Evidencias de la bóveda y del transformador. Puedes tomar las fotos directamente desde el celular.",
    "fields": [
      {
        "id": "fotoPanoramicaDerecho",
        "label": "Foto panorámica · Lado derecho (01)",
        "group": "Fotos panorámicas",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true
      },
      {
        "id": "fotoPanoramicaIzquierdo",
        "label": "Foto panorámica · Lado izquierdo (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos panorámicas"
      },
      {
        "id": "fotoPanoramicaFrontal",
        "label": "Foto panorámica · Lado frontal (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos panorámicas"
      },
      {
        "id": "fotoBovedaRejillasDuctos",
        "label": "Foto de la bóveda · Externa de rejilla y ductos de ventilación (01)",
        "group": "Fotos de la bóveda",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true
      },
      {
        "id": "fotoBovedaTapasAbiertas",
        "label": "Foto de la bóveda · Externa con las tapas abiertas (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos de la bóveda"
      },
      {
        "id": "fotoBovedaInternaPanoramica",
        "label": "Foto de la bóveda · Interna panorámica (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos de la bóveda"
      },
      {
        "id": "fotoBovedaRotuladoCircuito",
        "label": "Foto de la bóveda · Rotulado del circuito (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos de la bóveda"
      },
      {
        "id": "fotoBovedaEntornoTransformador",
        "label": "Foto de la bóveda · Entorno del transformador (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos de la bóveda"
      },
      {
        "id": "fotoBovedaAnomalia",
        "label": "Foto de la bóveda · Anomalía detectada (opcional) (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": false,
        "group": "Fotos de la bóveda"
      },
      {
        "id": "fotoTermicaCodo01",
        "label": "Imagen térmica · Codo 01 (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Imágenes térmicas"
      },
      {
        "id": "fotoTermicaCodo02",
        "label": "Imagen térmica · Codo 02 (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Imágenes térmicas"
      },
      {
        "id": "fotoTermicaCuba",
        "label": "Imagen térmica · Cuba (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Imágenes térmicas"
      },
      {
        "id": "fotoTermicaBorneBT",
        "label": "Imagen térmica · Borne de B.T. (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Imágenes térmicas"
      },
      {
        "id": "fotoUltrasonidoCodo01",
        "label": "Imagen de ultrasonido · Codo 01 (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Imágenes de ultrasonido"
      },
      {
        "id": "fotoUltrasonidoCodo02",
        "label": "Imagen de ultrasonido · Codo 02 (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Imágenes de ultrasonido"
      }
    ]
  },
  {
    "id": "tablero",
    "group": "Tablero",
    "groupKey": "tablero",
    "title": "Estado y cable de comunicación",
    "description": "Condición física del tablero y del cable de comunicación.",
    "fields": [
      {
        "id": "estadoTablero",
        "column": "AF",
        "label": "Estado del tablero",
        "type": "multiselect",
        "exclusiveOption": "Conforme",
        "options": [
          "Presenta agujero en la tapa superior del tablero",
          "Presenta agujero en los lados laterales del tablero",
          "Corroído sin agujero",
          "No cuenta con perno de anclaje a base de concreto",
          "Bloques de concreto de salida de cables de B.T. incompleto",
          "Tablero inclinado",
          "Conforme"
        ],
        "required": true
      },
      {
        "id": "tipoCableComunicacion",
        "column": "BM",
        "label": "Tipo de cable de comunicación",
        "type": "select",
        "options": [
          "NA2XY",
          "N2XY",
          "NYY",
          "NAYY"
        ],
        "required": true
      },
      {
        "id": "seccionCableComunicacion",
        "column": "BN",
        "label": "Sección de cable de comunicación",
        "type": "number",
        "min": 0,
        "step": 0.01,
        "unit": "mm²",
        "required": true
      },
      {
        "id": "estadoCableComunicacion",
        "column": "BO",
        "label": "Estado de cable de comunicación",
        "type": "multiselect",
        "options": [
          "Cambio de coloración del PVC",
          "Cambio de coloración del metal",
          "Deformación del conector terminal",
          "Derretimiento de la cera del conector terminal.",
          "Cubierta de PVC encogida por calentamiento",
          "Cubierta de PVC abierta por calentamiento",
          "Cubierta de termocontraíble abierta"
        ],
        "required": true
      }
    ]
  },
  {
    "id": "parametrosElectricosTablero",
    "group": "Tablero",
    "groupKey": "tablero",
    "title": "Parámetros eléctricos",
    "description": "Corrientes por fase, temperatura del cable de comunicación y anomalías de salida de B.T.",
    "fields": [
      {
        "id": "corrienteR",
        "column": "AL",
        "label": "Corriente R",
        "measurementGroup": "corrientes",
        "measurementTitle": "Corrientes por fase",
        "phase": "R",
        "type": "number",
        "min": 0,
        "step": 0.1,
        "unit": "A",
        "required": true
      },
      {
        "id": "corrienteS",
        "column": "AM",
        "label": "Corriente S",
        "measurementGroup": "corrientes",
        "measurementTitle": "Corrientes por fase",
        "phase": "S",
        "type": "number",
        "min": 0,
        "step": 0.1,
        "unit": "A",
        "required": true
      },
      {
        "id": "corrienteT",
        "column": "AN",
        "label": "Corriente T",
        "measurementGroup": "corrientes",
        "measurementTitle": "Corrientes por fase",
        "phase": "T",
        "type": "number",
        "min": 0,
        "step": 0.1,
        "unit": "A",
        "required": true
      },
      {
        "id": "temperaturaCableComunicacionR",
        "column": "AX",
        "label": "Temperatura en cable de comunicación · R",
        "measurementGroup": "cable-comunicacion",
        "measurementTitle": "Temperatura en cable de comunicación",
        "phase": "R",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCableComunicacionS",
        "column": "AY",
        "label": "Temperatura en cable de comunicación · S",
        "measurementGroup": "cable-comunicacion",
        "measurementTitle": "Temperatura en cable de comunicación",
        "phase": "S",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "temperaturaCableComunicacionT",
        "column": "AZ",
        "label": "Temperatura en cable de comunicación · T",
        "measurementGroup": "cable-comunicacion",
        "measurementTitle": "Temperatura en cable de comunicación",
        "phase": "T",
        "type": "number",
        "step": 0.1,
        "unit": "°C",
        "required": true
      },
      {
        "id": "anomaliaLlavesCableBT",
        "column": "BB",
        "label": "Presenta anomalía en llaves o cable de salida de B.T.",
        "type": "select",
        "options": [
          "Si",
          "No"
        ],
        "required": true
      }
    ]
  },
  {
    "id": "fotosTablero",
    "group": "Tablero",
    "groupKey": "tablero",
    "title": "Fotos",
    "description": "Evidencias del tablero y de las mediciones eléctricas.",
    "fields": [
      {
        "id": "fotoTableroExterna",
        "label": "Foto del tablero · Externa (01)",
        "group": "Fotos del tablero",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true
      },
      {
        "id": "fotoTableroInterna",
        "label": "Foto del tablero · Interna (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos del tablero"
      },
      {
        "id": "fotoTableroAnomalia",
        "label": "Foto del tablero · Anomalía (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos del tablero"
      },
      {
        "id": "fotoCorrienteR",
        "label": "Corriente R (01)",
        "group": "Fotos de mediciones de corriente",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true
      },
      {
        "id": "fotoCorrienteS",
        "label": "Corriente S (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos de mediciones de corriente"
      },
      {
        "id": "fotoCorrienteT",
        "label": "Corriente T (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Fotos de mediciones de corriente"
      },
      {
        "id": "fotoTermicaCableComunicacion",
        "label": "Imagen térmica · Cable de comunicación (01)",
        "type": "file",
        "accept": "image/*",
        "capture": "environment",
        "required": true,
        "group": "Imagen térmica del cable de comunicación"
      }
    ]
  }
]);

function excelColumnName(number) {
  let value = number;
  let column = "";
  while (value > 0) {
    value -= 1;
    column = String.fromCharCode(65 + (value % 26)) + column;
    value = Math.floor(value / 26);
  }
  return column;
}

function applySequentialColumns(sections) {
  let columnNumber = 5;
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) =>
      field.type === "file" ? field : { ...field, column: excelColumnName(columnNumber++) },
    ),
  }));
}

export const FORM_SCHEMA = Object.freeze(applySequentialColumns(BASE_FORM_SCHEMA));
export const ALL_FIELDS = Object.freeze(FORM_SCHEMA.flatMap((section) => section.fields));
export const FIELD_BY_ID = Object.freeze(Object.fromEntries(ALL_FIELDS.map((field) => [field.id, field])));
