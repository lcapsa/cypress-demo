import { FILE_TYPE } from "../../support/constants/folders";
import FilesRequest from "../../support/request-handlers/files/files";
import FileResponse from "../../support/response-handlers/files/files";
import { validateSchema } from "../../support/schemas/schema-handler";
import FolderRequest from "../../support/request-handlers/folders/folder";
import DirectoryDetails from "../../support/request-handlers/folders/folder-details";
const folderRequest = new FolderRequest();
var name = "folder name";
var directoryDetails;
var fileID;

const filesRequest = new FilesRequest();
const filesResponse = new FileResponse();

describe("FILES - UPDATE @SMOKE", function () {
  before(function () {
    cy.log("User successfully upload a file ");
    const filePath = "photo.png";
    var fileName = "file-name";
    filesRequest.updateFile(
      this.studentAtToken,
      FILE_TYPE.REGULAR,
      filePath,
      fileName,
      "xhr"
    );
    cy.wait("@xhr").then((xhr) => {
      fileID = xhr.response.body.fsID;
      cy.log("Get file details ");
      filesRequest
        .getDetails(this.studentAtToken, fileID, this.fileName)
        .then((response) => {
          filesResponse.verifyFileDetailsUpload(
            response,
            fileID,
            FILE_TYPE.REGULAR,
            fileName
          );
        });
    });
  });
  it("User successfully update the name of the file", function () {
    var updateName = "update-name";
    filesRequest
      .updateFileName(this.studentAtToken, fileID, updateName)
      .then((response) => {
        validateSchema(response.body, "/files/update.json");
        expect(response.body.result).to.equal(true);
      });
  });

  it("User successfully move the file to a folder", function () {
    cy.log("Precondition: User creates a new folder ");
    directoryDetails = new DirectoryDetails(name);
    folderRequest
      .generateFolderId(this.studentAtToken, directoryDetails)
      .as("folderID");

    cy.get("@folderID").then((folderID) => {
      folderRequest
        .getDetails(this.studentAtToken, folderID)
        .then((response) => {
          var responseFolderID = response.body.data[0].fsID;
          expect(responseFolderID).to.not.eq("");
        });
      cy.log("User moves the file " + fileID + " to  the folder" + folderID);

      filesRequest
        .moveFile(this.studentAtToken, fileID, folderID)
        .then((response) => {
          expect(response.body.result).to.equal(true);
        });
      cy.log("User verifies that the files has been moved");
      filesRequest
        .getFolderDetails(this.studentAtToken, folderID)
        .then((response) => {
          expect(response.body.data[0].fsID).to.equal(folderID.toString());
        });
    });
  });
});
