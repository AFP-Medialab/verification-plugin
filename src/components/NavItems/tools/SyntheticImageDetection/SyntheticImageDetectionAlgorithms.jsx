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
   * @param roleNeeded {?Roles} Role needed to get the detection results for the algorithm
   */
  constructor(apiServiceName, name, description, roleNeeded) {
    this.apiServiceName = apiServiceName;
    this.name = name;
    this.description = description;
    this.roleNeeded = roleNeeded;
  }
}

export const ganR50Mever = new SyntheticImageDetectionAlgorithm(
  "gan_r50_mever",
  "synthetic_image_detection_gan_name",
  "synthetic_image_detection_gan_description",
  ROLES.BETA_TESTER ?? null,
);

export const ldmR50Grip = new SyntheticImageDetectionAlgorithm(
  "ldm_r50_grip",
  "synthetic_image_detection_diffusion_name",
  "synthetic_image_detection_diffusion_description",
  ROLES.BETA_TESTER,
);
export const proGanR50Grip = new SyntheticImageDetectionAlgorithm(
  "progan_r50_grip",
  "synthetic_image_detection_progan_name",
  "synthetic_image_detection_progan_description",
  ROLES.BETA_TESTER,
);
export const admR50Grip = new SyntheticImageDetectionAlgorithm(
  "adm_r50_grip",
  "synthetic_image_detection_adm_name",
  "synthetic_image_detection_adm_description",
  ROLES.EXTRA_FEATURE,
);
export const proGanRineMever = new SyntheticImageDetectionAlgorithm(
  "progan_rine_mever",
  "synthetic_image_detection_progan_rine_mever_name",
  "synthetic_image_detection_progan_rine_mever_description",
  ROLES.EXTRA_FEATURE,
);
export const ldmRineMever = new SyntheticImageDetectionAlgorithm(
  "ldm_rine_mever",
  "synthetic_image_detection_ldm_rine_mever_name",
  "synthetic_image_detection_ldm_rine_mever_description",
  ROLES.EXTRA_FEATURE,
);
export const ldmR50Mever = new SyntheticImageDetectionAlgorithm(
  "ldm_r50_mever",
  "synthetic_image_detection_ldm_rine_mever_name",
  "synthetic_image_detection_ldm_rine_mever_description",
  ROLES.EXTRA_FEATURE,
);

/**
 * The list of the synthetic image detection algorithms
 * @type {SyntheticImageDetectionAlgorithm[]}
 */
export const syntheticImageDetectionAlgorithms = [
  ganR50Mever,
  ldmR50Grip,
  proGanR50Grip,
  admR50Grip,
  proGanRineMever,
  ldmRineMever,
  ldmR50Mever,
];

/**
 * Returns a list of algorithms that can be used by a user according to their roles
 * @param roles {?Array<ROLES>}
 * @returns {SyntheticImageDetectionAlgorithm[]}
 */
export const getSyntheticImageDetectionAlgorithmsForRoles = (roles) => {
  return syntheticImageDetectionAlgorithms.filter((algorithm) =>
    roles.includes(algorithm.roleNeeded),
  );
};
