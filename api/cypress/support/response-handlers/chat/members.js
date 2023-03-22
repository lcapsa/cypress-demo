export default class ChatRoomMembersResponse {
  verifyUserIdIsReturned(body, expectedId) {
    var actualIdValues = body.data.map((elem) => elem.cmUaID);
    expect(actualIdValues).to.contain(expectedId.toString());
  }

  verifyUserIdIsNotReturned(body, expectedId) {
    var actualIdValues = body.data.map((elem) => elem.cmUaID);
    expect(actualIdValues).to.not.contain(expectedId.toString());
  }

  verifyMemberDetails(body, expectedUserId, expectedRole) {
    this.verifyUserIdIsReturned(body, expectedUserId);

    var userData = body.data.find((elem) => elem.cmUaID == expectedUserId);
    expect(userData.cmRole).to.equal(expectedRole);
  }
}
