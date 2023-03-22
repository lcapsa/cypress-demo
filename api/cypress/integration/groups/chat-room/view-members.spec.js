import {
  groupVisibilityMap,
  NEW_MEMBER_FORMAT,
  PRIVATE,
  PUBLIC,
  USER_ROLE
} from "../../../support/constants/groups.js";
import ChatMembersRequest from "../../../support/request-handlers/chat/members.js";
import GroupDetails from "../../../support/request-handlers/groups/group-details.js";
import GroupRequest from "../../../support/request-handlers/groups/groups.js";
import GroupMembersRequest from "../../../support/request-handlers/groups/members.js";
import ChatRoomMembersResponse from "../../../support/response-handlers/chat/members.js";

var groupRequest = new GroupRequest();
var groupMembersRequest = new GroupMembersRequest();
var chatMembersResponse = new ChatRoomMembersResponse();
var chatMembersRequest = new ChatMembersRequest();

var publicGroup = new GroupDetails(
  "public group",
  groupVisibilityMap.get(PUBLIC),
  "description",
  "null"
);
var privateGroup = new GroupDetails(
  "private group",
  groupVisibilityMap.get(PRIVATE),
  "description",
  "null"
);

describe("GROUPS - CHAT - MEMBERS", function () {
  before(function () {
    groupRequest
      .generateGroupId(this.professorAtToken, publicGroup)
      .as("publicGroupId");

    groupRequest
      .generateGroupId(this.professorAtToken, privateGroup)
      .as("privateGroupId");

    cy.log("Precondition: Get chat room id from public group");
    cy.get("@publicGroupId").then((publicGroupId) => {
      groupRequest
        .getGroupDetails(this.professorAtToken, publicGroupId)
        .then((body) => {
          var roomId = body.data[0].grpCrID;
          expect(roomId).to.not.eq("");
          cy.wrap(roomId).as("publicRoomId");
        });
    });

    cy.log("Precondition: Get chat room id from private group");
    cy.get("@privateGroupId").then((privateGroupId) => {
      groupRequest
        .getGroupDetails(this.professorAtToken, privateGroupId)
        .then((body) => {
          var roomId = body.data[0].grpCrID;
          expect(roomId).to.not.eq("");
          cy.wrap(roomId).as("privateRoomId");
        });
    });
  });

  describe("Chat room members list is successfully updated", function () {
    it("When joining & leaving public group", function () {
      cy.log(
        "STEP 1: User " +
          this.studentUaId +
          " joins public group: " +
          this.publicGroupId
      );
      groupMembersRequest
        .join(this.studentAtToken, this.publicGroupId)
        .then((response) => {
          expect(response.body).to.have.property("grpmID");
        });

      cy.log(
        "STEP 2: Admin " +
          this.professorUaId +
          " views members list of public room " +
          this.publicRoomId
      );
      chatMembersRequest
        .list(this.professorAtToken, this.publicRoomId)
        .then((response) => {
          expect(response.status).to.equal(200);
          chatMembersResponse.verifyMemberDetails(
            response.body,
            this.studentUaId,
            USER_ROLE.MEMBER
          );
        });

      cy.log(
        "STEP 3: User " +
          this.parentUaId +
          " leaves public group " +
          this.publicGroupId
      );
      groupMembersRequest
        .leave(this.parentAtToken, this.publicGroupId)
        .then((response) => {
          expect(response.body.result).to.eq("true");
        });

      cy.log(
        "STEP 4: User " +
          this.parentUaId +
          " is not returned in members list of public room " +
          this.publicRoomId
      );
      chatMembersRequest
        .list(this.professorAtToken, this.publicRoomId)
        .then((response) => {
          expect(response.status).to.equal(200);
          chatMembersResponse.verifyUserIdIsNotReturned(
            response.body,
            this.parentUaId
          );
        });
    });

    it("When accepting invite & leaving private group", function () {
      cy.log(
        "STEP 1: User " +
          this.studentUaId +
          " joins private group: " +
          this.privateGroupId
      );
      groupMembersRequest
        .joinWithInvite(
          this.professorAtToken,
          this.studentAtToken,
          this.privateGroupId,
          NEW_MEMBER_FORMAT.STUDENT + this.studentUaId
        )
        .then((response) => {
          expect(response.body).to.have.property("grpmID");
        });

      cy.log(
        "STEP 2: Admin " +
          this.professorUaId +
          " views members list of private room " +
          this.privateRoomId
      );
      chatMembersRequest
        .list(this.professorAtToken, this.privateRoomId)
        .then((response) => {
          expect(response.status).to.equal(200);
          chatMembersResponse.verifyMemberDetails(
            response.body,
            this.studentUaId,
            USER_ROLE.MEMBER
          );
        });

      cy.log(
        "STEP 3: User " +
          this.parentUaId +
          " leaves private group: " +
          this.privateGroupId
      );
      groupMembersRequest
        .leave(this.parentAtToken, this.privateGroupId)
        .then((response) => {
          expect(response.body.result).to.eq("true");
        });

      cy.log(
        "STEP 4: User " +
          this.parentUaId +
          " is not returned in members list of private room " +
          this.privateRoomId
      );
      chatMembersRequest
        .list(this.professorAtToken, this.privateRoomId)
        .then((response) => {
          expect(response.status).to.equal(200);
          chatMembersResponse.verifyUserIdIsNotReturned(
            response.body,
            this.parentUaId
          );
        });
    });
  });

  describe("Member is successfully deleted from chat room members list", function () {
    it("In a public group", function () {
      cy.log(
        "STEP 1: User " +
          this.parentUaId +
          " joins public group: " +
          this.publicGroupId
      );
      groupMembersRequest
        .join(this.parentAtToken, this.publicGroupId)
        .then((response) => {
          expect(response.body).to.have.property("grpmID");
          cy.wrap(response.body.grpmID).as("memberId");
        });

      cy.log(
        "STEP 2: User " +
          this.parentUaId +
          " is deleted from public group: " +
          this.publicGroupId
      );
      cy.get("@memberId").then((memberId) => {
        groupMembersRequest
          .delete(this.professorAtToken, memberId)
          .then((response) => {
            expect(response.body.result).to.eq("true");
          });
      });

      cy.log(
        "STEP 3: Admin " +
          this.professorUaId +
          " views members list of public room " +
          this.publicRoomId
      );
      chatMembersRequest
        .list(this.professorAtToken, this.publicRoomId)
        .then((response) => {
          expect(response.status).to.equal(200);
          chatMembersResponse.verifyUserIdIsNotReturned(
            response.body,
            this.parentUaId
          );
        });
    });

    it("In a private group", function () {
      cy.log(
        "STEP 1: User " +
          this.parentUaId +
          " joins public group: " +
          this.privateGroupId
      );
      groupMembersRequest
        .joinWithInvite(
          this.professorAtToken,
          this.parentAtToken,
          this.privateGroupId,
          NEW_MEMBER_FORMAT.PARENT + this.studentUaId
        )
        .then((response) => {
          expect(response.body).to.have.property("grpmID");
          cy.wrap(response.body.grpmID).as("memberId");
        });

      cy.log(
        "STEP 2: User " +
          this.parentUaId +
          " is deleted from private room: " +
          this.privateRoomId
      );
      cy.get("@memberId").then((memberId) => {
        groupMembersRequest
          .delete(this.professorAtToken, memberId)
          .then((response) => {
            expect(response.body.result).to.eq("true");
          });
      });

      cy.log(
        "STEP 3: Admin " +
          this.professorUaId +
          " views members list of private room " +
          this.privateRoomId
      );
      chatMembersRequest
        .list(this.professorAtToken, this.privateRoomId)
        .then((response) => {
          expect(response.status).to.equal(200);
          chatMembersResponse.verifyUserIdIsNotReturned(
            response.body,
            this.parentUaId
          );
        });
    });
  });
});
