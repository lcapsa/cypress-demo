export default class ChatPage {
  getRestrictedChat() {
    return cy.get(".footer-container .comp-restrict-chat");
  }

  getSharePhoto() {
    return cy.get(".footer-container .tooltip-share-photo");
  }

  getShareFiles() {
    return cy.get(".footer-container .tooltip-share-files");
  }

  getChatInput() {
    return cy.get(".chat-form__wrapper .tox-tinymce");
  }

  getButtonSendMessage() {
    return cy.get(".chat-form__send-button");
  }

  getMessageText() {
    return cy
      .get(".groups-messages .groups-messsage__user-box p")
      .should("be.visible");
  }
}
