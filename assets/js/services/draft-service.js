import { APP_CONFIG } from "../config.js";

function storageAvailable() {
  try {
    const key = `${APP_CONFIG.draftStoragePrefix}check`;
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const enabled = storageAvailable();

function keyFor(number) {
  return `${APP_CONFIG.draftStoragePrefix}${number}`;
}

export const draftService = Object.freeze({
  load(number) {
    if (!enabled) return null;
    try {
      return JSON.parse(localStorage.getItem(keyFor(number)) || "null");
    } catch {
      return null;
    }
  },
  save(number, values) {
    if (!enabled) return;
    localStorage.setItem(keyFor(number), JSON.stringify({ savedAt: new Date().toISOString(), values }));
  },
  clear(number) {
    if (enabled) localStorage.removeItem(keyFor(number));
  },
});
