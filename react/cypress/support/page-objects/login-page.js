export default class LoginPage {
  typeInUsernameInput(username) {
    cy.get(".main-panel-login input").type(username);
  }

  typeInPasswordInput(password) {
    cy.get(".main-panel-login input[name=password]").type(password);
  }

  clickNextBtn() {
    cy.get(".main-panel-login button[type=submit]").click();
  }

  clickLoginBtn() {
    cy.get(".main-panel-login button[type=submit]").click();
  }
}
