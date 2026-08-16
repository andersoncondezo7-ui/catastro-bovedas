export const APP_CONFIG = Object.freeze({
  appName: "Inspección de bóvedas",
  schemaVersion: "5.2.0",
  userSessionKey: "catastro-bovedas:inspector",
  zoneSessionKey: "catastro-bovedas:zone",
  zones: Object.freeze({
    sur: "Zona Sur",
    este: "Zona Este",
  }),
  inspectorUsers: Object.freeze([
    "Rodriguez Cabriles Oscar Enrique",
    "Anca Enciso Ronal",
    "Rojas Lino Eliseo Jenci",
    "Huamani Molina Dany Ulises",
    "Quispe Massa Cesar Hipolito",
  ]),
  requestTimeoutMs: 20000,
  draftStoragePrefix: "catastro-bovedas:draft:",
  defaultEndpointUrl: "https://default1c0051dd45964b1a9849d060735057.69.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/10/workflows/7f74e42751974431a59cf519dbf7f110/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9_iEmzq7d01UrCTvR7nkv3GGXxHNKboe8O3UDTXRc7Y",
  defaultDryRun: false,
  photos: Object.freeze({
    maxDimension: 1600,
    jpegQuality: 0.72,
    maxInputMB: 12,
    maxInputBytes: 12 * 1024 * 1024,
    maxPayloadMB: 18,
    maxPayloadBytes: 18 * 1024 * 1024,
  }),
  powerAutomate: Object.freeze({
    method: "POST",
    contentType: "text/plain;charset=UTF-8",
    requestMode: "no-cors",
  }),
});
