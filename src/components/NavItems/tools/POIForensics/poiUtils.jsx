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
  Trump: {
    DISPLAY_NAME: `${keyword("poi_forensics_trump")}`,
    NAME_TOSEND: "Trump",
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

    const label = `Track ${track.trackID} : ${score.toFixed(1)}`;
    const textWidth = ctx.measureText(label).width;

    if (ymin < 50) {
      const xText = Math.min(xmin + 5, canvas.width - textWidth - 5);
      ctx.fillText(label, xText, ymin + height / 4);
    } else {
      const xText = Math.min(xmin + 3, canvas.width - textWidth - 5);
      ctx.fillText(label, xText, ymin - 10);
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

export const computeGlobalScorePerTrack = (resultsPerTrack) => {
  const results = [];
  resultsPerTrack.forEach((result) => {
    if (!result.scores || result.scores.length === 0) {
      return;
    }

    const scores = result.scores;
    const n = scores.length;
    let globalScore;

    if (n <= 7) {
      const total = scores.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );
      globalScore = total / n;
    } else {
      const sortedScores = [...scores].sort((a, b) => a - b);

      const index = (n - 1) * 0.05; // the exact position of the 5th percentile
      const base = Math.floor(index); // the floor for our 5th percentile
      const distance = index - base; // the distance between the floor and the actual result

      if (distance != 0) {
        globalScore =
          sortedScores[base] +
          distance * (sortedScores[base + 1] - sortedScores[base]);
      } else {
        globalScore = sortedScores[index];
      }
    }

    results.push({
      trackID: result.trackID,
      globalScore: globalScore.toFixed(3),
    });
  });

  return results;
};

export const computeAreaUnderCurve = (results, times, threshold = 1) => {
  if (
    !times ||
    !results ||
    times.length !== results.length ||
    times.length < 2
  ) {
    return 0;
  }

  let totalArea = 0;
  let areaAboveTreshold = 0;
  let areaBelowTreshold = 0;

  for (let i = 0; i < times.length - 1; i++) {
    const dt = times[i + 1] - times[i]; // delta t

    // delta resutls
    const y1 = results[i] - threshold;
    const y2 = results[i + 1] - threshold;

    const averageHeight = (y1 + y2) / 2;
    if (averageHeight > 0) {
      areaAboveTreshold += dt * averageHeight;
    } else {
      areaBelowTreshold += dt * averageHeight;
    }

    totalArea += dt * averageHeight;
  }

  return {
    totalArea: totalArea.toFixed(3),
    areaAboveTreshold: areaAboveTreshold.toFixed(3),
    areaBelowTreshold: Math.abs(areaBelowTreshold.toFixed(3)),
    percentageFake: (
      (Math.abs(areaAboveTreshold) /
        (Math.abs(areaBelowTreshold) + areaAboveTreshold)) *
      100
    ).toFixed(1),
  };
};

export const computePercentagePointsAboveThreshold = (
  scores,
  threshold = 1,
) => {
  let countAbove = 0;

  for (let i = 0; i < scores.length; i++) {
    if (scores[i] > threshold) {
      countAbove += 1;
    }
  }

  return ((countAbove / scores.length) * 100).toFixed(1);
};
