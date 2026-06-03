import { ROLES } from "@/constants/roles";

/**
 * Represents the tabs in the Forensic UI
 */
export const FORENSIC_TABS = {
  COMPRESSION: 0,
  NOISE: 1,
  DEEP_LEARNING: 2,
  CLONING: 3,
  LENSES: "lenses", // Special category, not a numbered tab
};

/**
 * Forensic Algorithm class that encapsulates algorithm metadata and permissions
 */
export class ForensicAlgorithm {
  /**
   * @param {string} id - The algorithm ID (e.g., "zero_report")
   * @param {string} nameKey - The i18n key for the algorithm name
   * @param {number|string} tab - The tab this algorithm belongs to (use FORENSIC_TABS constants)
   * @param {Array<string>} rolesNeeded - Array of roles needed to access this algorithm (empty = available to all)
   * @param {?string} warning - Optional warning message to display to the user.
   */
  constructor(id, nameKey, tab, rolesNeeded = [], warning) {
    this.id = id;
    this.nameKey = nameKey;
    this.tab = tab;
    this.rolesNeeded = rolesNeeded;
    this.warning = warning;
  }
}

// COMPRESSION TAB (Tab 0)
export const zeroReport = new ForensicAlgorithm(
  "zero_report",
  "forensic_title_zero_report",
  FORENSIC_TABS.COMPRESSION,
);

export const ghostReport = new ForensicAlgorithm(
  "ghost_report",
  "forensic_title_ghost_report",
  FORENSIC_TABS.COMPRESSION,
);

export const cagiReport = new ForensicAlgorithm(
  "cagi_report",
  "forensic_title_cagi_report",
  FORENSIC_TABS.COMPRESSION,
);

export const adq1Report = new ForensicAlgorithm(
  "adq1_report",
  "forensic_title_adq1_report",
  FORENSIC_TABS.COMPRESSION,
);

export const dctReport = new ForensicAlgorithm(
  "dct_report",
  "forensic_title_dct_report",
  FORENSIC_TABS.COMPRESSION,
);

export const blkReport = new ForensicAlgorithm(
  "blk_report",
  "forensic_title_blk_report",
  FORENSIC_TABS.COMPRESSION,
);

// NOISE TAB (Tab 1)
export const splicebusterReport = new ForensicAlgorithm(
  "splicebuster_report",
  "forensic_title_splicebuster_report",
  FORENSIC_TABS.NOISE,
);

export const waveletReport = new ForensicAlgorithm(
  "wavelet_report",
  "forensic_title_wavelet_report",
  FORENSIC_TABS.NOISE,
);

export const cfaReport = new ForensicAlgorithm(
  "cfa_report",
  "forensic_title_cfa_report",
  FORENSIC_TABS.NOISE,
);

// DEEP LEARNING TAB (Tab 2)
export const mantranetReport = new ForensicAlgorithm(
  "mantranet_report",
  "forensic_title_mantranet_report",
  FORENSIC_TABS.DEEP_LEARNING,
);

export const fusionReport = new ForensicAlgorithm(
  "fusion_report",
  "forensic_title_fusion_report",
  FORENSIC_TABS.DEEP_LEARNING,
);

export const mmfusionReport = new ForensicAlgorithm(
  "mmfusion_report",
  "forensic_title_mmfusion_report",
  FORENSIC_TABS.DEEP_LEARNING,
  [ROLES.EXTRA_FEATURE, ROLES.EVALUATION, ROLES.BETA_TESTER],
  "forensic_warning_mmfusion_report",
);

export const truforReport = new ForensicAlgorithm(
  "trufor_report",
  "forensic_title_trufor_report",
  FORENSIC_TABS.DEEP_LEARNING,
  [ROLES.EXTRA_FEATURE, ROLES.EVALUATION, ROLES.BETA_TESTER],
  "forensic_warning_trufor_report",
);

export const omgfuserReport = new ForensicAlgorithm(
  "omgfuser_report",
  "forensic_title_omgfuser_report",
  FORENSIC_TABS.DEEP_LEARNING,
  [ROLES.EXTRA_FEATURE, ROLES.EVALUATION],
);

// CLONING TAB (Tab 3)
export const cmfdReport = new ForensicAlgorithm(
  "cmfd_report",
  "forensic_title_cmfd_report",
  FORENSIC_TABS.CLONING,
);

export const rcmfdReport = new ForensicAlgorithm(
  "rcmfd_report",
  "forensic_title_rcmfd_report",
  FORENSIC_TABS.CLONING,
);

// LENSES (Special section, not a numbered tab)
export const elaReport = new ForensicAlgorithm(
  "ela_report",
  "forensic_title_ela_report",
  FORENSIC_TABS.LENSES,
);

