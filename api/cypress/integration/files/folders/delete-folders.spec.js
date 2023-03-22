import FolderRequest from "../../../support/request-handlers/folders/folder";
import DirectoryDetails from "../../../support/request-handlers/folders/folder-details";
import FolderResponse from "../../../support/response-handlers/folders/folders";

const folderRequest = new FolderRequest();
const folderResponse = new FolderResponse();
var name = "folder name";

describe(" FOLDERS - DELETE @SMOKE ", function () {
  it("User delete the folder", function () {
    cy.log("Precondition: User creates new folder");
    var directoryDetails = new DirectoryDetails(name);
    folderRequest
      .generateFolderId(this.studentAtToken, directoryDetails)
      .as("folderID");

    cy.get("@folderID").then((folderID) => {
      folderRequest
        .getFolderDetails(this.studentAtToken, folderID)
        .then((response) => {
          expect(response.body.data[0].fsID).to.not.eq("");
          expect(response.status).to.equal(200);
        });
      cy.log(" User successfully delete the folder");
      folderRequest
        .deleteFolder(this.studentAtToken, folderID)
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.result).to.equal(true);

          cy.log("User verify that the folder is successfully deleted");

          folderRequest
            .getFolderDetails(this.studentAtToken, folderID)
            .then((response) => {
              folderResponse.verifyEmptyResults(response);
              expect(response.status).to.equal(200);
            });
        });
    });
  });
});
