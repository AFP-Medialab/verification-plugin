import { useEffect } from "react";

import dayjs from "dayjs";

import { getPercentageColorCode } from "../utils";

/**
 * Custom hook for updating wavesurfer regions based on analysis chunks
 * Handles adding colored regions to the waveform when data changes
 *
 * @param {Object|null} wavesurfer - Wavesurfer instance
 * @param {boolean} isReady - Whether wavesurfer is ready for interaction
 * @param {Array} chunks - Array of analysis chunks with time ranges and scores
 * @param {Object} regionsPlugin - The wavesurfer regions plugin instance
 * @returns {void} This hook has no return value, it only triggers side effects
 *
 * @example
 * ```javascript
 * import { useRegionsUpdater } from './hooks/useRegionsUpdater';
 *
 * const AudioComponent = ({ wavesurfer, isReady, chunks, regionsPlugin }) => {
 *   useRegionsUpdater(wavesurfer, isReady, chunks, regionsPlugin);
 *   // Regions will be automatically updated when chunks change
 * };
 * ```
 */
export const useRegionsUpdater = (
  wavesurfer,
  isReady,
  chunks,
  regionsPlugin,
) => {
  useEffect(() => {
    if (!wavesurfer || !isReady || !chunks || !regionsPlugin) {
      return;
    }

    // Clear existing regions before adding new ones
    try {
      regionsPlugin.clearRegions();
    } catch (error) {
      console.warn("Could not clear existing regions:", error);
    }

    // Add regions for each chunk with synthesis scores
    chunks.forEach((chunk) => {
      if (
        chunk.scores?.synthesis !== null &&
        chunk.scores?.synthesis !== undefined
      ) {
        const detectionPercentage = (1 - chunk.scores.synthesis) * 100;

        try {
          regionsPlugin.addRegion({
            start: dayjs.duration(chunk.startTime).asSeconds(),
            end: dayjs.duration(chunk.endTime).asSeconds(),
            color: getPercentageColorCode(detectionPercentage),
            resize: false,
            drag: false,
          });
        } catch (error) {
          console.error("Failed to add region for chunk:", chunk, error);
        }
      }
    });

    // Cleanup function to clear regions when component unmounts or dependencies change
    return () => {
      if (regionsPlugin) {
        try {
          regionsPlugin.clearRegions();
        } catch (error) {
          console.error(error);
        }
      }
    };
  }, [wavesurfer, isReady, chunks, regionsPlugin]);
};
