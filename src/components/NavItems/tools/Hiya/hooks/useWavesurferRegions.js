import { useRef } from "react";

import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

/**
 * Custom hook for creating and managing a Wavesurfer regions plugin instance
 * Returns a stable regions plugin instance that can be used in wavesurfer config
 *
 * @returns {Object} Object containing the regions plugin instance
 * @property {Object} regionsPlugin - The actual wavesurfer regions plugin instance (NOT a React ref)
 *
 * @example
 * ```javascript
 * import { useWavesurferRegions } from './hooks/useWavesurferRegions';
 *
 * const AudioComponent = () => {
 *   const { regionsPlugin } = useWavesurferRegions();
 *
 *   const { wavesurfer, isReady } = useWavesurfer({
 *     // ... other config
 *     plugins: [regionsPlugin, ZoomPlugin.create()]
 *   });
 *
 *   return <div ref={audioContainerRef} />;
 * };
 * ```
 */
export const useWavesurferRegions = () => {
  const regionsPluginRef = useRef(null);

  // Initialize the Regions plugin once
  if (!regionsPluginRef.current) {
    regionsPluginRef.current = RegionsPlugin.create();
  }

  return {
    regionsPlugin: regionsPluginRef.current,
  };
};
