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

var groupRequest = new GroupRequest();
var groupMembersRequest = new GroupMembersRequest();
var eventsRequest = new GroupEventsRequest();
var instaceRequest = new EventInstanceRequest();
var instanceResponse = new EventInstanceResponse();

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
  date.getNowPlusHours(2),
  date.getNowPlusHours(4)
);

describe("GROUPS - EVENTS - INSTANCE - CREATE", function () {
  before(function () {
    cy.log("Precondition: User " + this.professorUaId + " creates group");
    groupRequest
      .generateGroupId(this.professorAtToken, privateGroup)
      .as("privateGroupId");

    cy.get("@privateGroupId").then((groupId) => {
      cy.log(
        "PRECONDITION: User " +
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
        "PRECONDITION: User " +
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
        "PRECONDITION: Admin " +
          this.professorUaId +
          " creates event in private group " +
          groupId
      );
      eventsRequest
        .generateEventId(this.professorAtToken, groupId, eventDetails)
        .as("eventId");
    });
  });

  describe("Event instance is successfully created @SMOKE", function () {
    it("Group admin successfully creates event instance", function () {
      cy.log(
        "STEP 1: Admin " +
          this.professorUaId +
          " creates instance for event " +
          this.eventId
      );
      instaceRequest
        .generateInstanceId(this.professorAtToken, this.eventId, eventDetails)
        .then((instanceId) => {
          cy.log(
            "STEP 2: Admin " +
              this.professorUaId +
              " view instances for event " +
              this.eventId
          );
          instaceRequest
            .viewInstancesForEvent(this.professorAtToken, this.eventId)
            .then((response) => {
              instanceResponse.verifyInstanceIdIsReturned(response, instanceId);
            });
        });
    });

    it("Group coordinator successfully creates instance for an event", function () {
      cy.log(
        "STEP 1: Group Coordinator " +
          this.studentUaId +
          " creates instance for event " +
          this.eventId
      );
      instaceRequest
        .generateInstanceId(this.studentAtToken, this.eventId, eventDetails)
        .then((instanceId) => {
          cy.log(
            "STEP 2: Admin " +
              this.professorUaId +
              " view instances for event " +
              this.eventId
          );
          instaceRequest
            .viewInstancesForEvent(this.professorAtToken, this.eventId)
            .then((response) => {
              instanceResponse.verifyInstanceIdIsReturned(response, instanceId);
            });
        });
    });
  });

  describe("Event instance is not created", function () {
    before(function () {
      cy.log(
        "PRECONDITION: Group admin " +
          this.professorUaId +
          " creates event in group " +
          this.privateGroupId
      );
      eventsRequest
        .generateEventId(
          this.professorAtToken,
          this.privateGroupId,
          eventDetails
        )
        .as("eventId");
    });

    it("Group member can not create instance for an event", function () {
      cy.log(
        "STEP 1: Member " +
          this.parentUaId +
          " creates instance for event " +
          this.eventId
      );
      instaceRequest
        .create(this.parentAtToken, this.eventId, eventDetails)
        .then((response) => {
          expect(response.status).to.equal(403);
        });

      cy.log(
        "STEP 2: Admin " +
          this.professorUaId +
          " view instances for event " +
          this.eventId
      );
      instaceRequest
        .viewInstancesForEvent(this.professorAtToken, this.eventId)
        .then((response) => {
          expect(response.body.data).to.have.lengthOf(1);
        });
    });
  });
});
