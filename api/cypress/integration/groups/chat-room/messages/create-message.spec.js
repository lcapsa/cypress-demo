import { MESSAGE_TYPE } from "../../../../support/constants/chat.js";
import {
  groupVisibilityMap,
  PUBLIC
} from "../../../../support/constants/groups.js";
import MessageDetails from "../../../../support/request-handlers/chat/message-details.js";
import ChatMessagesRequest from "../../../../support/request-handlers/chat/messages.js";
import GroupDetails from "../../../../support/request-handlers/groups/group-details.js";
import GroupRequest from "../../../../support/request-handlers/groups/groups.js";
import GroupMembersRequest from "../../../../support/request-handlers/groups/members.js";
import ChatRoomMessagesResponse from "../../../../support/response-handlers/chat/messages.js";

const publicGroup = new GroupDetails(
  "public group",
  groupVisibilityMap.get(PUBLIC),
  "description",
  "null"
);
var groupRequest = new GroupRequest();
var groupMembersRequest = new GroupMembersRequest();
var chatMessagesRequest = new ChatMessagesRequest();
var chatRoomMessagesResponse = new ChatRoomMessagesResponse();

describe("GROUPS - CHAT MESSAGES - CREATE", function () {
  before(function () {
    cy.log(
      "Precondition: User " + this.professorUaId + " creates public group"
    );
    groupRequest
      .generateGroupId(this.professorAtToken, publicGroup)
      .as("publicGroupId");

    cy.get("@publicGroupId").then((publicGroupId) => {
      cy.log(
        "Precondition: Get chat room id from public group " + publicGroupId
      );
      groupRequest
        .getGroupDetails(this.professorAtToken, publicGroupId)
        .then((body) => {
          var roomId = body.data[0].grpCrID;
          expect(roomId).to.not.eq("");
          cy.wrap(roomId).as("roomId");

          cy.log(
            "Precondition: User " +
              this.studentUaId +
              " joins public group " +
              publicGroupId
          );
          groupMembersRequest
            .join(this.studentAtToken, this.publicGroupId)
            .then((response) => {
              expect(response.status).to.equal(200);
            });
        });
    });
  });

  it("Message is successfully created in chat @SMOKE", function () {
    cy.log(
      "STEP 1: User " +
        this.studentUaId +
        " sends a message in room " +
        this.roomId
    );
    const messageRequestDetails = new MessageDetails(
      this.roomId,
      MESSAGE_TYPE.TEXT,
      "Message content"
    );
    chatMessagesRequest
      .post(this.studentAtToken, messageRequestDetails)
      .then((response) => {
        expect(response.status).to.equal(200);
        var messageId = response.body.cmsgID;

        cy.log(
          "STEP 2: User " +
            this.professorUaId +
            " views messages in room " +
            this.roomId
        );
        chatMessagesRequest
          .viewMessagesInRoom(this.professorAtToken, this.roomId)
          .then((response) => {
            expect(response.status).to.equal(200);
            chatRoomMessagesResponse.verifyMessageIsNotDeleted(
              response.body,
              messageId,
              this.studentUaId,
              messageRequestDetails.type,
              messageRequestDetails.content
            );
          });
      });
  });
});
