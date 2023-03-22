import { GROUPS } from "../../support/constants/urls-ui.js";
import ChatPage from "../../support/page-objects/groups/chat-page";
import SendMessagePage from "../../support/page-objects/messages/send-message-page";
import GroupDetails from "../../support/request-handlers/group-details.js";
import GroupRequest from "../../support/request-handlers/groups.js";

var chatPage = new ChatPage();
var sendMsgPage = new SendMessagePage();
var groupRequest = new GroupRequest();
var privateGroup = new GroupDetails("private group", 0, "description", null);
var textMessage = "message for test";

describe("GROUPS - CHAT MESSAGES", function () {
  before(function () {
    cy.log("Precondition: Create private group");
    groupRequest
      .generateGroupId(this.studentAtToken, privateGroup)
      .as("privateGroupId");

    cy.get("@privateGroupId").then((privateGroupId) => {
      cy.log("Precondition: Navigate to group page details " + privateGroupId);
      cy.visit("/groups/" + privateGroupId + "/chat");
      cy.url().should("eq", GROUPS.CHAT.replace("{grpId}", privateGroupId));
    });
  });

  it("Message is successfully sent in group chat @SMOKE", function () {
    chatPage.getChatInput().should("be.visible");
    sendMsgPage.typeInMsgContentArea(textMessage + "{enter}");
    chatPage.getMessageText().should("have.text", textMessage);
  });
});
