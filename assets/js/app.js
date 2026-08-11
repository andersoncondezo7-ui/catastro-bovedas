import { APP_CONFIG } from "./config.js";
import { BASE_RECORDS } from "./data/base-records.js";
import { ALL_FIELDS, FORM_SCHEMA } from "./data/form-schema.js";
import { renderFormSections, updateDependencies } from "./components/form-renderer.js";
import { showToast } from "./components/toast.js";
import { createAutocomplete } from "./components/autocomplete.js";
import { draftService } from "./services/draft-service.js";
import { createLookupService } from "./services/lookup-service.js";
import { submitInspection } from "./services/submission-service.js";
import { preparePhotos } from "./services/image-service.js";

const elements = {
  zoneScreen: document.querySelector("#zone-screen"),
  zoneButtons: [...document.querySelectorAll("[data-zone]")],
  loginScreen: document.querySelector("#login-screen"),
  loginForm: document.querySelector("#login-form"),
  inspectorUser: document.querySelector("#inspector-user"),
  loginMessage: document.querySelector("#login-message"),
  changeZone: document.querySelector("#change-zone"),
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
  submitOverlay: document.querySelector("#submit-overlay"),
  submitStatus: document.querySelector("#submit-status"),
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
let selectedZone = null;
let selectedUser = null;
let selectedAsset = null;
let draftTimer = null;
let currentSectionIndex = 0;

renderFormSections(elements.formSections, FORM_SCHEMA);
updateDependencies(elements.inspectionForm);
const formSections = [...elements.formSections.querySelectorAll(".form-section")];
const DATA_FIELDS = ALL_FIELDS.filter((field) => field.type !== "file");
const PHOTO_FIELDS = ALL_FIELDS.filter((field) => field.type === "file");

const autocomplete = createAutocomplete({
  input: elements.lookupInput,
  list: elements.suggestionList,
  status: elements.suggestionStatus,
  records: BASE_RECORDS,
  onSelect: selectAsset,
});

function controlsForField(field) {
  const wrapper = elements.inspectionForm.querySelector(`[data-field-id="${field.id}"]`);
  return wrapper ? [...wrapper.querySelectorAll("input, select, textarea")] : [];
}

function fieldIsActive(field) {
  const controls = controlsForField(field);
  return controls.length > 0 && controls.some((control) => !control.disabled);
}

function fieldValue(field) {
  const controls = controlsForField(field);
  if (!controls.length || controls.every((control) => control.disabled)) return null;
  if (field.type === "multiselect") return controls.filter((control) => control.checked).map((control) => control.value);
  if (field.type === "file") {
    return [...(controls[0].files || [])].map((file) => ({ name: file.name, sizeBytes: file.size, mimeType: file.type }));
  }
  const value = controls[0].value;
  return value === "" ? null : field.type === "number" ? Number(value) : value;
}

function fieldIsComplete(field) {
  const value = fieldValue(field);
  return Array.isArray(value) ? value.length > 0 : value !== null && value !== "";
}

function activeFields() {
  return ALL_FIELDS.filter(fieldIsActive);
}

function validateField(field) {
  const controls = controlsForField(field);
  const first = controls[0];
  if (!first || !fieldIsActive(field)) return true;
  let message = "";
  const value = fieldValue(field);
  if (field.required && (value === null || value === "" || (Array.isArray(value) && value.length === 0))) {
    message = "Completa este campo para continuar.";
  }
  if (field.type === "file") {
    const count = first.files?.length || 0;
    const minimum = field.minFiles ?? (field.required ? 1 : 0);
    const maximum = field.maxFiles ?? 1;
    if (count < minimum) message = `Selecciona ${minimum === maximum ? "exactamente" : "al menos"} ${minimum} foto(s).`;
    else if (count > maximum) message = `Selecciona como máximo ${maximum} foto(s).`;
    else if ([...(first.files || [])].some((file) => file.size > APP_CONFIG.photos.maxInputBytes)) message = `Cada foto debe pesar como máximo ${APP_CONFIG.photos.maxInputMB} MB.`;
  }
  first.setCustomValidity(message);
  return !message && first.checkValidity();
}

function formValues() {
  return Object.fromEntries(DATA_FIELDS.map((field) => [field.id, fieldValue(field)]));
}

function draftKey(assetNumber) {
  return `${selectedUser}::${assetNumber}`;
}

function updateProgress() {
  const fields = activeFields();
  const completed = fields.filter(fieldIsComplete).length;
  const total = fields.length;
  const totalSteps = formSections.length + 3;
  const step = currentSectionIndex + 4;
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
    formSections[currentSectionIndex].querySelector("input, select, textarea")?.focus({ preventScroll: true });
  }
}

