export const BASE_URL =
  Cypress.config().baseUrl + "/" + Cypress.config().language;

export const NEWS = BASE_URL + "/news";
export const BASE_GROUPS = BASE_URL + "/groups";

export const GROUPS = {
  CHAT: BASE_GROUPS + "/{grpId}/chat",
  OTHER_GROUPS: BASE_GROUPS + "/others",
  NEW_GROUP: BASE_GROUPS + "/new-group",
};
