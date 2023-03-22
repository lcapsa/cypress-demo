export default class MainMenuNav {
  getMessagesLink() {
    return cy.get('.mainmenu-nav a[href="/ro/messages"]');
  }

  getProgressLink() {
    return cy.get(".mainmenu-nav  > :nth-child(3)").should("be.visible");
  }

  clickMessagesLink() {
    this.getMessagesLink().wait(500).click();
  }

  clickProgressLink() {
    this.getProgressLink().click();
  }

  clickGroupsLink() {
    return cy
      .get(".mainmenu-nav  > :nth-child(10)")
      .should("be.visible")
      .click();
  }
}
