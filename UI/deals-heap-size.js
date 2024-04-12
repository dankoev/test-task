export function onChangeTableHeap(...listeners) {
  const heap = document.querySelector("#deals-heap-size");
  listeners.forEach((fn) => fn(heap.value));

  heap.addEventListener("change", (e) => {
    listeners.forEach((fn) => fn(e.target.value));
  });
}
