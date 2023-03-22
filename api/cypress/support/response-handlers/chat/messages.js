export default class ChatRoomMessagesResponse {
  verifyMessageIdIsReturned(body, expectedMessageId) {
    var actualIdValues = body.data.map((elem) => elem.cmsgID);
    expect(actualIdValues).to.contain(expectedMessageId.toString());
  }

  verifyMessageIsDeleted(body, expectedMessageId, userId, expectedType) {
    this.verifyMessageIdIsReturned(body, expectedMessageId);

    var userData = body.data.find((elem) => elem.cmsgID == expectedMessageId);
    expect(userData.cmInfo.uaID).to.equal(userId);
    expect(userData.cmsgType).to.equal(expectedType);
    expect(userData.cmsgIsDeleted).to.equal("1");
    expect(userData.cmsgText).to.equal(null);
    expect(userData.cmsgReportCount).to.equal("0");
  }

  verifyMessageIsNotDeleted(
    body,
    expectedMessageId,
    userId,
    expectedType,
    expectedContent
  ) {
    this.verifyMessageIdIsReturned(body, expectedMessageId, userId);

    var userData = body.data.find((elem) => elem.cmsgID == expectedMessageId);
    expect(userData.cmInfo.uaID).to.equal(userId);
    expect(userData.cmsgType).to.equal(expectedType);
    expect(userData.cmsgIsDeleted).to.equal("0");
    expect(userData.cmsgText).to.equal(expectedContent);
    expect(userData.cmsgReportCount).to.equal("0");
  }

  verifyMessageIsReported(body, expectedMessageId, userId, expectedType){
    this.verifyMessageIdIsReturned(body, expectedMessageId);

    var userData = body.data.find((elem) => elem.cmsgID == expectedMessageId);
    expect(userData.cmInfo.uaID).to.equal(userId);
    expect(userData.cmsgType).to.equal(expectedType);
    expect(userData.cmsgReportCount).to.equal("1");
  }
}
