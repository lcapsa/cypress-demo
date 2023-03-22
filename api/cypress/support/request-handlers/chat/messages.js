import { CHAT } from "../../constants/endpoint.js";
import { DELETE, GET, POST } from "../../constants/verbs.js";

export default class ChatMessagesRequest {
  post(token, messageDetails) {
    return cy.request({
      method: POST,
      url: CHAT.MESSAGE,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        crID: messageDetails.id,
        cmsgType: messageDetails.type,
        cmsgText: messageDetails.content,
      },
      failOnStatusCode: false,
    });
  }

  delete(token, messageId) {
    return cy.request({
      method: DELETE,
      url: CHAT.MESSAGE,
      qs: {
        cmsgID: messageId,
      },
      auth: {
        bearer: token,
      },
      form: true,
      failOnStatusCode: false,
    });
  }

  viewMessagesInRoom(token, roomId) {
    return cy.request({
      method: GET,
      url: CHAT.MESSAGES,
      qs: {
        crID: roomId,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  viewAMessage(token, roomId, messageId) {
    return cy.request({
      method: GET,
      url: CHAT.MESSAGES,
      qs: {
        crID: roomId,
        cmsgID: messageId,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  reportMessage(token, messageId){
    return cy.request({
      method: POST,
      url: CHAT.REPORT,
      form: true,
      body: {
        cmsgID: messageId,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    }); 
  }
}
