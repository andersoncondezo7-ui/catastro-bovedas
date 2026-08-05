import { APP_CONFIG } from "./config.js";
import { BASE_RECORDS } from "./data/base-records.js";
import { ALL_FIELDS, FORM_SCHEMA } from "./data/form-schema.js";
import { renderFormSections, updateDependencies } from "./components/form-renderer.js";
import { showToast } from "./components/toast.js";
import { createAutocomplete } from "./components/autocomplete.js";
import { draftService } from "./services/draft-service.js";
import { createLookupService } from "./services/lookup-service.js";
import { submitInspection } from "./services/submission-service.js";

const elements = {
  loginScreen: document.querySelector("#login-screen"),
  loginForm: document.querySelector("#login-form"),
  inspectorUser: document.querySelector("#inspector-user"),
  loginMessage: document.querySelector("#login-message"),
  lookupScreen: document.querySelector("#lookup-screen"),
  currentUser: document.querySelector("#current-user"),
  changeUser: document.querySelector("#change-user"),
  lookupForm: document.querySelector("#lookup-form"),
  lookupInput: document.querySelector("#asset-number"),
  lookupMessage: document.querySelector("#lookup-message"),
  suggestionList: document.querySelector("#sed-suggestions"),
  suggestionStatus: document.querySelector("#suggestion-status"),
  inspectionShell: document.querySelector("#inspection-shell"),
  inspectionForm: document.querySelector("#inspection-form"),
  formSections: document.querySelector("#form-sections"),
  assetFeeder: document.querySelector("#asset-feeder"),
  assetCode: document.querySelector("#asset-code"),
  progressLabel: document.querySelector("#progress-label"),
  progressSection: document.querySelector("#progress-section"),
  progressFields: document.querySelector("#progress-fields"),
  progressTrack: document.querySelector("#progress-track"),
  progressBar: document.querySelector("#progress-bar"),
  clearForm: document.querySelector("#clear-form"),
  previousStep: document.querySelector("#previous-step"),
  nextStep: document.querySelector("#next-step"),
  submitForm: document.querySelector("#submit-form"),
  toast: document.querySelector("#toast"),
};

for (const user of APP_CONFIG.inspectorUsers) {
  const option = document.createElement("option");
  option.value = user;
  option.textContent = user;
  elements.inspectorUser.append(option);
}
const allowedUsers = new Set(APP_CONFIG.inspectorUsers);
const lookupService = createLookupService(BASE_RECORDS);
let selectedUser = null;
let selectedAsset = null;
let draftTimer = null;
let currentSectionIndex = 0;

renderFormSections(elements.formSections, FORM_SCHEMA);
updateDependencies(elements.inspectionForm);
const formSections = [...elements.formSections.querySelectorAll(".form-section")];

const autocomplete = createAutocomplete({
  input: elements.lookupInput,
  list: elements.suggestionList,
  status: elements.suggestionStatus,
  records: BASE_RECORDS,
  onSelect: selectAsset,
});

function activeControls() {
  return ALL_FIELDS
    .map((field) => elements.inspectionForm.elements[field.id])
    .filter((control) => control && !control.disabled);
}

function formValues() {
  return Object.fromEntries(
    ALL_FIELDS.map((field) => {
      const control = elements.inspectionForm.elements[field.id];
      const value = control.disabled || control.value === "" ? null : field.type === "number" ? Number(control.value) : control.value;
      return [field.id, value];
    }),
  );
}

function draftKey(assetNumber) {
  return `${selectedUser}::${assetNumber}`;
}

function updateProgress() {
  const controls = activeControls();
  const completed = controls.filter((control) => control.value !== "").length;
  const total = controls.length;
  const totalSteps = formSections.length + 2;
  const step = currentSectionIndex + 3;
  const percentage = Math.round((step / totalSteps) * 100);
  elements.progressLabel.textContent = `Paso ${step} de ${totalSteps}`;
  elements.progressSection.textContent = FORM_SCHEMA[currentSectionIndex].title;
  elements.progressFields.textContent = `${completed} de ${total} campos completos`;
  elements.progressTrack.setAttribute("aria-valuemax", String(totalSteps));
  elements.progressTrack.setAttribute("aria-valuenow", String(step));
  elements.progressTrack.setAttribute("aria-valuetext", `${elements.progressLabel.textContent}: ${elements.progressSection.textContent}`);
  elements.progressBar.style.width = `${percentage}%`;
}

