export const BASE_ENDPOINT = Cypress.config().baseUrl;
const WEB_SOCKET_HOST = BASE_ENDPOINT.replace("/api/v2", "");

export const WEB_SOCKET_CHAT = WEB_SOCKET_HOST + "/chat";

const BASE_GENERIC = BASE_ENDPOINT + "/generic";
const BASE_SCHOOLS = BASE_ENDPOINT + "/scoli";
const BASE_CHAT = BASE_ENDPOINT + "/chat";

export const AUTH_ENDPOINT = BASE_ENDPOINT + "/auth";

export const GENERIC = {
  CONTACT: BASE_GENERIC + "/contact",
};

export const SCHOOLS = {
  PUBLIC: BASE_SCHOOLS + "/public",
};

export const MESSAGES = {
  ALL: BASE_ENDPOINT + "/mesaje",
  ONE: BASE_ENDPOINT + "/mesaje/mesaj",
};

export const GROUPS = {
  BASE_PATH: BASE_ENDPOINT + "/groups",
  MEMBERS: BASE_ENDPOINT + "/groups/members",
  JOIN: BASE_ENDPOINT + "/groups/join",
  LEAVE: BASE_ENDPOINT + "/groups/leave",
  EVENTS: BASE_ENDPOINT + "/groups/events",
  EVENT_INSTANCE: BASE_ENDPOINT + "/groups/events/instance",
  EVENT_INSTANCES: BASE_ENDPOINT + "/groups/events/instances",
  EVENT_MEMBERS: BASE_ENDPOINT + "/groups/events/instances/members",
};

export const CHAT = {
  MESSAGES: BASE_CHAT + "/messages",
  MESSAGE: BASE_CHAT + "/message",
  ROOMS: BASE_CHAT + "/rooms",
  ROOM: BASE_CHAT + "/room",
  MEMBERS: BASE_CHAT + "/members",
  REPORT: BASE_CHAT + "/report",
};

export const FOLDER = {
  BASE_PATH: BASE_ENDPOINT + "/fisiere",
  FILES: BASE_ENDPOINT + "/fisiere/upload",
  TEMPORARY_FILE: BASE_ENDPOINT + "/fisiere/upload_tmp",
};
