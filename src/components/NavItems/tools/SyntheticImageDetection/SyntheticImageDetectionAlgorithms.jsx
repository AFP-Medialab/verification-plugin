import { ROLES } from "../../../../constants/roles";

/**
 * @file Provides constants and helper functions used for the synthetic image detection tool
 *
 */

/**
 * Thresholds (percentage) for the different analysis categories
 * @type {{THRESHOLD_2: number, THRESHOLD_3: number, THRESHOLD_1: number}}
 */
export const DETECTION_THRESHOLDS = {
  THRESHOLD_1: 50,
  THRESHOLD_2: 70,
  THRESHOLD_3: 90,
};

export class SyntheticImageDetectionAlgorithm {
  /**
   *
   * @param apiServiceName {string} The service parameter for the API call
   * @param name {string} The algorithm name key
   * @param description {string} The algorithm description key
   * @param rolesNeeded {?[Roles]} Role needed to get the detection results for the algorithm. If more than one role specified, either roles are authorized.
   */
  constructor(apiServiceName, name, description, rolesNeeded) {
    this.apiServiceName = apiServiceName;
    this.name = name;
    this.description = description;
    this.rolesNeeded = rolesNeeded;
  }
}

export const ganR50Mever = new SyntheticImageDetectionAlgorithm(
  "gan_r50_mever",
  "synthetic_image_detection_gan_name",
  "synthetic_image_detection_gan_description",
  [ROLES.BETA_TESTER],
);

export const proGanR50Grip = new SyntheticImageDetectionAlgorithm(
  "progan_r50_grip",
  "synthetic_image_detection_progan_name",
  "synthetic_image_detection_progan_description",
  [ROLES.BETA_TESTER],
);

export const ldmR50Grip = new SyntheticImageDetectionAlgorithm(
  "ldm_r50_grip",
  "synthetic_image_detection_diffusion_name",
  "synthetic_image_detection_diffusion_description",
  [ROLES.BETA_TESTER],
);

export const proGanWebpR50Grip = new SyntheticImageDetectionAlgorithm(
  "progan-webp_r50_grip",
  "synthetic_image_detection_progan-webp_r50_grip_name",
  "synthetic_image_detection_progan-webp_r50_grip_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);

export const ldmWebpR50Grip = new SyntheticImageDetectionAlgorithm(
  "ldm-webp_r50_grip",
  "synthetic_image_detection_ldm-webp_r50_grip_name",
  "synthetic_image_detection_ldm-webp_r50_grip_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);

export const gigaGanWebpR50Grip = new SyntheticImageDetectionAlgorithm(
  "gigagan-webp_r50_grip",
  "synthetic_image_detection_gigagan-webp_r50_grip_name",
  "synthetic_image_detection_gigagan-webp_r50_grip_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);

export const admR50Grip = new SyntheticImageDetectionAlgorithm(
  "adm_r50_grip",
  "synthetic_image_detection_adm_name",
  "synthetic_image_detection_adm_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);
export const proGanRineMever = new SyntheticImageDetectionAlgorithm(
  "progan_rine_mever",
  "synthetic_image_detection_progan_rine_mever_name",
  "synthetic_image_detection_progan_rine_mever_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);
export const ldmRineMever = new SyntheticImageDetectionAlgorithm(
  "ldm_rine_mever",
  "synthetic_image_detection_ldm_rine_mever_name",
  "synthetic_image_detection_ldm_rine_mever_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);
export const ldmR50Mever = new SyntheticImageDetectionAlgorithm(
  "ldm_r50_mever",
  "synthetic_image_detection_ldm_r50_mever_name",
  "synthetic_image_detection_ldm_r50_mever_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);
export const itwRineMever = new SyntheticImageDetectionAlgorithm(
  "itw_rine_mever",
  "synthetic_image_detection_itw_rine_mever_name",
  "synthetic_image_detection_itw_rine_mever_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);

export const itwSpaiMever = new SyntheticImageDetectionAlgorithm(
  "itw_spai_mever",
  "synthetic_image_detection_itw_spai_mever_name",
  "synthetic_image_detection_itw_spai_mever_description",
  [ROLES.EVALUATION, ROLES.EXTRA_FEATURE],
);

/**
 * The list of the synthetic image detection algorithms
 * TODO:Use SET
 * @type {SyntheticImageDetectionAlgorithm[]}
 */
export const syntheticImageDetectionAlgorithms = [
  proGanR50Grip,
  ldmR50Grip,
  admR50Grip,
  proGanWebpR50Grip,
  ldmWebpR50Grip,
  gigaGanWebpR50Grip,
  ganR50Mever,
  ldmR50Mever,
  proGanRineMever,
  ldmRineMever,
  itwRineMever,
  itwSpaiMever,
];

/**
 *
 * @param roles {?Array<ROLES>}
 * @param algorithm {SyntheticImageDetectionAlgorithm}
 * @returns {*}
 */
export const canUserDisplayAlgorithmResults = (roles, algorithm) => {
  return roles.some((role) => algorithm.rolesNeeded.includes(role));
};

/**
 * Returns a list of algorithms that can be used by a user according to their roles
 * @param roles {?Array<ROLES>}
 * @returns {SyntheticImageDetectionAlgorithm[]}
 */
export const getSyntheticImageDetectionAlgorithmsForRoles = (roles) => {
  return syntheticImageDetectionAlgorithms.filter((algorithm) =>
    roles.some((role) => algorithm.rolesNeeded.includes(role)),
  );
};

/**
 * Returns the Synthetic Image Detection Algorithm Object from the given APi Service Name
 * @param apiName {string}
 * @returns {SyntheticImageDetectionAlgorithm}
 */
export const getSyntheticImageDetectionAlgorithmFromApiName = (apiName) => {
  return syntheticImageDetectionAlgorithms.find(
    (algorithm) => algorithm.apiServiceName === apiName,
  );
};
