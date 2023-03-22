import { CHAT } from "../../constants/endpoint.js";
import { GET } from "../../constants/verbs.js";

export default class ChatMembersRequest {
  list(token, roomId) {
    return cy.request({
      method: GET,
      url: CHAT.MEMBERS,
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
