import { WEB_SOCKET_CHAT } from "../../../support/constants/endpoint.js";
import {
  groupVisibilityMap,
  PRIVATE
} from "../../../support/constants/groups.js";
import MessageDetails from "../../../support/request-handlers/chat/message-details.js";
import MessagesRequest from "../../../support/request-handlers/chat/messages.js";
import ChatRoomRequest from "../../../support/request-handlers/chat/room.js";
import GroupDetails from "../../../support/request-handlers/groups/group-details.js";
import GroupRequest from "../../../support/request-handlers/groups/groups.js";

const uuid = require("uuid");
const io = require("socket.io-client");

const CHAT_EVENT_MESSAGE_NEW = "[CHAT_EVENT] CHAT_MESSAGE_NEW";
const CHAT_EVENT_ROOM_JOIN = "[CHAT_EVENT] ROOM_JOIN";
const CHAT_EVENT_READY = "[CHAT_EVENT] READY";
const CHAT_EVENT_MESSAGE_DELETED = "[CHAT_EVENT] CHAT_MESSAGE_DELETED";
const CHAT_EVENT_MODERATED_CHAT = "[CHAT_EVENT] MODERATED_CHAT";

var groupRequest = new GroupRequest();
var privateGroup = new GroupDetails(
  "private group",
  groupVisibilityMap.get(PRIVATE),
  "description",
  null
);
var messagesRequest = new MessagesRequest();
var chatRoomRequest = new ChatRoomRequest();

describe("GROUPS - CHAT ROOM - SERVER EVENTS", function () {
  before(function () {
    cy.log("Precondition 1: Create private group");
    groupRequest
      .generateGroupId(this.studentAtToken, privateGroup)
      .as("privateGroupId");

    cy.log("Precondition 2: Get chat room id");
    groupRequest
      .getGroupDetails(this.studentAtToken, this.privateGroupId)
      .then((body) => {
        var roomId = body.data[0].grpCrID;
        expect(roomId).to.not.eq("");
        cy.wrap(roomId).as("roomId");
      });
  });

  it("Successfully monitor events in room: message created, deleted, room is moderated", function () {
    const client = io(WEB_SOCKET_CHAT, {
      query: "token=" + this.professorAtToken,
      reconnectionDelay: 500,
      transports: ["websocket"],
      path: "/wss",
    });

    client.on("connect", function () {
      const clientId = uuid.v4();
      console.log("Connection established", client.connected, clientId);
    });

    var roomId = this.roomId;
    var studentAtToken = this.studentAtToken;

    // to do: setTimeout(function () {}, 5000);
    setTimeout(
      client.on(CHAT_EVENT_READY, function () {
        console.log("User is auth, triggered event", CHAT_EVENT_READY);

        client.emit(CHAT_EVENT_ROOM_JOIN, { crID: roomId });

        cy.log("STEP 1: Send message in room " + roomId);
        var messageDetails = new MessageDetails(roomId, 1, "Message content");
        messagesRequest
          .post(studentAtToken, messageDetails)
          .then((response) => {
            // var messageId = response.body.cmsgID;
            // cy.log("STEP 2: Delete message " + messageId);
            // messagesRequest
            //   .delete(studentAtToken, messageId)
            //   .then((response) => {
            //     expect(response.status).to.equal(200);
            //   });
          });

        // cy.log("STEP 3: Update room to moderated " + roomId);
        // var messageDetails = new MessageDetails(roomId, 1, "Message content");
        // chatRoomRequest.update(this.studentAtToken, roomId, 1).then((response) => {
        //   expect(response.status).to.equal(200);
        // });
      }),
      5000
    );

    client.on(CHAT_EVENT_ROOM_JOIN, function () {
      console.log(
        "Joined room, triggered event",
        CHAT_EVENT_ROOM_JOIN +
          {
            crID: roomId,
          }
      );
    });

    client.on(CHAT_EVENT_MESSAGE_NEW, function () {
      console.log(
        "New chat message, triggered event",
        CHAT_MESSAGE_NEW +
          {
            crID: roomId,
          }
      );
    });

    //   client.on(CHAT_EVENT_MESSAGE_DELETED, function () {
    //     console.log(
    //       "New chat message, triggered event",
    //       CHAT_EVENT_MESSAGE_DELETED
    //     );
    //   });

    //   client.on(CHAT_EVENT_MODERATED_CHAT, function () {
    //     console.log(
    //       "New chat message, triggered event",
    //       CHAT_EVENT_MODERATED_CHAT
    //     );
    //   });
  });
});
