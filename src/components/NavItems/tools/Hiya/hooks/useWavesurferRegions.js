import { useRef } from "react";

import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

/**
 * Custom hook for creating and managing a Wavesurfer regions plugin instance
 * Returns a stable regions plugin reference that can be used in wavesurfer config
 *
 * @returns {Object} Object containing the regions plugin reference
 * @property {RegionsPlugin} regionsRef - Reference to the regions plugin instance
 *
 * @example
 * ```javascript
 * import { useWavesurferRegions } from './hooks/useWavesurferRegions';
 *
 * const AudioComponent = () => {
 *   const { regionsRef } = useWavesurferRegions();
 *
 *   const { wavesurfer, isReady } = useWavesurfer({
 *     // ... other config
 *     plugins: [regionsRef, ZoomPlugin.create()]
 *   });
 *
 *   return <div ref={audioContainerRef} />;
 * };
 * ```
 */
export const useWavesurferRegions = () => {
  const regionsRef = useRef(null);

  // Initialize the Regions plugin once
  if (!regionsRef.current) {
    regionsRef.current = RegionsPlugin.create();
  }

  return {
    regionsRef: regionsRef.current,
  };
};
