export default class NewGroupPage {
  typeInGroupNameInput(groupName) {
    return cy
      .get('input[name*="grpName"]')
      .should("be.visible")
      .type(groupName);
  }

  clickPrivateGroupLink() {
    return cy.get(".form__wrapper #private-group").should("be.visible").click();
  }

  getGroupDescription() {
    return cy.get(".form__wrapper .tox-edit-area");
  }

  clickCreateGroupButton() {
    return cy
      .get(".form-groups-container .form__button")
      .should("be.visible")
      .click();
  }
}
