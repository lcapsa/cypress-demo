import { ADST } from "../constants/cookies.js";

export function setAuthCookie(token) {
  Cypress.Cookies.debug(true, { verbose: false });
  cy.setCookie(ADST, token);
  Cypress.Cookies.defaults({ preserve: ADST });
}
