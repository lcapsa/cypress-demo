import { GROUPS } from "../../constants/endpoint.js";
import { DELETE, GET, POST, PUT } from "../../constants/verbs.js";

export default class GroupMembersRequest {
  sendInvite(token, groupId, userIdToAdd) {
    return cy.request({
      method: POST,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        grpID: groupId,
        "newMembers[]": userIdToAdd,
      },
      failOnStatusCode: false,
    });
  }

  join(token, groupId) {
    return cy.request({
      method: POST,
      url: GROUPS.JOIN,
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

  leave(token, groupId) {
    return cy.request({
      method: POST,
      url: GROUPS.LEAVE,
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

  joinWithInvite(senderToken, receiverToken, groupId, userIdToAdd) {
    this.sendInvite(senderToken, groupId, userIdToAdd).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("true");
    });

    return this.join(receiverToken, groupId);
  }

  addUserWithRole(senderToken, receiverToken, groupId, userIdToAdd, role) {
    this.joinWithInvite(
      senderToken,
      receiverToken,
      groupId,
      userIdToAdd,
      role
    ).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("grpmID");
      var memberId = response.body.grpmID;
      this.updateRole(senderToken, memberId, role).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.result).to.equal("true");
      });
    });
  }

  updateRole(token, memberId, role) {
    return cy.request({
      method: PUT,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        grpmID: memberId,
        grpmRole: role,
      },
      failOnStatusCode: false,
    });
  }

  updateStatus(token, memberId, status) {
    return cy.request({
      method: PUT,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        grpmID: memberId,
        grpmStatus: status,
      },
      failOnStatusCode: false,
    });
  }

  updateStatus(token, memberId, status) {
    return cy.request({
      method: PUT,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        grpmID: memberId,
        grpmStatus: status,
      },
      failOnStatusCode: false,
    });
  }

  delete(token, memberId) {
    return cy.request({
      method: DELETE,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        grpmID: memberId,
      },
      failOnStatusCode: false,
    });
  }

  list(token, groupId) {
    return cy.request({
      method: GET,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        grpID: groupId,
      },
      failOnStatusCode: false,
    });
  }

  filterByUserType(token, groupId, userType) {
    return cy.request({
      method: GET,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        grpID: groupId,
        uacTipID: userType,
      },
      failOnStatusCode: false,
    });
  }

  getOrderByName(token, groupId, fullName) {
    return cy.request({
      method: GET,
      url: GROUPS.MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        grpID: groupId,
        uaFullName: fullName,
      },
      failOnStatusCode: false,
    });
  }
}
