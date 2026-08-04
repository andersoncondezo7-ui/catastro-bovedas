import { APP_CONFIG } from "../config.js";

function getSettings() {
  return {
    endpointUrl: APP_CONFIG.defaultEndpointUrl,
    dryRun: APP_CONFIG.defaultDryRun,
  };
}

export async function submitInspection(payload) {
  const settings = getSettings();

  if (settings.dryRun) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    console.info("[Modo de prueba] Inspección preparada:", payload);
    return { ok: true, mode: "dry-run" };
  }

  if (!settings.endpointUrl) {
    throw new Error("Configura la URL de Power Automate antes de enviar.");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(settings.endpointUrl);
  } catch {
    throw new Error("La URL de Power Automate no es válida.");
  }
  if (parsedUrl.protocol !== "https:") {
    throw new Error("La URL de Power Automate debe usar HTTPS.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeoutMs);

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: APP_CONFIG.powerAutomate.method,
      mode: APP_CONFIG.powerAutomate.requestMode,
      headers: { "Content-Type": APP_CONFIG.powerAutomate.contentType },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (response.type !== "opaque" && !response.ok) {
      throw new Error(`Power Automate respondió con estado ${response.status}.`);
    }
    return { ok: true, mode: "live", status: response.status, confirmed: response.type !== "opaque" };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("El envío tardó demasiado. Verifica la conexión e inténtalo otra vez.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