function showSection(index, { scroll = false } = {}) {
  currentSectionIndex = Math.max(0, Math.min(index, formSections.length - 1));
  formSections.forEach((section, sectionIndex) => {
    const active = sectionIndex === currentSectionIndex;
    section.hidden = !active;
    section.setAttribute("aria-hidden", String(!active));
  });
  const firstStep = currentSectionIndex === 0;
  const lastStep = currentSectionIndex === formSections.length - 1;
  elements.previousStep.hidden = firstStep;
  elements.nextStep.hidden = lastStep;
  elements.submitForm.hidden = !lastStep;
  updateProgress();
  if (scroll) {
    elements.inspectionShell.scrollIntoView({ behavior: "smooth", block: "start" });
    formSections[currentSectionIndex].querySelector("input, select")?.focus({ preventScroll: true });
  }
}

function validateCurrentSection() {
  const controls = [...formSections[currentSectionIndex].querySelectorAll("input, select, textarea")]
    .filter((control) => !control.disabled);
  const invalid = controls.find((control) => !control.checkValidity());
  if (!invalid) return true;
  elements.inspectionForm.classList.add("was-validated");
  invalid.reportValidity();
  return false;
}

function scheduleDraft() {
  if (!selectedUser || !selectedAsset) return;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => draftService.save(draftKey(selectedAsset.numero), formValues()), 250);
}

function restoreDraft(asset) {
  elements.inspectionForm.reset();
  elements.inspectionForm.classList.remove("was-validated");
  const draft = draftService.load(draftKey(asset.numero));
  if (draft?.values) {
    Object.entries(draft.values).forEach(([id, value]) => {
      const control = elements.inspectionForm.elements[id];
      if (control && value !== null && value !== undefined) control.value = String(value);
    });
  }
  updateDependencies(elements.inspectionForm);
  showSection(0);
  return Boolean(draft?.values);
}

function selectAsset(asset) {
  if (!selectedUser) return;
  selectedAsset = asset;
  elements.assetFeeder.textContent = asset.alimentador;
  elements.assetCode.textContent = asset.numero;
  elements.inspectionShell.hidden = false;
  elements.lookupMessage.textContent = `Registro encontrado: alimentador ${asset.alimentador}.`;
  elements.lookupMessage.dataset.type = "success";
  const restored = restoreDraft(asset);
  if (restored) showToast(elements.toast, "Se recuperó tu borrador guardado en este dispositivo.");
  elements.inspectionShell.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startSession(user, { focus = true } = {}) {
  if (!allowedUsers.has(user)) return false;
  selectedUser = user;
  elements.currentUser.textContent = user;
  elements.loginScreen.hidden = true;
  elements.lookupScreen.hidden = false;
  elements.loginMessage.textContent = "";
  try {
    sessionStorage.setItem(APP_CONFIG.userSessionKey, user);
  } catch {
    // La sesión sigue activa aunque el navegador bloquee el almacenamiento.
  }
  if (focus) elements.lookupInput.focus();
  return true;
}

function endSession() {
  clearTimeout(draftTimer);
  autocomplete.close();
  selectedUser = null;
  selectedAsset = null;
  elements.lookupScreen.hidden = true;
  elements.inspectionShell.hidden = true;
  elements.lookupForm.reset();
  elements.lookupMessage.textContent = "";
  elements.inspectionForm.reset();
  elements.inspectorUser.value = "";
  elements.loginScreen.hidden = false;
  try {
    sessionStorage.removeItem(APP_CONFIG.userSessionKey);
  } catch {
    // No hay una sesión almacenada que limpiar.
  }
  elements.inspectorUser.focus();
}

elements.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = elements.inspectorUser.value;
  if (!startSession(user)) {
    elements.loginMessage.textContent = "Selecciona un usuario válido para continuar.";
    elements.loginMessage.dataset.type = "error";
    elements.inspectorUser.focus();
  }
});

elements.changeUser.addEventListener("click", endSession);

