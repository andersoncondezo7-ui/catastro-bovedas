function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  return option;
}

function configureControl(control, field) {
  control.name = field.id;
  if (field.column) control.dataset.column = field.column;
  control.disabled = false;
}

function createMultiSelect(field, label) {
  label.id = `${field.id}-label`;
  label.removeAttribute("for");
  const group = document.createElement("div");
  group.className = "choice-list";
  group.setAttribute("role", "group");
  group.setAttribute("aria-labelledby", label.id);
  field.options.forEach((value, index) => {
    const row = document.createElement("label");
    row.className = "choice-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${field.id}-${index}`;
    checkbox.value = value;
    configureControl(checkbox, field);
    const text = document.createElement("span");
    text.textContent = value;
    row.append(checkbox, text);
    group.append(row);
  });
  return group;
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

  if (field.type === "multiselect") {
    wrapper.classList.add("field-card-multiple");
    wrapper.append(createMultiSelect(field, label));
  } else {
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
      if (field.type === "number") control.inputMode = field.step === 1 ? "numeric" : "decimal";
      if (field.type === "file") {
        control.accept = field.accept || "image/*";
        control.multiple = Boolean(field.multiple);
        if (field.capture) control.setAttribute("capture", field.capture);
      }
    }

    control.id = field.id;
    configureControl(control, field);
    control.required = Boolean(field.required);
    if (field.unit) {
      const inputWrapper = document.createElement("div");
      inputWrapper.className = "input-with-unit";
      const unit = document.createElement("span");
      unit.className = "input-unit";
      unit.textContent = field.unit;
      unit.setAttribute("aria-hidden", "true");
      inputWrapper.append(control, unit);
      wrapper.append(inputWrapper);
    } else {
      wrapper.append(control);
    }
  }

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
    section.fields.forEach((field) => {
      if (field.group) {
        const heading = document.createElement("h3");
        heading.className = "field-group-title";
        heading.textContent = field.group;
        grid.append(heading);
      }
      grid.append(createField(field));
    });
    fieldset.append(grid);
    fragment.append(fieldset);
  });
  container.replaceChildren(fragment);
}

export function updateDependencies(form) {
  form.querySelectorAll("[data-depends-on]").forEach((wrapper) => {
    const source = form.elements[wrapper.dataset.dependsOn];
    const active = source?.value === wrapper.dataset.dependsValue;
    const controls = [...wrapper.querySelectorAll("input, select, textarea")];
    wrapper.hidden = !active;
    controls.forEach((control) => {
      control.disabled = !active;
      if (!active) {
        if (control.type === "checkbox") control.checked = false;
        else control.value = "";
      }
    });
  });
}
