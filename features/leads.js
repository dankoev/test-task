import { fetchLeads } from "../API/accountAPI.js";
import { getUsersByIds } from "./users.js";

const availableWith = {
  userName: async (accessToken, leadsData) => {
    const { infos } = leadsData;
    const updatedFields = ["created_by", "updated_by", "responsible_user_id"];
    const ids = new Set();
    infos.forEach((el) => updatedFields.forEach((fiels) => ids.add(el[fiels])));

    const users = await getUsersByIds(accessToken, [...ids]).catch((err) =>
      console.log(err)
    );
    const newInfos = leadsData.infos.map((el) => {
      return {
        ...el,
        ...updatedFields.reduce((acc, field) => {
          acc[field] = users[el[field]]?.name;
          return acc;
        }, {}),
      };
    });
    return {
      ...leadsData,
      infos: newInfos,
    };
  },
};

export const getLeadsByPage = async (accessToken, limit, page) => {
  const data = await fetchLeads(accessToken, limit, page);
  console.log("fetch");
  const leads = data._embedded.leads.map((info) => {
    const {
      name,
      price,
      created_by,
      updated_by,
      created_at,
      updated_at,
      responsible_user_id,
    } = info;
    return {
      name,
      price,
      created_by,
      updated_by,
      created_at: new Date(created_at * 1000).toLocaleString(),
      updated_at: new Date(updated_at * 1000).toLocaleString(),
      responsible_user_id,
    };
  });
  const leadsData = {
    page: data._page,
    infos: leads,
    next: data._links.next ? page + 1 : null,
    prev: data._links.prev ? page - 1 : null,
  };
  return leadsData;
};

const sortedFns = {
  name: (order) => (prev, curr) => {
    const name = "name";
    if (order > 0) return prev[name].localeCompare(curr[name]);
    return curr[name].localeCompare(prev[name]);
  },
  price: (order) => (prev, curr) => {
    const name = "price";
    if (order > 0) return prev[name] - curr[name];
    return curr[name] - prev[name];
  },
};

const orderTypes = {
  asc: 1,
  desc: -1,
};
export const sortableFields = Object.keys(sortedFns);

const sortedFn = (sortableData) => (sortedBy, order) => {
  const sortedFn = sortedFns[sortedBy];
  if (!sortedFn) {
    return sortableData;
  }
  return {
    ...sortableData,
    infos: sortableData.infos.toSorted(sortedFn(orderTypes[order])),
  };
};

export const getOrderedLeadsByPage = async (accessToken, limit, page) => {
  const dataInPage = await getLeadsByPage(accessToken, limit, page);

  return sortedFn({ ...dataInPage, sortableFields });
};

export const getOrderedLeadsByPageWith = async (accessToken, limit, page) => {
  const dataInPage = await getLeadsByPage(accessToken, limit, page);

  return async (withData) => {
    const withFn = availableWith[withData];
    const newData = (await withFn?.(accessToken, dataInPage)) ?? dataInPage;
    return sortedFn(newData);
  };
};

export const getIntervalLeads = (accessToken, limit, delay) => {
  let timer;
  let reject;
  const abort = () => {
    clearInterval(timer);
    if (reject) reject("abort");
  };
  const startFn = async (withData, listener) => {
    let page = 1;
    let isBlocked = false;
    let allLeadsData;
    const withFn = availableWith[withData];
    return new Promise((resolve, rej) => {
      reject = rej;
      timer = setInterval(async () => {
        if (isBlocked) return;
        try {
          isBlocked = true;
          const dataInPage = await getLeadsByPage(accessToken, limit, page);
          const newData =
            (await withFn?.(accessToken, dataInPage)) ?? dataInPage;

          if (allLeadsData) {
            const concated = allLeadsData.infos.concat(newData.infos);
            allLeadsData.infos = concated;
          } else {
            allLeadsData = newData;
          }

          listener(newData);
          if (dataInPage.next == null) {
            console.log("clear");
            clearInterval(timer);
            resolve(sortedFn(allLeadsData));
          }

          page++;
          isBlocked = false;
        } catch (error) {
          console.log(error);
        } finally {
          isBlocked = false;
        }
      }, delay);
    });
  };
  return [startFn, abort];
};
