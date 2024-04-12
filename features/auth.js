import { fetchTokens } from "../API/authAPI.js";

const secret =
  "oi6mVKOjzcrGRkRwKEnjDciyg2oZHuoNpNbYENbq261reIsecIaihUdN3kAHuluU";
const id = "83ee5d3f-b321-4448-8c16-1be83a099f3a";

function Tokens(accessToken, refreshToken, expires_in) {
  const timeEnd = Date.now() + expires_in * 1000;
  return {
    accessToken,
    refreshToken,
    timeEnd,
  };
}

function saveTokens(tokensData) {
  const { access_token, refresh_token, expires_in } = tokensData;
  const tokens = new Tokens(access_token, refresh_token, expires_in);
  localStorage.setItem("tokens", JSON.stringify(tokens));
  return tokens;
}

const getTokens = (secret, id) => async (authCode) => {
  const tokensCashed = JSON.parse(localStorage.getItem("tokens"));

  if (tokensCashed && tokensCashed.timeEnd - Date.now() < 0) {
    return await fetchTokens(
      secret,
      id,
      "REFRESH",
      tokensCashed.refreshToken
    ).then((tokensData) => {
      console.log("success Refresh Tokens");
      return saveTokens(tokensData);
    });
  }
  if (tokensCashed) {
    return tokensCashed;
  }

  return await fetchTokens(secret, id, "AUTH", authCode).then((tokensData) =>
    saveTokens(tokensData)
  );
};

export const getTockensByAuth = getTokens(secret, id);
