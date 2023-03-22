import { GROUPS } from "../../constants/endpoint.js";
import { DELETE, GET, POST, PUT } from "../../constants/verbs.js";

export default class GroupRequest {
  post(token, groupDetails) {
    return cy
      .request({
        method: POST,
        url: GROUPS.BASE_PATH,
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
      .its("body");
  }

  postOnlyDescription(token, description) {
    return cy
      .request({
        method: POST,
        url: GROUPS.BASE_PATH,
        auth: {
          bearer: token,
        },
        form: true,
        body: {
          grpDescription: description,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }

  postWithCoverPhoto(token, groupDetails, done) {
    cy.fixture(groupDetails.cover, "binary").then((photo) => {
      const blob = Cypress.Blob.binaryStringToBlob(photo, "image/png");
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.set("grpName", groupDetails.name);
      formData.set("grpIsPublic", groupDetails.isPublic);
      formData.set("grpDescription", groupDetails.description);
      formData.set("grpCover", blob);

      xhr.open(POST, GROUPS.BASE_PATH);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        done(xhr);
      };
      xhr.onerror = function () {
        done(xhr);
      };

      xhr.send(formData);
    });
  }

  generateGroupId(token, groupDetails) {
    return this.post(token, groupDetails).should("have.property", "grpID");
  }

  updateName(token, groupId, name) {
    return cy.request({
      method: PUT,
      url: GROUPS.BASE_PATH,
      form: true,
      body: {
        grpID: groupId,
        grpName: name,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  updateDescription(token, groupId, description) {
    return cy
      .request({
        method: PUT,
        url: GROUPS.BASE_PATH,
        form: true,
        body: {
          grpID: groupId,
          grpDescription: description,
        },
        auth: {
          bearer: token,
        },
      })
      .its("body");
  }

  updateIsPublic(token, groupId, isPublic) {
    return cy
      .request({
        method: PUT,
        url: GROUPS.BASE_PATH,
        form: true,
        body: {
          grpID: groupId,
          grpIsPublic: isPublic,
        },
        auth: {
          bearer: token,
        },
      })
      .its("body");
  }

  delete(token, groupId) {
    return cy.request({
      method: DELETE,
      url: GROUPS.BASE_PATH,
      qs: {
        grpID: groupId,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  getGroupNoAuth(groupId) {
    return cy.request({
      method: GET,
      url: GROUPS.BASE_PATH,
      qs: {
        grpID: groupId,
      },
      failOnStatusCode: false,
    });
  }

  getGroupDetails(token, groupId) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
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

  getList(token) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
        auth: {
          bearer: token,
        },
      })
      .its("body");
  }

  getSearch(token, groupId, toSearchFor) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
        qs: {
          grpID: groupId,
          search: toSearchFor,
        },
        auth: {
          bearer: token,
        },
      })
      .its("body");
  }

  getUserRole(token, groupId, isUserRole) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
        qs: {
          grpID: groupId,
          withUserInfo: isUserRole,
        },
        auth: {
          bearer: token,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }

  getGroupMemberCount(token, groupId) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
        qs: {
          grpID: groupId,
          withMemberCount: 1,
        },
        auth: {
          bearer: token,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }

  getFilterByUserRole(token, userRole) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
        qs: {
          withUserInfo: 1,
          grpmRole: userRole,
        },
        auth: {
          bearer: token,
        },
      })
      .its("body");
  }

  getRoleWithoutwithUserInfo(token, role) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
        qs: {
          grpmRole: role,
        },
        auth: {
          bearer: token,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }

  getFilterByUserStatus(token, userStatus) {
    return cy
      .request({
        method: GET,
        url: GROUPS.BASE_PATH,
        qs: {
          withUserInfo: 1,
          grpmStatus: userStatus,
        },
        auth: {
          bearer: token,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }
}
