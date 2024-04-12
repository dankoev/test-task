import { ACCOUNT_PATH, PROXY } from "../share/costants.js";

const redirect_uri = "https://localhost:5500";

export const fetchTokens = async (secret, id, type, authCodeOrRefresh) => {
  const requestBodyTypes = {
    AUTH: {
      client_id: id,
      client_secret: secret,
      redirect_uri,
      grant_type: "authorization_code",
      code: authCodeOrRefresh,
    },
    REFRESH: {
      client_id: id,
      client_secret: secret,
      redirect_uri,
      grant_type: "refresh_token",
      refresh_token: authCodeOrRefresh,
    },
  };
  return await fetch(`${PROXY}/${ACCOUNT_PATH}/oauth2/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(requestBodyTypes[type]),
  })
    .then(async (res) => {
      if (res.ok) {
        return res;
      }
      throw new Error(await res.text());
    })
    .then((res) => res.json());
};
