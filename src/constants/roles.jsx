/**
 * Represents the user roles that can be needed to access a given topMenuItem
 * @typedef Roles
 * @type {{BETA_TESTER: string, ARCHIVE: string, LOCK: string}}
 */
export const ROLES = {
  ARCHIVE: "ARCHIVE",
  BETA_TESTER: "BETA_TESTER",
  REGISTERED_USER: "REGISTERED_USER", // Registered user base level
  EVALUATION: "EVALUATION",
  EXTRA_FEATURE: "EXTRA_FEATURE",
  AFP_C2PA_GOLD: "AFP_C2PA_GOLD", // Highest level for AFP Reverse search
  AFP_C2PA_2: "AFP_C2PA_2", // Lower level for AFP Reverse search
  BETA_LANGUAGES: "BETA_LANGUAGES", // Access new localizations still being tested
};
