import InstanceMembersRequest from "../../../../../support/request-handlers/groups/event-instance-members.js";
import GroupEventsRequest from "../../../../../support/request-handlers/groups/events.js";
import GroupDetails from "../../../../../support/request-handlers/groups/group-details.js";
import GroupRequest from "../../../../../support/request-handlers/groups/groups.js";
import GroupMembersRequest from "../../../../../support/request-handlers/groups/members.js";
import GroupEventsResponse from "../../../../../support/response-handlers/groups/events.js";
import {
  EVENT_INVITE_MODE,
  groupVisibilityMap,
  NEW_MEMBER_FORMAT,
  PRIVATE,
  USER_ROLE
} from "../../../../support/constants/groups.js";
import GenerateDate from "../../../../support/helpers/date.js";
import EventDetails from "../../../../support/request-handlers/groups/event-details.js";

var groupRequest = new GroupRequest();
var groupMembersRequest = new GroupMembersRequest();
var eventsRequest = new GroupEventsRequest();
var eventsResponse = new GroupEventsResponse();
var membersRequest = new InstanceMembersRequest();

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

describe("GROUPS - EVENTS - MEMBERS - ADD", function () {
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

  describe("Member is successfully added to event @SMOKE", function () {
    it("Group admin successfully adds a member to an event", function () {
      cy.log(
        "STEP 1: Admin " +
          this.professorUaId +
          " adds a member to event " +
          this.eventId
      );
      // membersRequest.add(this.professorAtToken, this.instanceId, this.)

      cy.log(
        "STEP 2: Coordinator " +
          this.studentUaId +
          " views members of event " +
          this.eventId
      );
    });
  });
});
