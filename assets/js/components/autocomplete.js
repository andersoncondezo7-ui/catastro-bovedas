function normalize(value) {
  return String(value ?? "").trim().toLocaleUpperCase("es-PE");
}

export function findSuggestions(records, query, limit = 8) {
  const term = normalize(query);
  if (!term) return [];

  return records
    .map((record) => {
      const number = normalize(record.numero);
      const feeder = normalize(record.alimentador);
      const rank = number.startsWith(term)
        ? 0
        : number.includes(term)
          ? 1
          : feeder.startsWith(term)
            ? 2
            : feeder.includes(term)
              ? 3
              : 99;
      return { record, rank };
    })
    .filter((item) => item.rank < 99)
    .sort((a, b) => a.rank - b.rank || a.record.numero.localeCompare(b.record.numero, "es-PE"))
    .slice(0, limit)
    .map((item) => item.record);
}

export function createAutocomplete({ input, list, status, records, onSelect, limit = 8 }) {
  let suggestions = [];
  let activeIndex = -1;

  function close() {
    suggestions = [];
    activeIndex = -1;
    list.hidden = true;
    list.replaceChildren();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  function setActive(index) {
    if (!suggestions.length) return;
    activeIndex = (index + suggestions.length) % suggestions.length;
    list.querySelectorAll("[role='option']").forEach((option, optionIndex) => {
      const active = optionIndex === activeIndex;
      option.setAttribute("aria-selected", String(active));
      if (active) {
        input.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function choose(record) {
    input.value = record.numero;
    close();
    status.textContent = "SED " + record.numero + ", alimentador " + record.alimentador + ", seleccionada.";
    onSelect(record);
  }

  function render() {
    const query = input.value;
    suggestions = findSuggestions(records, query, limit);
    activeIndex = -1;
    list.replaceChildren();

    if (!query.trim()) {
      status.textContent = "";
      close();
      return;
    }

    if (!suggestions.length) {
      const empty = document.createElement("li");
      empty.className = "suggestion-empty";
      empty.textContent = "No hay SED coincidentes";
      list.append(empty);
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      status.textContent = "No se encontraron SED coincidentes.";
      return;
    }

    suggestions.forEach((record, index) => {
      const option = document.createElement("li");
      option.id = "sed-option-" + index;
      option.className = "suggestion-item";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.tabIndex = -1;

      const number = document.createElement("strong");
      number.textContent = record.numero;
      const feeder = document.createElement("span");
      feeder.textContent = "Alimentador " + record.alimentador;
      option.append(number, feeder);

      option.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        choose(record);
      });
      option.addEventListener("mousemove", () => setActive(index));
      list.append(option);
    });

    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    status.textContent = suggestions.length + " SED disponibles. Usa las flechas para recorrerlas.";
  }

  input.addEventListener("input", render);
  input.addEventListener("focus", () => {
    if (input.value.trim()) render();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (list.hidden) render();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      choose(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      close();
    }
  });
  input.addEventListener("blur", () => setTimeout(close, 100));

  return Object.freeze({ close, refresh: render });
}
