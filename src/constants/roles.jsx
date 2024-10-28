/**
 * Represents the user roles that can be needed to access a given topMenuItem
 * @typedef Roles
 * @type {{BETA_TESTER: string, ARCHIVE: string, LOCK: string}}
 */
export const ROLES = {
  ARCHIVE: "ARCHIVE",
  BETA_TESTER: "BETA_TESTER",
  LOCK: "lock",
  EVALUATION: "EVALUATION",
  EXTRA_FEATURE: "EXTRA_FEATURE",
  AFP_C2PA_GOLD: "AFP_C2PA_GOLD", //Highest level for AFP Reverse search
  AFP_C2PA_2: "AFP_C2PA_2", //Lower level for AFP Reverse search
};
