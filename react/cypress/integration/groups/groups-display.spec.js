import { BASE_GROUPS, GROUPS } from "../../support/constants/urls-ui";
import ChatPage from "../../support/page-objects/groups/chat-page";
import GroupPage from "../../support/page-objects/groups/group-page";
import GroupsMainPage from "../../support/page-objects/groups/groups-main-page";
import GroupDetails from "../../support/request-handlers/group-details.js";
import GroupRequest from "../../support/request-handlers/groups.js";

var groupsMainPage = new GroupsMainPage();
var groupPage = new GroupPage();
var groupRequest = new GroupRequest();
var chatPage = new ChatPage();

describe("GROUPS - VIEW @SMOKE", function () {
  const groupName = "UI TEST AUTOMATION";
  const groupDescription = "DESCRIPTION AUTOMATION UI TEST";
  const groupType = "Privat";
  var privateGroup = new GroupDetails(groupName, 0, groupDescription, null);

  before(function () {
    cy.log("Precondition: Create private group");
    groupRequest
      .generateGroupId(this.studentAtToken, privateGroup)
      .as("privateGroupId");

    cy.visit(BASE_GROUPS);
  });

  it("Groups home page - Elements are displayed successfully", function () {
    groupsMainPage.verifyTabsComponent();

    groupsMainPage.clickMyGroupsTab();
    cy.url().should("eq", BASE_GROUPS);

    groupsMainPage.clickOtherGroupsTab();
    cy.url().should("eq", GROUPS.OTHER_GROUPS);

    groupsMainPage.clickAddNewGroupBtn();
    cy.url().should("eq", GROUPS.NEW_GROUP);

    groupsMainPage.clickGoBackBtn();
    cy.url().should("eq", BASE_GROUPS);

    groupsMainPage.typeSearchField("Masini Electrice");
    groupsMainPage.clickCloseButtonSearchField();
    cy.url().should("eq", BASE_GROUPS);

    groupsMainPage.getGroupCard().should("be.visible");
    groupsMainPage.getGroupTitle().should("be.visible");
    groupsMainPage.getGroupDescription().should("be.visible");
    groupsMainPage.getUserIcon().should("be.visible");
    groupsMainPage.getUserCount().should("be.visible");
  });

  it("Group details page - Elements are displayed successfully", function () {
    cy.visit(GROUPS.CHAT.replace("{grpId}", this.privateGroupId));

    groupPage
      .getGroupTitle()
      .should("be.visible")
      .should("have.text", groupName);
    groupPage
      .getGroupType()
      .should("be.visible")
      .should("have.text", groupType);
    groupPage
      .getGroupDescription()
      .should("be.visible")
      .should("have.text", groupDescription);

    groupPage.getGroupImage().should("be.visible");
    groupPage.getGroupCreateDate().should("be.visible");
    groupPage.getGroupControlers().should("be.visible");
    groupPage.getCompTabsDetails().should("be.visible");
    groupPage.getCompTabsMembers().should("be.visible");
    groupPage.getCompTabsEvents().should("be.visible");

    chatPage.getRestrictedChat().should("be.visible");
    chatPage.getSharePhoto().should("be.visible");
    chatPage.getShareFiles().should("be.visible");
    chatPage.getChatInput().should("be.visible");
    chatPage.getButtonSendMessage().should("be.visible");
  });
});
