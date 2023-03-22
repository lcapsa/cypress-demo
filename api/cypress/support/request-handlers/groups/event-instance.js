import { GROUPS } from "../../constants/endpoint.js";
import { DELETE, GET, POST, PUT } from "../../constants/verbs.js";

export default class EventInstanceRequest {
  create(token, eventId, instanceDetails) {
    return cy.request({
      method: POST,
      url: GROUPS.EVENT_INSTANCE,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        evID: eventId,
        eviStartDate: instanceDetails.startDate,
        eviEndDate: instanceDetails.endDate,
      },
      failOnStatusCode: false,
    });
  }

  generateInstanceId(token, eventId, instanceDetails) {
    return this.create(token, eventId, instanceDetails)
      .its("body")
      .should("have.property", "eviID");
  }

  viewInstancesForEvent(token, eventId) {
    return cy.request({
      method: GET,
      url: GROUPS.EVENT_INSTANCES,
      auth: {
        bearer: token,
      },
      qs: {
        eviEvID: eventId,
      },
      failOnStatusCode: false,
    });
  }

  update(token, instanceId, instanceDetails) {
    return cy.request({
      method: PUT,
      url: GROUPS.EVENT_INSTANCE,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        eviID: instanceId,
        eviStartDate: instanceDetails.startDate,
        eviEndDate: instanceDetails.endDate,
      },
      failOnStatusCode: false,
    });
  }

  delete(token, instanceId) {
    return cy.request({
      method: DELETE,
      url: GROUPS.EVENT_INSTANCE,
      auth: {
        bearer: token,
      },
      qs: {
        eviID: instanceId,
      },
      failOnStatusCode: false,
    });
  }
}
