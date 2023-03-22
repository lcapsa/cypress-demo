export default class GroupsMainPage {
  verifyTabsComponent() {
    return cy.get(".scroll-div").should("be.visible");
  }

  clickMyGroupsTab() {
    return cy.get(".comp-tabs #item-0").should("be.visible").click();
  }

  clickOtherGroupsTab() {
    return cy.get(".scroll-div #item-1 a").should("be.visible").click();
  }

  clickAddNewGroupBtn() {
    return cy.get(".group-list__wrapper .orange").should("be.visible").click();
  }

  clickGoBackBtn() {
    return cy.get(".comp-new-group .goBack").should("be.visible").click();
  }

  typeSearchField(query) {
    return cy
      .get(".comp-search #search-input")
      .should("be.visible")
      .type(query);
  }

  clickCloseButtonSearchField() {
    return cy.get(".comp-search ._icon").should("be.visible").click();
  }

  getGroupCard() {
    return cy.get(".group-list__grid-container .group-preview__wrapper");
  }

  getGroupTitle() {
    return cy.get(".group-preview__details-container .group-preview__title");
  }
  getGroupDescription() {
    return cy.get(
      ".group-preview__details-container .group-preview__description"
    );
  }

  getUserIcon() {
    return cy.get(".group-preview__icons-container .group-preview__user-icon");
  }
  getUserCount() {
    return cy.get(".group-preview__icons-container .group-preview__user-count");
  }
}
