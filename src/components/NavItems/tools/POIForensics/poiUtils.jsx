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
  AUDIO: {
    DISPLAY_NAME: `${keyword("poiforensics_mode_audio")}`,
    NAME_TOSEND: "audio",
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

  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;

  const scaleX = video.clientWidth / video.videoWidth;
  const scaleY = video.clientHeight / video.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const threshold = report.decision_threshold;

  report.results_per_track.forEach((track) => {
    if (!track.bboxes) return;

    const trackTimeVector = track.time_vector;
    if (!trackTimeVector) return;

    const trackIndex = getIndexFromTime(videoTime, trackTimeVector);

    const bbox = track.bboxes[trackIndex];
    if (!bbox) return;

    const score = track.scores
      ? track.scores[trackIndex]
      : report.scores_per_time?.[trackIndex] || 0;
    const color = score > threshold ? "#ff0000" : "#00ff00";

    if (bbox.some((val) => val === null || isNaN(val))) {
      ctx.font = `bold ${Math.floor(canvas.height / 20)}px Arial`;
      ctx.fillStyle = "#858585";
      ctx.fillText(`${score.toFixed(3)}`, 10, 50);
      return;
    }

    const [xmin_base, ymin_base, xmax_base, ymax_base] = bbox;
    const xmin = xmin_base * scaleX;
    const ymin = ymin_base * scaleY;
    const xmax = xmax_base * scaleX;
    const ymax = ymax_base * scaleY;
    const width = xmax - xmin;
    const height = ymax - ymin;

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.rect(xmin, ymin, width, height);
    ctx.stroke();

    const fontSize = Math.floor(canvas.height / 25);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "#ffffff";

    if (ymin < 50) {
      ctx.fillText(`${score.toFixed(3)}`, xmin + 5, ymin + height / 4);
    } else {
      ctx.fillText(`${score.toFixed(3)}`, xmin + 3, ymin - 10);
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
  let trackIndex = -1;
  let minDiff = 1;

  for (let i = 0; i < timeVector.length; i++) {
    const diff = Math.abs(currentTime - timeVector[i]);
    if (diff < minDiff) {
      trackIndex = i;
    }
  }

  return trackIndex;
};
