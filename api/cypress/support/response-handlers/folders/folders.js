export default class FolderResponse {
  verifyIdIsReturned(
    response,
    folderID,
    directoryDetails,
    ownerID,
    folderType
  ) {
    expect(response.body.data[0].fsID).to.eq(folderID.toString());
    expect(response.body.data[0].fsNume).to.eq(directoryDetails.name);
    expect(response.body.data[0].fsOwner.uaID).to.eq(ownerID.toString());
    expect(response.body.data[0].fsTip).to.eq(folderType);
  }
  verifyEmptyResults(response) {
    expect(response.body.meta.countTotal).to.equal("0");
    expect(response.body.meta.countData).to.equal("0");
    expect(response.body.meta.countOffset).to.equal("0");
    expect(response.body.data).to.be.empty;
  }

  verifyNameUpdate(response, folderID, directoryDetails) {
    expect(response.body.data[0].fsID).to.eq(folderID.toString());
    expect(response.body.data[0].fsNume).to.eq(directoryDetails.name);
  }

  verifyDescriptionUpdate(response, folderID, directoryDetails) {
    expect(response.body.data[0].fsID).to.eq(folderID.toString());
    expect(response.body.data[0].fsDescriere).to.eq(
      directoryDetails.description
    );
  }
}
