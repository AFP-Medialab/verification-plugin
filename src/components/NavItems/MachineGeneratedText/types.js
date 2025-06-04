/**
 * The substring represented by a pair of numbers [start character, end character].
 * @typedef {number[]} Indices
 * @example [0, -1]
 */

/**
 * RGB color represented as a triplet of numbers [R, G, B].
 * @typedef {number[]} RGB
 * @example [252, 170, 0]
 */

/**
 * Annotation metadata for a segment of text.
 * @typedef {Object} Annotation
 * @property {Indices} indices - Start and end indices of the annotated segment.
 * @property {string} score - Confidence score as a stringified float.
 * @property {string} [pred] - Prediction label (e.g. "likely_human", "likely_machine"). Optional.
 * @property {RGB} rgb - RGB color associated with this annotation.
 * @property {RGB} rgbDark - RGB color for dark mode.
 */

/**
 * An entity group containing one or more annotations.
 * @typedef {Annotation[]} EntityGroup
 */

/**
 * Collection of all entity annotations.
 * @typedef {Object} EntityMap
 * @property {EntityGroup} mgt_overall_score
 * @property {EntityGroup} [highly_likely_human]
 * @property {EntityGroup} [likely_human]
 * @property {EntityGroup} [likely_machine]
 * @property {EntityGroup} [highly_likely_machine]
 * @property {EntityGroup} Important_Sentence
 */

/**
 * Root object containing entities.
 * @typedef {Object} MachineGeneratedTextResult
 * @property {EntityMap} entities
 */
