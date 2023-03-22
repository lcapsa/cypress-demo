import {
  EVENT_INVITE_MODE,
  groupVisibilityMap,
  NEW_MEMBER_FORMAT,
  PRIVATE,
  USER_ROLE
} from "../../../../../support/constants/groups.js";
import GenerateDate from "../../../../../support/helpers/date.js";
import EventDetails from "../../../../../support/request-handlers/groups/event-details.js";
import InstanceMembersRequest from "../../../../../support/request-handlers/groups/event-instance-members.js";
import GroupEventsRequest from "../../../../../support/request-handlers/groups/events.js";
import GroupDetails from "../../../../../support/request-handlers/groups/group-details.js";
import GroupRequest from "../../../../../support/request-handlers/groups/groups.js";
import GroupMembersRequest from "../../../../../support/request-handlers/groups/members.js";
import InstanceMembersResponse from "../../../../../support/response-handlers/groups/event-instance-members.js";
import GroupEventsResponse from "../../../../../support/response-handlers/groups/events.js";

var groupRequest = new GroupRequest();
var groupMembersRequest = new GroupMembersRequest();
var eventsRequest = new GroupEventsRequest();
var eventsResponse = new GroupEventsResponse();
var membersRequest = new InstanceMembersRequest();
var membersResponse = new InstanceMembersResponse();

var privateGroup = new GroupDetails(
  "Private group",
  groupVisibilityMap.get(PRIVATE),
  "Private group description",
  null
);
var date = new GenerateDate();
var eventDetails = new EventDetails(
  "Event name",
  "Event description",
  EVENT_INVITE_MODE.ALL_JOIN,
  date.getNow(),
  date.getNowPlusHours(2)
);

describe("GROUPS - EVENTS - MEMBERS - DELETE", function () {
  before(function () {
    cy.log("Precondition: User " + this.professorUaId + " creates group");
    groupRequest
      .generateGroupId(this.professorAtToken, privateGroup)
      .as("privateGroupId");

    cy.get("@privateGroupId").then((groupId) => {
      cy.log(
        "Precondition: User " +
          this.studentUaId +
          " joins as coordinator private group " +
          groupId
      );
      groupMembersRequest.addUserWithRole(
        this.professorAtToken,
        this.studentAtToken,
        groupId,
        NEW_MEMBER_FORMAT.STUDENT + this.studentUaId,
        USER_ROLE.COORDINATOR
      );

      cy.log(
        "Precondition: User " +
          this.parentUaId +
          " joins as member in group " +
          groupId
      );
      groupMembersRequest.joinWithInvite(
        this.professorAtToken,
        this.parentAtToken,
        groupId,
        NEW_MEMBER_FORMAT.PARENT + this.studentUaId
      );

      cy.log(
        "Precondition: Admin " +
          this.professorUaId +
          " creates event in group " +
          groupId
      );
      eventsRequest
        .generateEventId(this.professorAtToken, groupId, eventDetails)
        .as("eventId");

      cy.log(
        "Precondition: Admin " +
          this.professorUaId +
          " retrieves instance of event in group " +
          groupId
      );
      cy.get("@eventId").then((eventId) => {
        eventsRequest
          .viewEventsInGroup(this.professorAtToken, groupId)
          .then((response) => {
            cy.wrap(eventsResponse.getInstanceId(response, eventId)).as(
              "instanceId"
            );
          });
      });
    });
  });

  describe("Member is successfully removed from event @SMOKE", function () {
    it("Group admin successfully removes a member from an event", function () {
      cy.log(
        "Precondition: Admin " +
          this.professorUaId +
          " retrieves member id of group member user " +
          this.parentUaId
      );
      membersRequest
        .viewMembers(this.professorAtToken, this.instanceId)
        .then((response) => {
          var memberId = membersResponse.getGroupMemberIdOfUser(
            response,
            this.parentUaId
          );

          cy.log(
            "STEP 1: Admin " +
              this.professorUaId +
              " removes member " +
              memberId +
              " from event " +
              this.eventId
          );
          membersRequest
            .delete(this.professorAtToken, this.instanceId, memberId)
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body.result).to.equal("true");
            });

          cy.log(
            "STEP 2: Coordinator " +
              this.studentUaId +
              " views members of event " +
              this.eventId
          );
          membersRequest
            .viewMembers(this.studentAtToken, this.instanceId)
            .then((response) => {
              membersResponse.verifyMemberIsNotReturned(response, memberId);
            });
        });
    });

    it("Group coordinator successfully removes a member from an event", function () {
      cy.log(
        "Precondition: Admin " +
          this.professorUaId +
          " adds user " +
          this.parentUaId +
          " as member to instance " +
          this.instanceId
      );
      membersRequest
        .generateMemberId(this.professorAtToken, this.instanceId)
        .then((memberId) => {
          cy.log(
            "STEP 1: Coordinator " +
              this.studentUaId +
              " removes member " +
              memberId +
              " from event " +
              this.eventId
          );
          membersRequest
            .delete(this.studentAtToken, this.instanceId, memberId)
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body.result).to.equal("true");
            });

          cy.log(
            "STEP 2: Admin " +
              this.professorUaId +
              " views members of event " +
              this.eventId
          );
          membersRequest
            .viewMembers(this.professorAtToken, this.instanceId)
            .then((response) => {
              membersResponse.verifyMemberIsNotReturned(response, memberId);
            });
        });
    });
  });

  describe("Member is not removed from event", function () {
    it("Group coordinator can not remove admin from an event", function () {
      cy.log(
        "Precondition: Coordinator " +
          this.studentUaId +
          " retrieves member id of group admin user " +
          this.professorUaId
      );
      membersRequest
        .viewMembers(this.studentAtToken, this.instanceId)
        .then((response) => {
          var memberId = membersResponse.getGroupMemberIdOfUser(
            response,
            this.professorAtToken
          );

          cy.log(
            "STEP 1: Coordinator " +
              this.studentUaId +
              " removes member " +
              memberId +
              " from event " +
              this.eventId
          );
          membersRequest
            .delete(this.studentAtToken, this.instanceId, memberId)
            .then((response) => {
              expect(response.status).to.equal(403);
            });

          cy.log(
            "STEP 2: Admin " +
              this.professorUaId +
              " views members of event " +
              this.eventId
          );
          membersRequest
            .viewMembers(this.professorAtToken, this.instanceId)
            .then((response) => {
              membersResponse.verifyMemberIsReturned(response, memberId);
            });
        });
    });
  });
});
