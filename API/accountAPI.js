import { ACCOUNT_PATH, PROXY } from "../share/costants.js";

async function requsetTemplate(accessToken, url) {
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
    .then(async (res) => {
      if (res.ok) {
        return res;
      }
      throw new Error(await res.text());
    })
    .then((res) => res.json());
}
async function fetchLeads(accessToken, limit, page) {
  return await requsetTemplate(
    accessToken,
    `${PROXY}/${ACCOUNT_PATH}/api/v4/leads?page=${page}&limit=${limit}`
  );
}

async function fetchUserById(accessToken, id) {
  return await requsetTemplate(
    accessToken,
    `${PROXY}/${ACCOUNT_PATH}/api/v4/users/${id}`
  );
}
export { fetchLeads, fetchUserById };
