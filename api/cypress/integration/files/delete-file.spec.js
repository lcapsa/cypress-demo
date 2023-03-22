import { FILE_TYPE } from "../../support/constants/folders";
import FilesRequest from "../../support/request-handlers/files/files";
import FileResponse from "../../support/response-handlers/files/files";

const filesRequest = new FilesRequest();
const filesResponse = new FileResponse();

describe("FILES - DELETE @SMOKE", function () {
  it("User successfully delete a file", function () {
    cy.log("Precondition: User upload a file");
    const filePath = "photo.png";
    filesRequest.uploadFileRequest(
      this.studentAtToken,
      FILE_TYPE.REGULAR,
      filePath,
      "alias"
    );
    cy.wait("@alias").then((xhr) => {
      var fileID = xhr.response.body.fsID;
      cy.log("User get file details ");
      filesRequest
        .getFileDetails(this.studentAtToken, fileID)
        .then((response) => {
          filesResponse.verifyFileDetails(response, fileID, FILE_TYPE.REGULAR);
        });
      cy.log(" User successfully delete the file");
      filesRequest.deleteFile(this.studentAtToken, fileID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.result).to.equal(true);
      });
      cy.log("User verify that the file is successfully deleted");
      filesRequest
        .getFileDetails(this.studentAtToken, fileID)
        .then((response) => {
          filesResponse.verifyEmptyResults(response);
          expect(response.status).to.eq(200);
        });
    });
  });
});
