export default class GroupResponse {
  verifyIdIsReturned(body, expectedId) {
    var actualIdValues = body.data.map((elem) => elem.grpID);
    expect(actualIdValues).to.contain(expectedId.toString());
  }

  verifyIdIsNotReturned(body, expectedId) {
    var actualIdValues = body.data.map((elem) => elem.grpID);
    expect(actualIdValues).to.not.contain(expectedId.toString());
  }

  verifyGroupDetails(body, id, details) {
    expect(body.data[0].grpID).to.eq(id.toString());
    expect(body.data[0].grpName).to.eq(details.name);
    expect(body.data[0].grpIsPublic).to.eq(details.isPublic.toString());
    if (!details.description) {
      expect(body.data[0].grpDescription).to.eq("");
    } else {
      expect(body.data[0].grpDescription).to.eq(details.description);
    }
    expect(body.data[0].grpCover).to.not.eq("");
  }

  verifyResultIsEmpty(body) {
    expect(body.meta.countTotal).to.equal("0");
    expect(body.meta.countData).to.equal("0");
    expect(body.meta.countOffset).to.equal("0");
    expect(body.data).to.be.empty;
  }
}
