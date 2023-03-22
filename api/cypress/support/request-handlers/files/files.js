import { DELETE, GET, POST, PUT } from "../../constants/verbs.js";
import { FOLDER } from "../../constants/endpoint.js";
export default class FilesRequest {
  uploadFileRequest = (token, fileType, file, aliasName) => {
    cy.server()
      .route({
        method: POST,
        url: FOLDER.FILES,
      })
      .as(aliasName)
      .window()
      .then((win) => {
        cy.fixture(file, "binary").then((binary) => {
          const blob = Cypress.Blob.binaryStringToBlob(binary);
          const xhr = new win.XMLHttpRequest();
          const data = new FormData();

          data.set("fsFile", blob);
          data.set("fsTip", fileType);

          xhr.open(POST, FOLDER.FILES);

          xhr.setRequestHeader("Authorization", `Bearer ${token}`);

          xhr.send(data);
        });
      });
  };

  uploadTemporaryFile(token, file, aliasName) {
    cy.server()
      .route({
        method: POST,
        url: FOLDER.TEMPORARY_FILE,
      })
      .as(aliasName)
      .window()
      .then((win) => {
        cy.fixture(file, "binary").then((binary) => {
          const blob = Cypress.Blob.binaryStringToBlob(binary);
          const xhr = new win.XMLHttpRequest();
          const data = new FormData();

          data.set("fsFile", blob);

          xhr.open(POST, FOLDER.TEMPORARY_FILE);

          xhr.setRequestHeader("Authorization", `Bearer ${token}`);

          xhr.send(data);
        });
      });
  }
  getFileDetails(token, fileID) {
    return cy.request({
      method: GET,
      url: FOLDER.BASE_PATH,
      qs: {
        fsID: fileID,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  deleteFile(token, fileID) {
    return cy.request({
      method: DELETE,
      url: FOLDER.BASE_PATH,
      qs: {
        fsID: fileID,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
  updateFile = (token, fileType, file, fileName, aliasName) => {
    cy.server()
      .route({
        method: POST,
        url: FOLDER.FILES,
      })
      .as(aliasName)
      .window()
      .then((win) => {
        cy.fixture(file, "binary").then((binary) => {
          const blob = Cypress.Blob.binaryStringToBlob(binary);
          const xhr = new win.XMLHttpRequest();
          const data = new FormData();

          data.set("fsFile", blob);
          data.set("fsTip", fileType);
          data.set("fsNume", fileName);

          xhr.open(POST, FOLDER.FILES);

          xhr.setRequestHeader("Authorization", `Bearer ${token}`);

          xhr.send(data);
        });
      });
  };
  getDetails(token, fileID, fileName) {
    return cy.request({
      method: GET,
      url: FOLDER.BASE_PATH,
      qs: {
        fsID: fileID,
        fsNume: fileName,
      },
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  updateFileName(token, fileID, updateName) {
    return cy.request({
      method: PUT,
      url: FOLDER.BASE_PATH,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        fsID: fileID,
        fsNume: updateName,
      },
      failOnStatusCode: false,
    });
  }
  moveFile(token, fileID, folderID) {
    console.log(fileID);
    return cy.request({
      method: PUT,
      url: FOLDER.BASE_PATH,
      auth: {
        bearer: token,
      },
      form: true,
      body: {
        fsID: fileID,
        fsRootID: folderID,
      },
      failOnStatusCode: false,
    });
  }

  getFolderDetails(token, folderID) {
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
}
