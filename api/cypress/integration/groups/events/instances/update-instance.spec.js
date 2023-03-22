import {
  EVENT_INVITE_MODE,
  groupVisibilityMap,
  NEW_MEMBER_FORMAT,
  PRIVATE,
  USER_ROLE
} from "../../../../support/constants/groups.js";
import GenerateDate from "../../../../support/helpers/date.js";
import EventDetails from "../../../../support/request-handlers/groups/event-details.js";
import EventInstanceRequest from "../../../../support/request-handlers/groups/event-instance.js";
import GroupEventsRequest from "../../../../support/request-handlers/groups/events.js";
import GroupDetails from "../../../../support/request-handlers/groups/group-details.js";
import GroupRequest from "../../../../support/request-handlers/groups/groups.js";
import GroupMembersRequest from "../../../../support/request-handlers/groups/members.js";
import EventInstanceResponse from "../../../../support/response-handlers/groups/event-instances.js";
import GroupEventsResponse from "../../../../support/response-handlers/groups/events.js";

var groupRequest = new GroupRequest();
var groupMembersRequest = new GroupMembersRequest();
var eventsRequest = new GroupEventsRequest();
var instaceRequest = new EventInstanceRequest();
var instanceResponse = new EventInstanceResponse();
var eventsResponse = new GroupEventsResponse();

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
  date.getNow(2),
  date.getNowPlusHours(4)
);
var updatedEventDetails = new EventDetails(
  "Event name",
  "Event description",
  EVENT_INVITE_MODE.ALL_JOIN,
  date.getNowPlusHours(6),
  date.getNowPlusHours(8)
);

describe("GROUPS - EVENTS - INSTANCE - UPDATE", function () {
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
          " joins as member group " +
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
          " creates event in private group " +
          groupId
      );
      eventsRequest
        .generateEventId(this.professorAtToken, groupId, eventDetails)
        .as("eventId");
    });
  });

  describe("Event instance is successfully updated @SMOKE", function () {
    it("Group admin successfully updates instance for an event", function () {
      cy.log(
        "Precondition: Admin " +
          this.professorUaId +
          " views events in group " +
          this.privateGroupId
      );
      eventsRequest
        .viewEventsInGroup(this.professorAtToken, this.privateGroupId)
        .then((response) => {
          var instanceId = eventsResponse.getInstanceId(response, this.eventId);
          cy.log(
            "STEP 1: Admin " +
              this.professorUaId +
              " updates instance " +
              instanceId
          );
          instaceRequest
            .update(this.professorAtToken, instanceId, updatedEventDetails)
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body.result).to.equal("true");
            });

          cy.log(
            "STEP 2: Admin " +
              this.professorUaId +
              " views instances for event " +
              this.eventId
          );
          instaceRequest
            .viewInstancesForEvent(this.professorAtToken, this.eventId)
            .then((response) => {
              instanceResponse.verifyInstanceDetails(
                response,
                this.eventId,
                instanceId,
                updatedEventDetails
              );
            });
        });
    });

    it("Group coordinator successfully updates instance for an event", function () {
      cy.log(
        "PRECONDITION: Admin " +
          this.professorUaId +
          " creates instance for event " +
          this.eventId
      );
      instaceRequest
        .generateInstanceId(this.professorAtToken, this.eventId, eventDetails)
        .then((instanceId) => {
          cy.log(
            "STEP 1: Group Coordinator " +
              this.studentUaId +
              " updates instance " +
              instanceId
          );
          instaceRequest
            .update(this.studentAtToken, instanceId, updatedEventDetails)
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body.result).to.equal("true");
            });

          cy.log(
            "STEP 2: Admin " +
              this.professorUaId +
              " views instances for event " +
              this.eventId
          );
          instaceRequest
            .viewInstancesForEvent(this.professorAtToken, this.eventId)
            .then((response) => {
              instanceResponse.verifyInstanceDetails(
                response,
                this.eventId,
                instanceId,
                updatedEventDetails
              );
            });
        });
    });
  });

  describe("Event instance is not updated", function () {
    before(function () {
      cy.log(
        "Precondition: Admin " +
          this.professorUaId +
          " creates instance for event " +
          this.eventId
      );
      instaceRequest
        .generateInstanceId(this.professorAtToken, this.eventId, eventDetails)
        .as("instanceId");
    });

    it("Group member can not update instance for an event", function () {
      cy.log(
        "STEP 1: Member " +
          this.parentUaId +
          " updates instance " +
          this.instanceId
      );
      instaceRequest
        .update(this.parentAtToken, this.instanceId, updatedEventDetails)
        .then((response) => {
          expect(response.status).to.equal(403);
        });

      cy.log(
        "STEP 2: Admin " +
          this.professorUaId +
          " views instance " +
          this.instanceId
      );
      instaceRequest
        .viewInstancesForEvent(this.professorAtToken, this.eventId)
        .then((response) => {
          instanceResponse.verifyInstanceDetails(
            response,
            this.eventId,
            this.instanceId,
            eventDetails
          );
        });
    });
  });
});
