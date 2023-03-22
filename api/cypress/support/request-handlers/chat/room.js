import { CHAT } from "../../constants/endpoint.js";
import { PUT, GET } from "../../constants/verbs.js";

export default class ChatRoomRequest {
  update(token, roomId, isModerated) {
    return cy.request({
      method: PUT,
      url: CHAT.ROOM,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        crID: roomId,
        crIsModerated: isModerated,
      },
      failOnStatusCode: false,
    });
  }

  viewRoom(token, roomId) {
    return cy.request({
      method: GET,
      url: CHAT.ROOM,
      auth: {
        bearer: token,
      },
      qs: {
        crID: roomId,
      },
      failOnStatusCode: false,
    });
  }
}
