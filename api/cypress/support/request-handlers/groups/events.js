import { GROUPS } from "../../constants/endpoint.js";
import { DELETE, GET, POST, PUT } from "../../constants/verbs.js";

export default class GroupEventsRequest {
  createEvent(token, groupId, eventDetails) {
    return cy.request({
      method: POST,
      url: GROUPS.EVENTS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        evGrpID: groupId,
        evName: eventDetails.name,
        evDescription: eventDetails.description,
        evInviteMode: eventDetails.inviteMode,
        "eviStartDate[]": eventDetails.startDate,
        "eviEndDate[]": eventDetails.endDate,
      },
      failOnStatusCode: false,
    });
  }

  generateEventId(token, groupId, eventDetails) {
    return this.createEvent(token, groupId, eventDetails)
      .its("body")
      .should("have.property", "evID");
  }

  viewEventsInGroup(token, groupId) {
    return cy.request({
      method: GET,
      url: GROUPS.EVENTS,
      auth: {
        bearer: token,
      },
      qs: {
        evGrpID: groupId,
        withNextInstance: 1,
      },
      failOnStatusCode: false,
    });
  }

  viewEvent(token, groupId, eventId) {
    return cy.request({
      method: GET,
      url: GROUPS.EVENTS,
      auth: {
        bearer: token,
      },
      qs: {
        evGrpID: groupId,
        evID: eventId,
        withNextInstance: 1,
      },
      failOnStatusCode: false,
    });
  }

  update(token, eventId, eventDetails) {
    return cy.request({
      method: PUT,
      url: GROUPS.EVENTS,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        evID: eventId,
        evName: eventDetails.name,
        evDescription: eventDetails.description,
      },
      failOnStatusCode: false,
    });
  }

  delete(token, eventId) {
    return cy.request({
      method: DELETE,
      url: GROUPS.EVENTS,
      auth: {
        bearer: token,
      },
      qs: {
        evID: eventId,
      },
      failOnStatusCode: false,
    });
  }
}
