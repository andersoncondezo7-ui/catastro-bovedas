let hideTimer;

export function showToast(element, message, type = "success") {
  clearTimeout(hideTimer);
  element.textContent = message;
  element.dataset.type = type;
  element.hidden = false;
  hideTimer = setTimeout(() => {
    element.hidden = true;
  }, 5000);
}
