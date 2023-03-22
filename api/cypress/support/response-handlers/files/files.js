export default class FileResponse {
  verifyFileDetails(response, fileID, fileType) {
    expect(response.body.data[0].fsID).to.eq(fileID.toString());
    expect(response.body.data[0].fsTip).to.eq(fileType);
  }

  verifyEmptyResults(response) {
    expect(response.body.meta.countTotal).to.equal("0");
    expect(response.body.meta.countData).to.equal("0");
    expect(response.body.meta.countOffset).to.equal("0");
    expect(response.body.data).to.be.empty;
  }

  verifyFileDetailsUpload(response, fileID, fileType,fileName) {
    expect(response.body.data[0].fsID).to.eq(fileID.toString());
    expect(response.body.data[0].fsTip).to.eq(fileType);
    expect(response.body.data[0].fsNume).to.eq(fileName);
  }
}
