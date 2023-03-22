import FolderRequest from "../../../support/request-handlers/folders/folder";
import FolderResponse from "../../../support/response-handlers/folders/folders";
import DirectoryDetails from "../../../support/request-handlers/folders/folder-details";
import { validateSchema } from "../../../support/schemas/schema-handler.js";


const folderRequest = new FolderRequest();
var name = "folder name";
var directoryDetails;
const folderResponse = new FolderResponse();

describe("FOLDERS - UPDATE @SMOKE", function () {
  it("User creates successfully the folder", function () {
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
    });
  });
  it("User update successfully the name of the folder", function () {
    directoryDetails.name = "folder name update";
    folderRequest
      .updateName(this.studentAtToken, this.folderID, directoryDetails.name)
      .then((response) => {
        validateSchema(response, "/folders/update.json");
        expect(response.result).to.equal(true);
      });
    cy.log("Get folder details ");

    folderRequest
      .getDetails(this.studentAtToken, this.folderID)
      .then((response) => {
        folderResponse.verifyNameUpdate(
          response,
          this.folderID,
          directoryDetails
        );
      });
  });
  it("User successfully update the description of the folder", function () {
    directoryDetails.description = "update description";
    folderRequest
      .updateDescription(
        this.studentAtToken,
        this.folderID,
        directoryDetails.description
      )
      .then((response) => {
        validateSchema(response, "/folders/update.json");
        expect(response.result).to.equal(true);
      });
    cy.log("Get folder details ");

    folderRequest
      .getDetails(this.studentAtToken, this.folderID)
      .then((response) => {
        folderResponse.verifyDescriptionUpdate(
          response,
          this.folderID,
          directoryDetails
        );
      });
  });
  it("User successfully move the folder to another folder", function () {
    cy.log("User creates a new folder ");
    directoryDetails = new DirectoryDetails(name);
    folderRequest
      .generateRootFolderId(this.studentAtToken, directoryDetails)
      .as("rootfolderID");
    cy.get("@rootfolderID").then((rootfolderID) => {
      cy.log(
        "User moves the folder " + this.folderID + " to " + this.rootfolderID
      );

      folderRequest
        .moveFolder(this.studentAtToken, this.folderID, rootfolderID)
        .then((response) => {
          expect(response.result).to.equal(true);

          cy.log("User verifies that the folder has been moved");

          folderRequest
            .getDetailsRootFolder(this.studentAtToken, rootfolderID)
            .then((response) => {
              expect(response.body.data[0].fsID).to.equal(this.folderID.toString());
            });
        });
    });
  });
});
