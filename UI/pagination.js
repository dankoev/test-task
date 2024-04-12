import { onUpdateLeadsTable } from "./deals-table.js";

const pagitationPage = document.querySelector(".pagination__page");
const pagitationNext = document.querySelector(".pagination__next");
const pagitationPrev = document.querySelector(".pagination__prev");

onUpdateLeadsTable((data) => {
  const { next, prev, page } = data;
  pagitationPage.textContent = page;

  unblockButtons();
  if (next) {
    pagitationNext.classList.remove("hidden");
  } else {
    pagitationNext.classList.add("hidden");
  }

  if (prev) {
    pagitationPrev.classList.remove("hidden");
  } else {
    pagitationPrev.classList.add("hidden");
  }
});

function getPage() {
  return +pagitationPage.textContent.trim();
}
function blockButtons() {
  pagitationNext.disabled = true;
  pagitationPrev.disabled = true;
}

function unblockButtons() {
  pagitationNext.disabled = false;
  pagitationPrev.disabled = false;
}

export function onChangePage(...listeners) {
  listeners.map((fn) => fn(getPage()));

  pagitationNext.onclick = () => {
    blockButtons();
    const newval = getPage() + 1;
    listeners.map((fn) => fn(newval));
  };

  pagitationPrev.onclick = () => {
    blockButtons();
    const newval = getPage() - 1;
    listeners.map((fn) => fn(newval));
  };
}
