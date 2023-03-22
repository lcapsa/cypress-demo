import { GROUPS } from "../../constants/endpoint.js";
import { DELETE, GET, POST, PUT } from "../../constants/verbs.js";

export default class InstanceMembersRequest {
  add(token, instanceId, userId) {
    return cy.request({
      method: POST,
      url: GROUPS.EVENT_MEMBERS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        evmEviID: instanceId,
        evmMarkUaID: userId,
      },
      failOnStatusCode: false,
    });
  }

  generateMemberId(token, instanceId, userId) {
    return cy
      .request({
        method: POST,
        url: GROUPS.EVENT_MEMBERS,
        auth: {
          bearer: token,
        },
        form: true,
        body: {
          evmEviID: instanceId,
          evmMarkUaID: userId,
        },
      })
      .its("body")
      .should("have.property", "evmGrpmID");
  }

  viewMembers(token, instanceId) {
    return cy.request({
      method: GET,
      url: GROUPS.EVENT_MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        evmEviID: instanceId,
      },
      failOnStatusCode: false,
    });
  }

  filterMembersByMark(token, instanceId, markId) {
    return cy.request({
      method: GET,
      url: GROUPS.EVENT_MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        evmEviID: instanceId,
        evmMarkID: markId,
      },
      failOnStatusCode: false,
    });
  }

  filterMembersByUserType(token, instanceId, userType) {
    return cy.request({
      method: GET,
      url: GROUPS.EVENT_MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        evmEviID: instanceId,
        uacTipID: userType,
      },
      failOnStatusCode: false,
    });
  }

  updateMark(token, instanceId, memberId, mark) {
    return cy.request({
      method: PUT,
      url: GROUPS.EVENT_MEMBERS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        evmEviID: instanceId,
        evmGrpmID: memberId,
        evmMarkID: mark,
      },
      failOnStatusCode: false,
    });
  }

  delete(token, instanceId, memberId) {
    return cy.request({
      method: DELETE,
      url: GROUPS.EVENT_MEMBERS,
      auth: {
        bearer: token,
      },
      qs: {
        evmEviID: instanceId,
        evmGrpmID: memberId,
      },
      failOnStatusCode: false,
    });
  }
}
