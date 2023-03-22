import { GROUPS, GROUPS_JOIN } from "../constants/endpoint.js";

export default class GroupRequest {
  generateGroupId(token, groupDetails) {
    return cy
      .request({
        method: "POST",
        url: GROUPS,
        auth: {
          bearer: token,
        },
        form: true,
        body: {
          grpName: groupDetails.name,
          grpIsPublic: groupDetails.isPublic,
          grpDescription: groupDetails.description,
        },
        failOnStatusCode: false,
      })
      .its("body")
      .should("have.property", "grpID");
  }

  getGroupDetails(token, groupId) {
    return cy
      .request({
        method: "GET",
        url: GROUPS,
        qs: {
          grpID: groupId,
        },
        auth: {
          bearer: token,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }

  join(token, groupId) {
    return cy.request({
      method: POST,
      url: GROUPS_JOIN,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        grpID: groupId,
      },
      failOnStatusCode: false,
    });
  }
}
