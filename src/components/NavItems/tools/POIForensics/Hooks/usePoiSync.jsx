import { useEffect } from "react";

import { clearCanvas, drawBoundingBox, getIndexFromTime } from "../poiUtils";

/**
 * Personallized Hook that has to sync the canva, the video with the result and the selectedIndex (which is associated to
 * the current time in the video)
 * @param {import("react").Ref} videoRef
 * @param {import("react").Ref} canvasRef
 * @param {JSON} result
 * @param {Setter} setSelectedIndex
 */
export const usePoiSync = (videoRef, canvasRef, result, setSelectedIndex) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !result) return;

    const syncFrame = () => {
      const currentTime = video.currentTime;

      drawBoundingBox(currentTime, videoRef, canvasRef, result);

      const globalTimes = result.poi_forensics_report.time_vector;
      const globalIndex = globalTimes.findIndex(
        (t, i) =>
          currentTime >= t &&
          (globalTimes[i + 1] ? currentTime < globalTimes[i + 1] : true),
      );
      setSelectedIndex(globalIndex !== -1 ? globalIndex : null);
    };

    video.addEventListener("timeupdate", syncFrame);
    video.addEventListener("seeking", syncFrame);
    video.addEventListener("seeked", syncFrame);

    return () => {
      video.removeEventListener("timeupdate", syncFrame);
      video.removeEventListener("seeking", syncFrame);
      video.removeEventListener("seeked", syncFrame);
    };
  }, [videoRef, canvasRef, result, setSelectedIndex]);
};
