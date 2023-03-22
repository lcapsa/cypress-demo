export const PUBLIC = "public";
export const PRIVATE = "private";

export const groupVisibilityMap = new Map([
  [PRIVATE, 0],
  [PUBLIC, 1],
]);

export const USER_ROLE = {
  MEMBER: "1",
  COORDINATOR: "2",
  ADMIN: "3",
};

export const USER_STATUS = {
  UNDECIDED: "1",
  JOINED: "2",
  REJECTED: "3",
  LEFT: "4",
};

export const NEW_MEMBER_FORMAT = {
  STUDENT: "1-",
  PARENT: "2-",
  PROFESSOR: "3-",
};

export const EVENT_INVITE_MODE = {
  ALL_JOIN: "1",
  MEMBERS_ONLY: "2",
  INVITE_ONLY: "3",
};
