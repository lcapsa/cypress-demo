import { AUTH_ENDPOINT } from "../constants/endpoint.js";

export function authorizeUser(user) {
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
