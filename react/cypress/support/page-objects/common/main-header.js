export default class MainHeader {
  clickProfileDetailsElem() {
    cy.get(".info-profile-right").click();
  }

  clickBackBtn() {
    cy.get('button[class*="comp-logout"]').click();
  }
}
