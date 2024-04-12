import { fetchUserById } from "../API/accountAPI.js";

export const getUserById = async (accessToken, userId) => {
  const { id, name } = await fetchUserById(accessToken, userId);
  return { id, name };
};

const asyncMemo = (asyncFn, key) => {
  const cache = new Map();
  return async (...args) => {
    if (cache.has(key)) {
      return cache.get(key);
    }
    const data = await asyncFn(...args);
    cache.set(key, data);
    return data;
  };
};
const memoGetUserById = asyncMemo(getUserById, "id");

export const getUsersByIds = async (accessToken, ids) => {
  return Promise.allSettled(
    ids.map((id) => memoGetUserById(accessToken, id))
  ).then((results) =>
    results.reduce((acc, res) => {
      if (res.status == "fulfilled") {
        acc[res.value.id] = res.value;
      }
      return acc;
    }, {})
  );
};
