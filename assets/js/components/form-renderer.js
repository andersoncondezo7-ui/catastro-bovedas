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
  label.id = field.id + "-label";
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
    checkbox.id = field.id + "-" + index;
    checkbox.value = value;
    configureControl(checkbox, field);
    const text = document.createElement("span");
    text.textContent = value;
    row.append(checkbox, text);
    group.append(row);
  });
  return group;
}

function createDependencyLink(field, sourceLabel) {
  const note = document.createElement("div");
  note.className = "dependency-link";
  const icon = document.createElement("span");
  icon.className = "dependency-link-icon";
  icon.textContent = "↳";
  icon.setAttribute("aria-hidden", "true");
  const copy = document.createElement("span");
  copy.append("Pregunta relacionada con ");
  const strong = document.createElement("strong");
  strong.textContent = sourceLabel;
  copy.append(strong, " = " + field.dependsOn.equals);
  note.append(icon, copy);
  return note;
}

function createField(field, context = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "field-card";
  wrapper.dataset.fieldId = field.id;
  if (field.phase) wrapper.classList.add("phase-field");
  if (field.dependsOn) {
    wrapper.classList.add("field-card-dependent");
    wrapper.dataset.dependsOn = field.dependsOn.field;
    wrapper.dataset.dependsValue = field.dependsOn.equals;
    wrapper.append(createDependencyLink(field, context.sourceLabel || field.dependsOn.field));
  }

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.textContent = context.labelOverride || field.label;
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
  if (context.dependentCount) {
    const triggerNote = document.createElement("div");
    triggerNote.className = "dependency-trigger-note";
    const values = [...new Set(context.dependentValues || [])].map((value) => "“" + value + "”").join(" o ");
    const countText = context.dependentCount === 1 ? "mostrará 1 pregunta relacionada" : "mostrarán " + context.dependentCount + " preguntas relacionadas";
    triggerNote.textContent = "Al elegir " + values + ", se " + countText + ".";
    wrapper.append(triggerNote);
  }
  return wrapper;
}

function createMeasurementGroup(fields, contextFor) {
  const group = document.createElement("section");
  group.className = "measurement-group";
  group.setAttribute("aria-labelledby", "measurement-" + fields[0].measurementGroup);
  const header = document.createElement("div");
  header.className = "measurement-group-header";
  const title = document.createElement("h3");
  title.id = "measurement-" + fields[0].measurementGroup;
  title.textContent = fields[0].measurementTitle;
  const help = document.createElement("p");
  help.textContent = "Registra las tres fases en orden: R, S y T.";
  header.append(title, help);
  const phaseGrid = document.createElement("div");
  phaseGrid.className = "phase-grid";
  fields.forEach((field) => phaseGrid.append(createField(field, { ...contextFor(field), labelOverride: "Fase " + field.phase })));
  group.append(header, phaseGrid);
  return group;
}

export function renderFormSections(container, schema) {
  const fragment = document.createDocumentFragment();
  const allFields = schema.flatMap((section) => section.fields);
  const fieldById = new Map(allFields.map((field) => [field.id, field]));
  const dependentsBySource = new Map();
  allFields.forEach((field) => {
    if (!field.dependsOn) return;
    const list = dependentsBySource.get(field.dependsOn.field) || [];
    list.push(field);
    dependentsBySource.set(field.dependsOn.field, list);
  });
  const contextFor = (field) => {
    const dependents = dependentsBySource.get(field.id) || [];
    return {
      sourceLabel: field.dependsOn ? fieldById.get(field.dependsOn.field)?.label : undefined,
      dependentCount: dependents.length,
      dependentValues: dependents.map((item) => item.dependsOn.equals),
    };
  };

  schema.forEach((section, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "form-section";
    fieldset.dataset.inspectionGroup = section.groupKey || "general";

    const groupBanner = document.createElement("div");
    groupBanner.className = "form-group-banner form-group-banner-" + (section.groupKey || "general");
    const groupName = document.createElement("strong");
    groupName.textContent = section.group || "Inspección";
    const groupProgress = document.createElement("span");
    const groupSections = schema.filter((item) => item.groupKey === section.groupKey);
    const groupPosition = groupSections.findIndex((item) => item.id === section.id) + 1;
    groupProgress.textContent = "Pantalla " + groupPosition + " de " + groupSections.length;
    groupBanner.append(groupName, groupProgress);
    fieldset.append(groupBanner);

    const legend = document.createElement("legend");
    legend.innerHTML = "<span>" + String(index + 4).padStart(2, "0") + "</span>" + section.title;
    fieldset.append(legend);
    const description = document.createElement("p");
    description.className = "section-description";
    description.textContent = section.description;
    fieldset.append(description);
    const grid = document.createElement("div");
    grid.className = "field-grid";
    const renderedMeasurementGroups = new Set();
    const renderedFieldGroups = new Set();
    section.fields.forEach((field) => {
      if (field.measurementGroup) {
        if (renderedMeasurementGroups.has(field.measurementGroup)) return;
        renderedMeasurementGroups.add(field.measurementGroup);
        const groupFields = section.fields.filter((item) => item.measurementGroup === field.measurementGroup);
        grid.append(createMeasurementGroup(groupFields, contextFor));
        return;
      }
      if (field.group && !renderedFieldGroups.has(field.group)) {
        renderedFieldGroups.add(field.group);
        const heading = document.createElement("h3");
        heading.className = "field-group-title";
        heading.textContent = field.group;
        grid.append(heading);
      }
      grid.append(createField(field, contextFor(field)));
    });
    fieldset.append(grid);
    fragment.append(fieldset);
  });
  container.replaceChildren(fragment);
}

export function updateDependencies(form) {
  form.querySelectorAll(".dependency-active").forEach((wrapper) => wrapper.classList.remove("dependency-active"));
  form.querySelectorAll("[data-depends-on]").forEach((wrapper) => {
    const source = form.elements[wrapper.dataset.dependsOn];
    const active = source?.value === wrapper.dataset.dependsValue;
    const controls = [...wrapper.querySelectorAll("input, select, textarea")];
    wrapper.hidden = !active;
    wrapper.classList.toggle("dependency-visible", active);
    if (active) form.querySelector('[data-field-id="' + wrapper.dataset.dependsOn + '"]')?.classList.add("dependency-active");
    controls.forEach((control) => {
      control.disabled = !active;
      if (!active) {
        if (control.type === "checkbox") control.checked = false;
        else control.value = "";
      }
    });
  });
}
