import { POST, GET, DELETE, PUT } from "../../constants/verbs.js";
import { FOLDER } from "../../constants/endpoint.js";
export default class FolderRequest {
  post(token, directoryDetails) {
    return cy
      .request({
        method: POST,
        url: FOLDER.BASE_PATH,
        auth: {
          bearer: token,
        },
        form: true,
        body: {
          fsNume: directoryDetails.name,
          fsDescriere: directoryDetails.description,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }
  getDetails(token, folderID){
    return cy.request({
      method: GET,
      url: FOLDER.BASE_PATH,
      auth: {
        bearer: token,
      },
      qs: {
        fsID: folderID,
      },
      failOnStatusCode: false,
    });
  }
  
  getFolderDetails(token, folderID, ownerID,folderType) {
    return cy.request({
      method: GET,
      url: FOLDER.BASE_PATH,
      auth: {
        bearer: token,
      },
      qs: {
        fsID: folderID,
      },
      failOnStatusCode: false,
    });
  }
  postFieldsRequired(token) {
    return cy.request({
      method: POST,
      url: FOLDER.BASE_PATH,
      auth: {
        bearer: token,
      },
      form: true,
      body: {},
      failOnStatusCode: false,
    });
  }
  generateFolderId(token, directoryDetails) {
    return this.post(token, directoryDetails).should("have.property", "fsID");
  }
  generateRootFolderId(token, directoryDetails) {
    return this.post(token, directoryDetails).should("have.property", "fsID");
  }
  deleteFolder(token, folderID) {
    return cy.request({
      method: DELETE,
      url: FOLDER.BASE_PATH,
      qs: {
        fsID: folderID,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
  updateName(token, folderID, name) {
    return cy
      .request({
        method: PUT,
        url: FOLDER.BASE_PATH,
        auth: {
          bearer: token,
        },
        form: true,
        body: {
          fsID: folderID,
          fsNume: name,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }
  updateDescription(token, folderID, description) {
    return cy
      .request({
        method: PUT,
        url: FOLDER.BASE_PATH,
        auth: {
          bearer: token,
        },
        form: true,
        body: {
          fsID: folderID,
          fsDescriere: description,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }

  moveFolder(token, folderID, rootfolderID){
    return cy
      .request({
        method: PUT,
        url: FOLDER.BASE_PATH,
        auth: {
          bearer: token,
        },
        form: true,
        body: {
          fsID: folderID,
          fsRootID: rootfolderID,
        },
        failOnStatusCode: false,
      })
      .its("body");
  }

  getDetailsRootFolder(token, rootfolderID){
    return cy.request({
      method: GET,
      url: FOLDER.BASE_PATH,
      auth: {
        bearer: token,
      },
      qs: {
        fsRootID: rootfolderID,
      },
      failOnStatusCode: false,
    });
  }

}
