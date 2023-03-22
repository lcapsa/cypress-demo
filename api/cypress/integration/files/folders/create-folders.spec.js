import FolderRequest from "../../../support/request-handlers/folders/folder";
import FolderResponse from "../../../support/response-handlers/folders/folders";
import DirectoryDetails from "../../../support/request-handlers/folders/folder-details";
import { validateSchema } from "../../../support/schemas/schema-handler.js";
import { FILE_TYPE } from "../../../support/constants/folders";

const folderRequest = new FolderRequest();
const folderResponse = new FolderResponse();
var name = "folder name";

describe(" FOLDERS - CREATE @SMOKE", function () {
  it("User successfully create a new folder", function () {
    var directoryDetails = new DirectoryDetails(name);
    folderRequest.post(this.studentAtToken, directoryDetails).then((body) => {
      validateSchema(body, "/folders/create.json");
      var folderID = body.fsID;

      cy.log("Get folder details ");
      var ownerID = this.studentUaId;

      folderRequest
        .getFolderDetails(this.studentAtToken, folderID)
        .then((response) => {
          folderResponse.verifyIdIsReturned(
            response,
            folderID,
            directoryDetails,
            ownerID,
            FILE_TYPE.FOLDER
          );
        });
    });
  });
  it("Folder is not created - missing mandatory fields ", function () {
    folderRequest.postFieldsRequired(this.studentAtToken).then((response) => {
      expect(response.body[0].errorCode).to.equal("1");
      expect(response.body[0].errorMessage).to.equal("The field is required.");
      expect(response.body[0].errorField).to.equal("fsNume");
      expect(response.status).to.equal(400);
    });
  });
});
