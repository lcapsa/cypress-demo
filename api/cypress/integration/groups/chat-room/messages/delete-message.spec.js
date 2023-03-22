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

describe("GROUPS - CHAT MESSAGES - DELETE @SMOKE", function () {
  before(function () {
    cy.log(
      "Precondition 1: User " + this.professorUaId + " creates public group"
    );
    groupRequest
      .generateGroupId(this.professorAtToken, publicGroup)
      .as("publicGroupId");

    cy.get("@publicGroupId").then((publicGroupId) => {
      cy.log(
        "Precondition 2: Get chat room id from public group " + publicGroupId
      );
      groupRequest
        .getGroupDetails(this.professorAtToken, publicGroupId)
        .then((body) => {
          var roomId = body.data[0].grpCrID;
          expect(roomId).to.not.eq("");
          cy.wrap(roomId).as("roomId");

          cy.log(
            "Precondition 3: User " +
              this.studentUaId +
              " joins public group " +
              publicGroupId
          );
          groupMembersRequest
            .join(this.studentAtToken, publicGroupId)
            .then((response) => {
              expect(response.status).to.equal(200);
            });
        });
    });
  });

  it("Admin successfully deletes message in chat", function () {
    cy.log(
      "Precondition: Admin " +
        this.professorUaId +
        " sends a message in room " +
        this.roomId
    );
    const messageDetails = new MessageDetails(
      this.roomId,
      MESSAGE_TYPE.TEXT,
      "Message content"
    );
    chatMessagesRequest
      .post(this.professorAtToken, messageDetails)
      .then((response) => {
        expect(response.status).to.equal(200);
        var messageId = response.body.cmsgID;

        cy.log(
          "STEP 1: Group admin " +
            this.professorUaId +
            " deletes message " +
            messageId
        );
        chatMessagesRequest
          .delete(this.professorAtToken, messageId)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.result).to.equal("true");
          });

        cy.log(
          "STEP 2: Group member " +
            this.studentUaId +
            " views messages in room " +
            this.roomId
        );
        chatMessagesRequest
          .viewMessagesInRoom(this.studentAtToken, this.roomId)
          .then((response) => {
            expect(response.status).to.equal(200);
            chatRoomMessagesResponse.verifyMessageIsDeleted(
              response.body,
              messageId,
              this.professorUaId,
              messageDetails.type
            );
          });
      });
  });

  it("Member successfully deletes its message in chat", function () {
    cy.log(
      "Precondition: Member " +
        this.studentUaId +
        " sends a message in room " +
        this.roomId
    );
    const messageDetails = new MessageDetails(
      this.roomId,
      MESSAGE_TYPE.TEXT,
      "Message content"
    );
    chatMessagesRequest
      .post(this.studentAtToken, messageDetails)
      .then((response) => {
        expect(response.status).to.equal(200);
        var messageId = response.body.cmsgID;

        cy.log(
          "STEP 1: Group member " +
            this.studentUaId +
            " deletes message " +
            messageId
        );
        chatMessagesRequest
          .delete(this.studentAtToken, messageId)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.result).to.equal("true");
          });

        cy.log(
          "STEP 2: Group admin " +
            this.professorUaId +
            " views messages in room " +
            this.roomId
        );
        chatMessagesRequest
          .viewMessagesInRoom(this.professorAtToken, this.roomId)
          .then((response) => {
            expect(response.status).to.equal(200);
            chatRoomMessagesResponse.verifyMessageIsDeleted(
              response.body,
              messageId,
              this.studentUaId,
              messageDetails.type
            );
          });
      });
  });

  it("Member can not delete another user's message in chat", function () {
    cy.log(
      "Precondition: Admin " +
        this.professorUaId +
        " sends a message in room " +
        this.roomId
    );
    const messageDetails = new MessageDetails(
      this.roomId,
      MESSAGE_TYPE.TEXT,
      "Message content"
    );
    chatMessagesRequest
      .post(this.professorAtToken, messageDetails)
      .then((response) => {
        expect(response.status).to.equal(200);
        var messageId = response.body.cmsgID;

        cy.log(
          "STEP 1: Group member " +
            this.studentUaId +
            " deletes message " +
            messageId
        );
        chatMessagesRequest
          .delete(this.studentAtToken, messageId)
          .then((response) => {
            expect(response.status).to.equal(403);
          });

        cy.log(
          "STEP 2: Group admin " +
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
              this.professorUaId,
              messageDetails.type,
              messageDetails.content
            );
          });
      });
  });
});
