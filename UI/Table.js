class Table {
  constructor(className) {
    this.className = className;
  }

  _createHeaders(names) {
    return names.map((name) => {
      const td = document.createElement("th");
      td.textContent = name;
      return td;
    });
  }
  _createHead(headerObj) {
    this._headerObj = headerObj;

    const headerLine = document.createElement("tr");
    headerLine.append(...this._createHeaders(Object.keys(headerObj)));
    return headerLine;
  }

  _createBody(infos) {
    return infos.map((line) => {
      const tr = document.createElement("tr");
      const ordered = Object.values(this._headerObj).map((fieldName) => {
        const point = document.createElement("td");
        point.append(line[fieldName]);
        return point;
      });
      tr.append(...ordered);
      return tr;
    });
  }

  updateTable(headerObj, fields) {
    this.updateHead(headerObj);
    this.updateBody(fields);
  }

  updateBody(fields) {
    const bodyLines = this._createBody(fields);
    document
      .querySelector(`.${this.className}__body`)
      .replaceChildren(...bodyLines);
  }

  updateHead(headerObj) {
    const headerLine = this._createHead(headerObj);
    document
      .querySelector(`.${this.className}__head`)
      .replaceChildren(headerLine);
  }
  appendBody(fields) {
    const bodyLines = this._createBody(fields);
    document.querySelector(`.${this.className}__body`).append(...bodyLines);
  }
}
export default Table;
