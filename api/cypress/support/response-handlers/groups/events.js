export default class GroupEventsResponse {
  verifyEventIdIsReturned(response, expectedId) {
    expect(response.status).to.equal(200);
    expect(response.body).to.not.equal("");

    var actualIdValues = response.body.data.map((elem) => elem.evID);
    expect(actualIdValues).to.contain(expectedId.toString());
  }

  verifyEventIdIsNotReturned(response, expectedId) {
    expect(response.status).to.equal(200);
    var actualIdValues = response.body.data.map((elem) => elem.evID);
    expect(actualIdValues).to.not.contain(expectedId.toString());
  }

  verifyEventDetails(response, expectedEventId, groupId, eventDetails) {
    this.verifyEventIdIsReturned(response, expectedEventId);

    var eventData = response.body.data.find(
      (elem) => elem.evID == expectedEventId
    );
    expect(eventData.evGrpID).to.equal(groupId.toString());
    expect(eventData.evName).to.equal(eventDetails.name);
    expect(eventData.evDescription).to.equal(eventDetails.description);
    expect(eventData.nextInstance.eviStartDate).to.equal(
      eventDetails.startDate
    );
    expect(eventData.nextInstance.eviEndDate).to.equal(eventDetails.endDate);
    expect(eventData.nextInstance.eviID).to.not.equal(null);
  }

  verifyEmptyResponse(response) {
    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.empty;
    expect(response.body.meta.countData).to.equal("0");
    expect(response.body.meta.countOffset).to.equal("0");
    expect(response.body.meta.countTotal).to.equal("0");
  }

  getInstanceId(response, eventId) {
    var eventData = response.body.data.find((elem) => elem.evID == eventId);
    return eventData.nextInstance.eviID;
  }
}
