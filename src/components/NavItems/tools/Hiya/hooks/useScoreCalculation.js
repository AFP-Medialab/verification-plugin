import { useMemo } from "react";

/**
 * Custom hook for calculating voice cloning detection scores
 * Transforms raw synthesis scores into percentage values with proper validation
 *
 * @param {Object|null} result - The detection result object from Hiya API
 * @param {Object} result.scores - Scores object containing synthesis data
 * @param {number} result.scores.synthesis - Raw synthesis score (0-1, where 0 is synthetic)
 * @returns {number|null} Voice cloning score as percentage (0-100) or null if invalid
 *
 * @example
 * ```javascript
 * import { useScoreCalculation } from './hooks/useScoreCalculation';
 *
 * const HiyaResults = ({ result }) => {
 *   const voiceCloningScore = useScoreCalculation(result);
 *
 *   if (voiceCloningScore === null) {
 *     return <div>Invalid or missing result data</div>;
 *   }
 *
 *   return <div>Score: {voiceCloningScore}%</div>;
 * };
 * ```
 */
export const useScoreCalculation = (result) => {
  return useMemo(() => {
    // Return null for missing result
    if (!result) {
      return null;
    }

    // Note: Error checking is now handled upstream in the hook flow
    // This function should only receive valid results after error filtering

    // Validate result structure and data types
    if (
      !result.scores ||
      !result.scores.synthesis ||
      typeof result.scores.synthesis !== "number"
    ) {
      console.error("Invalid result data structure:", result);
      return null;
    }

    // Validate synthesis score is within expected range
    const synthScore = result.scores.synthesis;
    if (synthScore < 0 || synthScore > 1) {
      console.error("Synthesis score out of valid range (0-1):", synthScore);
      return null;
    }

    // Convert to percentage: higher percentage = more likely to be synthetic
    // (1 - synthesis) because synthesis score of 0 means synthetic, 1 means authentic
    return Math.round((1 - synthScore) * 100);
  }, [result]);
};
