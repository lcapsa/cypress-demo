export default class EventInstanceResponse {
  verifyInstanceIdIsReturned(response, expectedId) {
    expect(response.status).to.equal(200);
    expect(response.body).to.not.equal("");

    var actualIdValues = response.body.data.map((elem) => elem.eviID);
    expect(actualIdValues).to.contain(expectedId.toString());
  }

  verifyInstanceIdIsNotReturned(response, expectedId) {
    var actualIdValues = response.body.data.map((elem) => elem.eviID);
    expect(actualIdValues).to.not.contain(expectedId.toString());
  }

  verifyInstanceDetails(
    response,
    expectedEventId,
    expectedInstanceId,
    instanceDetails
  ) {
    this.verifyInstanceIdIsReturned(response, expectedInstanceId);

    var instanceData = response.body.data.find(
      (elem) => elem.eviID == expectedInstanceId
    );
    expect(instanceData.eviEvID).to.equal(expectedEventId.toString());
    expect(instanceData.eviStartDate).to.equal(instanceDetails.startDate);
    expect(instanceData.eviEndDate).to.equal(instanceDetails.endDate);
    expect(instanceData.eviCreatedDate).to.not.equal(null);
    expect(instanceData.eviEvrID).to.equal(null);
    expect(instanceData.eviMeetingID).to.equal(null);
  }

  verifyEmptyResponse(response) {
    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.empty;
    expect(response.body.meta.countData).to.equal("0");
    expect(response.body.meta.countOffset).to.equal("0");
    expect(response.body.meta.countTotal).to.equal("0");
  }
}