elements.lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  autocomplete.close();
  const value = elements.lookupInput.value;
  if (!value.trim()) {
    elements.lookupMessage.textContent = "Ingresa un número para realizar la búsqueda.";
    elements.lookupMessage.dataset.type = "error";
    elements.lookupInput.focus();
    return;
  }
  const asset = lookupService.findByNumber(value);
  if (!asset) {
    selectedAsset = null;
    elements.inspectionShell.hidden = true;
    elements.lookupMessage.textContent = "No se encontró ese número en InfoBase.xlsx. Verifica el dato.";
    elements.lookupMessage.dataset.type = "error";
    return;
  }
  selectAsset(asset);
});

elements.lookupInput.addEventListener("input", () => {
  if (!selectedAsset) return;
  const currentValue = elements.lookupInput.value.trim().toLocaleUpperCase("es-PE");
  if (currentValue === selectedAsset.numero.toLocaleUpperCase("es-PE")) return;
  selectedAsset = null;
  elements.inspectionShell.hidden = true;
  elements.lookupMessage.textContent = "Selecciona una SED de la lista o completa el número y pulsa Buscar.";
  elements.lookupMessage.dataset.type = "";
});

elements.inspectionForm.addEventListener("input", () => {
  updateDependencies(elements.inspectionForm);
  updateProgress();
  scheduleDraft();
});

elements.previousStep.addEventListener("click", () => showSection(currentSectionIndex - 1, { scroll: true }));

elements.nextStep.addEventListener("click", () => {
  if (!validateCurrentSection()) {
    showToast(elements.toast, "Completa los campos obligatorios de esta pantalla.", "error");
    return;
  }
  showSection(currentSectionIndex + 1, { scroll: true });
});

elements.clearForm.addEventListener("click", () => {
  if (!selectedAsset) return;
  elements.inspectionForm.reset();
  elements.inspectionForm.classList.remove("was-validated");
  updateDependencies(elements.inspectionForm);
  draftService.clear(draftKey(selectedAsset.numero));
  showSection(0, { scroll: true });
  showToast(elements.toast, "Las respuestas de esta inspección fueron limpiadas.");
});

function buildPayload() {
  const answers = formValues();
  const excelRow = { A: selectedAsset.alimentador, B: selectedAsset.numero };
  ALL_FIELDS.forEach((field) => {
    excelRow[field.column] = answers[field.id];
  });
  excelRow.AH = selectedUser;
  return {
    schemaVersion: APP_CONFIG.schemaVersion,
    submissionId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    inspector: { name: selectedUser },
    asset: { ...selectedAsset },
    inspection: answers,
    excelRow,
    source: {
      application: APP_CONFIG.appName,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    },
  };
}

elements.inspectionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedUser || !selectedAsset) return;
  updateDependencies(elements.inspectionForm);
  elements.inspectionForm.classList.add("was-validated");
  const firstInvalid = activeControls().find((control) => !control.checkValidity());
  if (firstInvalid) {
    const invalidSectionIndex = formSections.findIndex((section) => section.contains(firstInvalid));
    showSection(invalidSectionIndex, { scroll: true });
    firstInvalid.reportValidity();
    showToast(elements.toast, "Completa los campos obligatorios resaltados.", "error");
    return;
  }

  elements.submitForm.disabled = true;
  elements.submitForm.textContent = "Enviando…";
  try {
    const result = await submitInspection(buildPayload());
    draftService.clear(draftKey(selectedAsset.numero));
    showToast(
      elements.toast,
      result.mode === "dry-run"
        ? "Prueba correcta: la inspección fue validada sin enviar datos."
        : result.confirmed
          ? "Inspección enviada correctamente."
          : "Solicitud enviada a Power Automate.",
    );
  } catch (error) {
    showToast(elements.toast, error.message || "No fue posible enviar la inspección.", "error");
  } finally {
    elements.submitForm.disabled = false;
    elements.submitForm.textContent = "Enviar inspección";
  }
});

showSection(0);
try {
  const storedUser = sessionStorage.getItem(APP_CONFIG.userSessionKey);
  if (storedUser) startSession(storedUser, { focus: false });
} catch {
  // Se mantiene la pantalla de acceso si no hay almacenamiento de sesión.
}