export const laplacianReport = new ForensicAlgorithm(
  "laplacian_report",
  "forensic_title_laplacian_report",
  FORENSIC_TABS.LENSES,
);

export const medianReport = new ForensicAlgorithm(
  "median_report",
  "forensic_title_median_report",
  FORENSIC_TABS.LENSES,
);

/**
 * All forensic algorithms in the system
 */
export const allForensicAlgorithms = [
  // Compression
  zeroReport,
  ghostReport,
  cagiReport,
  adq1Report,
  dctReport,
  blkReport,
  // Noise
  splicebusterReport,
  waveletReport,
  cfaReport,
  // Deep Learning
  mantranetReport,
  fusionReport,
  mmfusionReport,
  truforReport,
  omgfuserReport,
  // Cloning
  cmfdReport,
  rcmfdReport,
  // Lenses
  elaReport,
  laplacianReport,
  medianReport,
];

/**
 * Check if a user can access a specific algorithm based on their roles
 * @param {Array<string>} userRoles - User's roles
 * @param {ForensicAlgorithm} algorithm - The algorithm to check
 * @returns {boolean} - True if user can access the algorithm
 */
export const canUserAccessAlgorithm = (userRoles, algorithm) => {
  if (algorithm.rolesNeeded.length === 0) return true; // Available to all users

  return userRoles.some((role) => algorithm.rolesNeeded.includes(role));
};

/**
 * Get all algorithms a user can access based on their roles
 * @param {Array<string>} userRoles - User's roles
 * @returns {ForensicAlgorithm[]} - Array of accessible algorithms
 */
export const getForensicAlgorithmsForUser = (userRoles) => {
  return allForensicAlgorithms.filter((algorithm) =>
    canUserAccessAlgorithm(userRoles, algorithm),
  );
};

/**
 * Get algorithms for a specific tab that the user can access
 * @param {Array<string>} userRoles - User's roles
 * @param {number|string} tab - The tab to filter by
 * @returns {ForensicAlgorithm[]} - Array of accessible algorithms for the tab
 */
export const getAlgorithmsForTab = (userRoles, tab) => {
  return getForensicAlgorithmsForUser(userRoles).filter(
    (algorithm) => algorithm.tab === tab,
  );
};

/**
 * Get algorithms grouped by tab for the user
 * @param {Array<string>} userRoles - User's roles
 * @returns {Object} - Object with tab numbers as keys and algorithm arrays as values
 */
export const getAlgorithmsGroupedByTab = (userRoles) => {
  const algorithms = getForensicAlgorithmsForUser(userRoles);
  const grouped = {};

  algorithms.forEach((algorithm) => {
    if (!grouped[algorithm.tab]) {
      grouped[algorithm.tab] = [];
    }
    grouped[algorithm.tab].push(algorithm);
  });

  return grouped;
};

/**
 * Build filter properties for the legacy filtersProp system
 * This maintains compatibility with existing code while using the new algorithm system
 * @param {Array<string>} userRoles - User's roles
 * @returns {Object} - Filter properties object
 */
export const buildFilterProps = (userRoles) => {
  const algorithms = getForensicAlgorithmsForUser(userRoles);

  const lensesAlgorithms = algorithms.filter(
    (alg) => alg.tab === FORENSIC_TABS.LENSES,
  );

  // Build the combined array in tab order
  const orderedAlgorithms = [
    ...getAlgorithmsForTab(userRoles, FORENSIC_TABS.COMPRESSION),
    ...getAlgorithmsForTab(userRoles, FORENSIC_TABS.NOISE),
    ...getAlgorithmsForTab(userRoles, FORENSIC_TABS.DEEP_LEARNING),
    ...getAlgorithmsForTab(userRoles, FORENSIC_TABS.CLONING),
    ...lensesAlgorithms,
  ];

  const compressionCount = getAlgorithmsForTab(
    userRoles,
    FORENSIC_TABS.COMPRESSION,
  ).length;
  const noiseCount = getAlgorithmsForTab(userRoles, FORENSIC_TABS.NOISE).length;
  const deepLearningCount = getAlgorithmsForTab(
    userRoles,
    FORENSIC_TABS.DEEP_LEARNING,
  ).length;
  const cloningCount = getAlgorithmsForTab(
    userRoles,
    FORENSIC_TABS.CLONING,
  ).length;

  return {
    filtersIDs: orderedAlgorithms.map((alg) => alg.id),
    idStartCompression: 0,
    idStartNoise: compressionCount,
    idStartDeepLearning: compressionCount + noiseCount,
    idStartCloning: compressionCount + noiseCount + deepLearningCount,
    idStartLenses:
      compressionCount + noiseCount + deepLearningCount + cloningCount,
  };
};
