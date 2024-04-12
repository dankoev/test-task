import {
  getIntervalLeads,
  getLeadsByPage,
  getOrderedLeadsByPage,
  getOrderedLeadsByPageWith,
  sortableFields,
} from "../features/leads.js";
import SortableTable from "./SortableTable.js";

const headers = {
  "Название сделки": "name",
  Бюджеты: "price",
  "Дата создания": "created_at",
  "Дата изменения": "updated_at",
  Ответсвенный: "responsible_user_id",
  Создана: "created_by",
  Обновлена: "updated_by",
};

const dealsTable = new SortableTable("deals-table", sortableFields);

let updateListeners = null;
function changeData(newData) {
  updateListeners?.forEach((lis) => lis(newData));
}
export const dealsTableUpdater = (accessToken) => async (limit, page) => {
  return getLeadsByPage(accessToken, limit, page)
    .then((leadsInfo) => {
      changeData(leadsInfo);
      dealsTable.updateTable(headers, leadsInfo.infos);
    })
    .catch((err) => console.log(err));
};

export const orderedDealsTableUpdater =
  (accessToken) => async (limit, page) => {
    const sortFn = await getOrderedLeadsByPageWith(
      accessToken,
      limit,
      page
    ).then((withFn) => withFn("userName"));

    const initLeads = sortFn(null, null);
    changeData(initLeads);
    dealsTable.updateTable(headers, initLeads.infos);

    return (sortedBy, order) => {
      const sortedLeads = sortFn(sortedBy, order);
      dealsTable.updateBody(sortedLeads.infos);
    };
  };

export const intervalDealsTableUpdater = (accessToken) => {
  const [startInterval, abort] = getIntervalLeads(accessToken, 5, 2000);
  dealsTable.updateHead(headers);
  const start = async () => {
    dealsTable.updateBody([]);
    const sortFn = await startInterval("userName", (data) =>
      dealsTable.appendBody(data.infos)
    );
    return (sortedBy, order) => {
      const sortedLeads = sortFn(sortedBy, order);
      dealsTable.updateBody(sortedLeads.infos);
    };
  };
  return [start, abort];
};

const onUpdateLeadsTable = (...listeners) => {
  updateListeners = listeners;
};
const onChangeSortLeadsTable = dealsTable.onChageSort.bind(dealsTable);
export { onUpdateLeadsTable, onChangeSortLeadsTable };
// getIntervalLeads(
//   tokens.accessToken,
//   5,
//   1000
// )("userName", (chunck) => console.log(chunck)).then(fn =</>);
