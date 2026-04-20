/**
 * Enumeration that contains person of interest whose biometrics model has been
 * developped.
 * It is displayed as chekboxes in the POI Forensics features.
 */
export const getPersonOfInterest = (keyword) => ({
  MACRON: {
    DISPLAY_NAME: `${keyword("poi_forensics_macron")}`,
    NAME_TOSEND: "Macron",
  },
  PUTIN: {
    DISPLAY_NAME: `${keyword("poi_forensics_putin")}`,
    NAME_TOSEND: "Putin_ru",
  },
  Zelensky: {
    DISPLAY_NAME: `${keyword("poi_forensics_zelensky")}`,
    NAME_TOSEND: "Zelensky_ru",
  },
  Meloni: {
    DISPLAY_NAME: `${keyword("poi_forensics_meloni")}`,
    NAME_TOSEND: "GiorgiaMeloni",
  },
});

/**
 * Enumeration that contains the modes the model accept.
 * It is displayed as chekboxes in the POI Forensics features.
 */
export const getMode = (keyword) => ({
  AUDIO_VIDEO: {
    DISPLAY_NAME: `${keyword("poiforensics_mode_audiovideo")}`,
    NAME_TOSEND: "audiovideo",
  },
  VIDEO: {
    DISPLAY_NAME: `${keyword("poiforensics_mode_video")}`,
    NAME_TOSEND: "video",
  },
});

/**
 * Delete the canva where the boudingbox is displayed
 * @param {*} canvasRef
 */
export const clearCanvas = (canvasRef) => {
  if (canvasRef.current) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

/**
 * This utils take in input the index associated with the current time of the video.
 * It uses the index to find the score and the bounding box associated to this timestamp.
 * And then it adds the bounding box to the canva which is overlaid on the video.
 * @param {Integer} index
 * @param {import("react").Ref} videoRef
 * @param {import("react").Ref} canvasRef
 * @param {JSON} result
 * @returns
 */
export const drawBoundingBox = (videoTime, videoRef, canvasRef, result) => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const report = result?.poi_forensics_report;

  if (!video || !canvas || !report) return;

  const ctx = canvas.getContext("2d");

  // make sure that the canva is always exactly the size of the video
  if (
    canvas.width !== video.videoWidth ||
    canvas.height !== video.videoHeight
  ) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const threshold = report.decision_threshold;

  // we have to check if there is still data to display, in order to delete the box if not (0.3 is totally arbitrary)
  const lastTime = report.time_vector[report.time_vector.length - 1];
  if (videoTime > lastTime + 0.3) {
    return;
  }

  // sometimes the results are on several tracks, we need to go through every track to
  // get all the results
  report.results_per_track.forEach((track) => {
    const trackIndex = getIndexFromTime(videoTime, track.time_vector);

    if (trackIndex !== -1) {
      const bbox = track.bboxes[trackIndex];
      const score = track.scores[trackIndex];

      if (bbox) {
        const [xmin, ymin, xmax, ymax] = bbox;
        const color = score > threshold ? "#ff0000" : "#00ff00";

        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = color;
        ctx.rect(xmin, ymin, xmax - xmin, ymax - ymin);
        ctx.stroke();

        const fontSize = Math.floor(canvas.height / 15);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "Black";
        ctx.fillText(`${score.toFixed(2)}`, xmin, ymin - 10);
      }
    }
  });
};

/**
 * Utils that return the right index that is associated to the currentTime in the video
 * (because we don't have a tuple score/boudningbox for every second of the video)
 * @param {*} currentTime
 * @param {*} timeVector
 * @returns
 */
export const getIndexFromTime = (currentTime, timeVector) => {
  return timeVector.findIndex(
    (t, i) =>
      // two condition to be the index associated to the currentTime : time[index] < currentTime and time[index+1] > currentTime
      currentTime >= t &&
      (timeVector[i + 1] ? currentTime < timeVector[i + 1] : true),
  );
};
