import { FILE_TYPE } from "../../support/constants/folders";
import FilesRequest from "../../support/request-handlers/files/files";
import FileResponse from "../../support/response-handlers/files/files";
const filesRequest = new FilesRequest();
const filesResponse = new FileResponse();
describe("FILES - UPLOAD @SMOKE", function () {
  it("User successfully upload a file", function () {
    const filePath = "photo.png";
    filesRequest.uploadFileRequest(
      this.studentAtToken,
      FILE_TYPE.REGULAR,
      filePath,
      "xhr"
    );
    cy.wait("@xhr").then((xhr) => {
      var fileID = xhr.response.body.fsID;
      cy.log("Get file details ");
      filesRequest
        .getFileDetails(this.studentAtToken, fileID)
        .then((response) => {
          filesResponse.verifyFileDetails(response, fileID, FILE_TYPE.REGULAR);
        });
    });
  });
  it("User successfully upload a temporary file", function () {
    const filePath = "photo.png";
    filesRequest.uploadTemporaryFile(this.studentAtToken, filePath, "xhr");
    cy.wait("@xhr").then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
