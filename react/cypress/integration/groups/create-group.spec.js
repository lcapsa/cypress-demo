import { BASE_GROUPS } from "../../support/constants/urls-ui";
import MainMenuNav from "../../support/page-objects/common/main-menu-nav";
import GroupsMainPage from "../../support/page-objects/groups/groups-main-page";
import NewGroupPage from "../../support/page-objects/groups/new-group";
import SendMessagePage from "../../support/page-objects/messages/send-message-page";
import GroupDetails from "../../support/request-handlers/group-details.js";
import GroupRequest from "../../support/request-handlers/groups.js";

var mainMenuNav = new MainMenuNav();
var newGroupPage = new NewGroupPage();
var groupsMainPage = new GroupsMainPage();

var sendMsgPage = new SendMessagePage();
var groupRequest = new GroupRequest();

describe("GROUPS - CREATE", function () {
  const groupName = "UI TEST AUTOMATION";
  const groupDescription = "DESCRIPTION AUTOMATION UI TEST";
  var privateGroup = new GroupDetails(groupName, 0, groupDescription, null);

  before(function () {
    cy.log("Precondition: Create private group");
    groupRequest
      .generateGroupId(this.studentAtToken, privateGroup)
      .as("privateGroupId");

    cy.visit("");
  });

  it("Group is successfully created @SMOKE", function () {
    mainMenuNav.clickGroupsLink();
    cy.url().should("eq", BASE_GROUPS);

    groupsMainPage.clickAddNewGroupBtn();
    newGroupPage.typeInGroupNameInput(groupName);
    newGroupPage.clickPrivateGroupLink();
    sendMsgPage.typeInMsgContentArea(groupDescription);
    newGroupPage.clickCreateGroupButton();

    cy.url().should("eq", BASE_GROUPS);
  });
});
