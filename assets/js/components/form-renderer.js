function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  return option;
}

function createField(field) {
  const wrapper = document.createElement("div");
  wrapper.className = "field-card";
  wrapper.dataset.fieldId = field.id;
  if (field.dependsOn) {
    wrapper.dataset.dependsOn = field.dependsOn.field;
    wrapper.dataset.dependsValue = field.dependsOn.equals;
  }

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.textContent = field.label;
  wrapper.append(label);

  let control;
  if (field.type === "select") {
    control = document.createElement("select");
    control.append(createOption(""));
    control.options[0].textContent = "Seleccionar…";
    for (const value of field.options) control.append(createOption(value));
  } else {
    control = document.createElement("input");
    control.type = field.type;
    if (field.min !== undefined) control.min = String(field.min);
    if (field.step !== undefined) control.step = String(field.step);
    control.inputMode = field.step === 1 ? "numeric" : "decimal";
  }

  control.id = field.id;
  control.name = field.id;
  control.dataset.column = field.column;
  control.required = Boolean(field.required);
  wrapper.append(control);

  if (field.help) {
    const help = document.createElement("small");
    help.textContent = field.help;
    wrapper.append(help);
  }
  return wrapper;
}

export function renderFormSections(container, schema) {
  const fragment = document.createDocumentFragment();
  schema.forEach((section, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "form-section";
    const legend = document.createElement("legend");
    legend.innerHTML = `<span>${String(index + 3).padStart(2, "0")}</span>${section.title}`;
    fieldset.append(legend);
    const description = document.createElement("p");
    description.className = "section-description";
    description.textContent = section.description;
    fieldset.append(description);
    const grid = document.createElement("div");
    grid.className = "field-grid";
    section.fields.forEach((field) => grid.append(createField(field)));
    fieldset.append(grid);
    fragment.append(fieldset);
  });
  container.replaceChildren(fragment);
}

export function updateDependencies(form) {
  form.querySelectorAll("[data-depends-on]").forEach((wrapper) => {
    const source = form.elements[wrapper.dataset.dependsOn];
    const active = source?.value === wrapper.dataset.dependsValue;
    const control = wrapper.querySelector("input, select, textarea");
    wrapper.hidden = !active;
    control.disabled = !active;
    if (!active) control.value = "";
  });
}