function validateCurrentSection() {
  const fields = FORM_SCHEMA[currentSectionIndex].fields.filter(fieldIsActive);
  const invalidField = fields.find((field) => !validateField(field));
  if (!invalidField) return true;
  elements.inspectionForm.classList.add("was-validated");
  controlsForField(invalidField)[0]?.reportValidity();
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
      const field = DATA_FIELDS.find((item) => item.id === id);
      if (!field || value === null || value === undefined) return;
      const controls = controlsForField(field);
      if (field.type === "multiselect" && Array.isArray(value)) {
        controls.forEach((control) => { control.checked = value.includes(control.value); });
      } else if (controls[0]) {
        controls[0].value = String(value);
      }
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

function storeSession() {
  try {
    sessionStorage.setItem(APP_CONFIG.userSessionKey, selectedUser);
    sessionStorage.setItem(APP_CONFIG.zoneSessionKey, selectedZone);
  } catch {
    // La sesión sigue activa aunque el navegador bloquee el almacenamiento.
  }
}

function startSession(user, { focus = true } = {}) {
  const validSouthUser = selectedZone === APP_CONFIG.zones.sur && allowedUsers.has(user);
  const validEastAccess = selectedZone === APP_CONFIG.zones.este && user === APP_CONFIG.zones.este;
  if (!validSouthUser && !validEastAccess) return false;
  selectedUser = user;
  elements.currentUser.textContent = selectedZone === APP_CONFIG.zones.este ? "Zona Este" : user;
  elements.zoneScreen.hidden = true;
  elements.loginScreen.hidden = true;
  elements.lookupScreen.hidden = false;
  elements.loginMessage.textContent = "";
  storeSession();
  if (focus) elements.lookupInput.focus();
  return true;
}

function chooseZone(zoneKey, { focus = true } = {}) {
  const zone = APP_CONFIG.zones[zoneKey];
  if (!zone) return;
  selectedZone = zone;
  elements.zoneScreen.hidden = true;
  if (zone === APP_CONFIG.zones.sur) {
    elements.loginScreen.hidden = false;
    elements.lookupScreen.hidden = true;
    if (focus) elements.inspectorUser.focus();
    return;
  }
  elements.loginScreen.hidden = true;
  startSession(APP_CONFIG.zones.este, { focus });
}

function endSession() {
  clearTimeout(draftTimer);
  autocomplete.close();
  selectedZone = null;
  selectedUser = null;
  selectedAsset = null;
  elements.lookupScreen.hidden = true;
  elements.inspectionShell.hidden = true;
  elements.loginScreen.hidden = true;
  elements.zoneScreen.hidden = false;
  elements.lookupForm.reset();
  elements.lookupMessage.textContent = "";
  elements.inspectionForm.reset();
  elements.inspectorUser.value = "";
  updateDependencies(elements.inspectionForm);
  try {
    sessionStorage.removeItem(APP_CONFIG.userSessionKey);
    sessionStorage.removeItem(APP_CONFIG.zoneSessionKey);
  } catch {
    // No hay una sesión almacenada que limpiar.
  }
  elements.zoneButtons[0]?.focus();
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

elements.zoneButtons.forEach((button) => button.addEventListener("click", () => chooseZone(button.dataset.zone)));
elements.changeZone.addEventListener("click", endSession);
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

function enforceExclusiveChoice(target) {
  if (!(target instanceof HTMLInputElement) || target.type !== "checkbox" || !target.checked) return;
  const wrapper = target.closest("[data-field-id]");
  const field = ALL_FIELDS.find((item) => item.id === wrapper?.dataset.fieldId);
  if (!field?.exclusiveOption) return;
  const controls = controlsForField(field);
  if (target.value === field.exclusiveOption) controls.forEach((control) => { if (control !== target) control.checked = false; });
  if (target.value !== field.exclusiveOption) {
    const exclusive = controls.find((control) => control.value === field.exclusiveOption);
    if (exclusive) exclusive.checked = false;
  }
}

elements.inspectionForm.addEventListener("input", (event) => {
  enforceExclusiveChoice(event.target);
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

function setSubmitting(active, message = "Preparando la inspección y las fotografías…") {
  elements.submitOverlay.hidden = !active;
  elements.submitStatus.textContent = message;
  elements.inspectionForm.inert = active;
  elements.lookupForm.inert = active;
  document.body.classList.toggle("is-submitting", active);
}

function resetAfterSuccessfulSubmission() {
  const completedAssetNumber = selectedAsset?.numero;
  if (completedAssetNumber) draftService.clear(draftKey(completedAssetNumber));
  clearTimeout(draftTimer);
  elements.inspectionForm.reset();
  elements.inspectionForm.classList.remove("was-validated");
  updateDependencies(elements.inspectionForm);
  selectedAsset = null;
  elements.lookupForm.reset();
  elements.inspectionShell.hidden = true;
  elements.lookupMessage.textContent = "Envío terminado. Busca otra SED para iniciar una nueva inspección.";
  elements.lookupMessage.dataset.type = "success";
  showSection(0);
}

async function buildPayload() {
  const answers = formValues();
  const excelRow = { A: selectedAsset.alimentador, B: selectedAsset.numero };
  DATA_FIELDS.forEach((field) => {
    const value = answers[field.id];
    excelRow[field.column] = Array.isArray(value) ? value.join(" | ") : value;
  });
  excelRow.AK = selectedUser;
  const photos = await preparePhotos(PHOTO_FIELDS, elements.inspectionForm, selectedAsset.numero, (current, total) => {
    const message = `Preparando foto ${current} de ${total}…`;
    elements.submitForm.textContent = message;
    elements.submitStatus.textContent = message;
  });
  return {
    schemaVersion: APP_CONFIG.schemaVersion,
    submissionId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    inspector: { name: selectedUser },
    asset: { ...selectedAsset },
    inspection: answers,
    photos,
    photoSummary: {
      total: photos.length,
      totalSizeBytes: photos.reduce((sum, photo) => sum + photo.sizeBytes, 0),
    },
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
  const invalidField = activeFields().find((field) => !validateField(field));
  if (invalidField) {
    const firstInvalid = controlsForField(invalidField)[0];
    const invalidSectionIndex = formSections.findIndex((section) => section.contains(firstInvalid));
    showSection(invalidSectionIndex, { scroll: true });
    firstInvalid?.reportValidity();
    showToast(elements.toast, "Completa los campos obligatorios resaltados.", "error");
    return;
  }

  elements.submitForm.disabled = true;
  elements.submitForm.textContent = "Enviando…";
  setSubmitting(true);
  try {
    const payload = await buildPayload();
    elements.submitStatus.textContent = "Enviando toda la información a Power Automate…";
    const result = await submitInspection(payload);
    resetAfterSuccessfulSubmission();
    showToast(
      elements.toast,
      result.mode === "dry-run"
        ? "Prueba correcta. El formulario quedó listo para otra inspección."
        : result.confirmed
          ? "Inspección enviada correctamente. Ya puedes registrar otra SED."
          : "Solicitud enviada a Power Automate. Ya puedes registrar otra SED.",
    );
  } catch (error) {
    showToast(elements.toast, error.message || "No fue posible enviar la inspección. Tus respuestas se conservaron.", "error");
  } finally {
    setSubmitting(false);
    elements.submitForm.disabled = false;
    elements.submitForm.textContent = "Enviar inspección";
    if (!selectedAsset) elements.lookupInput.focus();
  }
});

showSection(0);
try {
  const storedUser = sessionStorage.getItem(APP_CONFIG.userSessionKey);
  const storedZone = sessionStorage.getItem(APP_CONFIG.zoneSessionKey);
  if (storedUser) {
    selectedZone = storedZone || (allowedUsers.has(storedUser) ? APP_CONFIG.zones.sur : null);
    if (!startSession(storedUser, { focus: false })) endSession();
  }
} catch {
  // Se mantiene la pantalla de selección de zona si no hay almacenamiento de sesión.
}
