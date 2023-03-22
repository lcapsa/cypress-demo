import { AUTH_ENDPOINT } from "../constants/endpoint.js";

function requestAuth(user) {
  return cy
    .request({
      method: "POST",
      url: AUTH_ENDPOINT,
      form: true,
      body: {
        uaUserName: user.username,
        uaPassword: user.password,
        intent: "auth",
      },
    })
    .its("body");
}

export function getAuthToken(user) {
  return requestAuth(user).should("have.property", "atToken");
}
