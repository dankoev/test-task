export function loadingDecorate(forItem, fn) {
  const loadingItem = document.querySelector(`.loading-item__${forItem}`);

  return async (...args) => {
    loadingItem.classList.add("active");
    return fn(...args).finally((_) => loadingItem.classList.remove("active"));
  };
}
