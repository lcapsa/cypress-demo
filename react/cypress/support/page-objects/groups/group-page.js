export default class GroupPage {
  clickGroupCard() {
    return cy
      .get(".group-list__grid-container > :nth-child(1)")
      .should("be.visible")
      .click();
  }

  getGroupImage() {
    return cy.get(".groups__discussions .groups__group-image");
  }

  getGroupTitle() {
    return cy.get(".content-text div:first-child");
  }

  getGroupType() {
    return cy.get(".groups__discussions .groups__group-type");
  }

  getGroupCreateDate() {
    return cy.get(".groups__discussions .groups__created-date");
  }

  getGroupControlers() {
    return cy.get(".groups__discussions .groups__group-controls");
  }
  getGroupDescription() {
    return cy.get(".groups__discussions .groups__group-description");
  }

  getCompTabsDetails() {
    return cy.get(".comp-tabs #item-0");
  }

  getCompTabsMembers() {
    return cy.get(".comp-tabs #item-1");
  }

  getCompTabsEvents() {
    return cy.get(".comp-tabs #item-2");
  }
}
