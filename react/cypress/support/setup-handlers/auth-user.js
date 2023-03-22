import { PARENT, STUDENT } from "../constants/user-type.js";
import { getAuthToken } from "../request-handlers/auth.js";
import { setAuthCookie } from "./cookies.js";

export function authorizeStudent() {
  cy.fixture(STUDENT.CREDENTIALS).then(function (student) {
    getAuthToken(student).then((token) => {
      setAuthCookie(token);
      cy.wrap(token).as(STUDENT.TOKEN);
    });
  });
}

function authorizeParent() {
  cy.fixture(PARENT.CREDENTIALS).then(function (credentials) {
    getAuthToken(credentials).then((token) => {
      setAuthCookie(token);
      cy.wrap(token).as(PARENT.TOKEN);
    });
  });
}

export function authorizeUser(userType) {
  if (userType === PARENT.TYPE) {
    authorizeParent();
  }
}
