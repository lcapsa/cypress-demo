export default class InstanceMembersResponse {
  verifyMemberIsReturned(response, expectedId) {
    expect(response.status).to.equal(200);
    expect(response.body.data.length).to.not.equal(0);

    var actualIdValues = response.body.data.map((elem) => elem.grpmID);
    expect(actualIdValues).to.contain(expectedId.toString());
  }

  verifyMemberIsNotReturned(response, expectedId) {
    expect(response.status).to.equal(200);
    expect(response.body).to.not.equal("");

    var actualIdValues = response.body.data.map((elem) => elem.grpmID);
    expect(actualIdValues).to.not.contain(expectedId.toString());
  }

  verifyMemberDetails(response, userId, status, role) {
    this.verifyMemberIsReturned(response, expectedInstanceId);
    var userData = response.body.data.find((elem) => elem.grpmUaID == userId);
    expect(userData.grpmRole).to.equal(role);
    expect(userData.grpmStatus).to.equal(status);
    expect(userData.grpmInfo.uaID).to.equal(userId);
  }

  getGroupMemberIdOfUser(response, userId) {
    expect(response.status).to.equal(200);
    expect(response.body.data.length).to.not.equal(0);
    var userData = response.body.data.find((elem) => elem.grpmUaID == userId);
    return userData.grpmID;
  }
}
