import Table from "./Table.js";

class SortableTable extends Table {
  constructor(className, sortableFieldNames) {
    super(className);
    this.sortableFieldNames = sortableFieldNames;
  }
  _toggleSortType(elem) {
    const types = elem.classList;
    if (types.contains("asc")) {
      types.add("desc");
      types.remove("asc");
      return [this._headerObj[elem.textContent], "desc"];
    }
    types.add("asc");
    types.remove("desc");

    return [this._headerObj[elem.textContent], "asc"];
  }

  _changedSort(field, type) {
    this._sortListeners?.forEach((lis) => lis([field, type]));
  }
  _sortEvent = (e) => {
    const [field, type] = this._toggleSortType(e.target);
    this._changedSort(field, type);
  };
  _createHead(headerObj) {
    this._headerObj = headerObj;
    const headers = super._createHeaders(Object.keys(headerObj)).map((el) => {
      if (this.sortableFieldNames.includes(headerObj[el.textContent])) {
        el.classList.add("sortable");
        el.onclick = this._sortEvent;
      }
      return el;
    });
    const headerLine = document.createElement("tr");
    headerLine.append(...headers);
    return headerLine;
  }
  onChageSort(...listeners) {
    this._sortListeners = listeners;
  }
}
export default SortableTable;
