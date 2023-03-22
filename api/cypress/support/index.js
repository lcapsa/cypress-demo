import { authorizeUser } from "./request-handlers/auth.js";

before(function () {
  cy.fixture("student-credentials").then(function (student) {
    authorizeUser(student).then((response) => {
      expect(response).to.have.property("atToken");
      expect(response).to.have.property("uaID");
      cy.wrap(response.atToken).as("studentAtToken");
      cy.wrap(response.uaID).as("studentUaId");
    });
  });

  cy.fixture("parent-credentials").then(function (parent) {
    authorizeUser(parent).then((response) => {
      expect(response).to.have.property("atToken");
      expect(response).to.have.property("uaID");
      cy.wrap(response.atToken).as("parentAtToken");
      cy.wrap(response.uaID).as("parentUaId");
    });
  });

  cy.fixture("professor-credentials").then(function (parent) {
    authorizeUser(parent).then((response) => {
      expect(response).to.have.property("atToken");
      expect(response).to.have.property("uaID");
      cy.wrap(response.atToken).as("professorAtToken");
      cy.wrap(response.uaID).as("professorUaId");
    });
  });
});
