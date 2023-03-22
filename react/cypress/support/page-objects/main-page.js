import { NEWS } from "../../support/constants/urls-ui.js";
import { authorizeUser } from "../../support/setup-handlers/auth-user.js";

export default class MainPage {
  navigateToAsUser(userType) {
    authorizeUser(userType);

    cy.visit("");
    cy.url().should("eq", NEWS);
  }
}
