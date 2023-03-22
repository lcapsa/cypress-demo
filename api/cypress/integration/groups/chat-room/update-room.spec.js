import {
  groupVisibilityMap,
  PUBLIC,
} from "../../../support/constants/groups.js";
import { ROOM_MODERATION } from "../../../support/constants/chat.js";

import GroupDetails from "../../../support/request-handlers/groups/group-details.js";
import GroupRequest from "../../../support/request-handlers/groups/groups.js";
import GroupMembersRequest from "../../../support/request-handlers/groups/members.js";
import ChatRoomRequest from "../../../support/request-handlers/chat/room.js";
import ChatDetailsResponse from "../../../support/response-handlers/chat/room.js";

const publicGroup = new GroupDetails(
  "public group",
  groupVisibilityMap.get(PUBLIC),
  "description",
  "null"
);
var groupRequest = new GroupRequest();
var groupMembersRequest = new GroupMembersRequest();
var chatRoomRequest = new ChatRoomRequest();
var chatDetailsResponse = new ChatDetailsResponse();

describe("GROUPS - CHAT - UPDATE", function () {
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
  it("Admin successfully moderates chat room @SMOKE", function () {
    cy.log(
      "Step 1: User " +
        this.professorAtToken +
        " change room moderation " +
        this.roomId
    );
    cy.get("@roomId").then((roomId) => {
      chatRoomRequest.update(
        this.professorAtToken,
        roomId,
        ROOM_MODERATION.MODERATED
      );
    });
    cy.log("Verify room moderation");
    chatRoomRequest
      .viewRoom(this.professorAtToken, this.roomId)
      .then((response) => {
        chatDetailsResponse.verifyChatRoomDetails(
          response,
          this.roomId,
          ROOM_MODERATION.MODERATED
        );
      });
    cy.log(
      "Step 2: User " +
        this.professorAtToken +
        " change again room moderation " +
        this.roomId
    );
    cy.get("@roomId").then((roomId) => {
      chatRoomRequest.update(
        this.professorAtToken,
        roomId,
        ROOM_MODERATION.NOT_MODERATED
      );
    });
    chatRoomRequest
      .viewRoom(this.professorAtToken, this.roomId)
      .then((response) => {
        chatDetailsResponse.verifyChatRoomDetails(
          response,
          this.roomId,
          ROOM_MODERATION.NOT_MODERATED
        );
      });

    
  });
  it("Member can not moderate chat room",function(){
    cy.log(
      "Step 3: Regular user " +
        this.studentAtToken +
        " try to change room moderation " +
        this.roomId
    );
    chatRoomRequest
      .update(this.studentAtToken, this.roomId)
      .then((response) => {
        expect(response.status).to.equal(403);
      });
  })
});
