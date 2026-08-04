export const APP_CONFIG = Object.freeze({
  appName: "Inspección de bóvedas",
  schemaVersion: "1.0.0",
  requestTimeoutMs: 20000,
  endpointStorageKey: "catastro-bovedas:endpoint",
  dryRunStorageKey: "catastro-bovedas:dry-run",
  draftStoragePrefix: "catastro-bovedas:draft:",
  defaultEndpointUrl: "https://default1c0051dd45964b1a9849d060735057.69.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/10/workflows/7f74e42751974431a59cf519dbf7f110/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9_iEmzq7d01UrCTvR7nkv3GGXxHNKboe8O3UDTXRc7Y",
  defaultDryRun: false,
  powerAutomate: Object.freeze({
    method: "POST",
    contentType: "text/plain;charset=UTF-8",
    requestMode: "no-cors",
  }),
});
