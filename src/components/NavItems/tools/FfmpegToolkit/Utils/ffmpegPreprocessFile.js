const videoSizeLimit = import.meta.env.VITE_FFMPEG_VIDEO_INPUT_LIMIT;
const extractLimit = import.meta.env.VITE_FFMPEG_VIDEO_EXTRACT_LIMIT;

/**
 * Helper function to check if a video file is too large to be processed.
 * @param videoFile {File} The image file to check
 * @param userRole The user role
 * @returns {boolean} True if the file is too large
 */
const isVideoInputFfmpegTooLarge = (videoFile) => {
  if (!videoFile.type.includes("video")) {
    throw new Error("Invalid file type. This file is not an image.");
  }

  return videoFile.size >= videoSizeLimit;
};

/**
 * Preprocesses a file for file upload
 * @param file {File} The file to preprocess
 * @param preprocessingFn {File | undefined | Error } Optional additional preprocessing that can return a new preprocessed file or handle additional errors
 * @param onSuccess {function} The function to run on preprocessing success
 * @param onError {function} The function to run in case of a preprocessing error
 * @returns {File | null | undefined} The processed file if the preprocessing succeeded
 */
//TODO: Handle custom Error from preprocessingFn
export const preprocessFfmpegVideoUpload = (
  file,
  preprocessingFn,
  onSuccess,
  onError,
) => {
  const fileType = file.type.split("/")[0];

  if (fileType === "video" && isVideoInputFfmpegTooLarge(file)) {
    onError();
    return undefined;
  }
  //Check if file type is not supported
  else if (fileType !== "video") {
    console.error("File error: type not supported");
    onError();
    return undefined;
  } else {
    if (preprocessingFn instanceof File) {
      // Use the processed file
      onSuccess(preprocessingFn);
      return preprocessingFn;
    } else if (preprocessingFn instanceof Error) {
      // The error should be processed in the preprocessingFn
      return undefined;
    } else if (preprocessingFn === null) {
      onError();
      return undefined;
    }

    onSuccess(file);
    return file;
  }
};

export const preprocessExtract = (
  sizeTotal,
  startTime,
  endTime,
  videoDuration,
) => {
  // useful for dwonload video case : the input is the extracted video so there is no tests to proceed the
  // extract has already been made
  if (!startTime || !endTime) {
    return false;
  }
  const startTimeFloat = parseToSeconds(startTime);
  const endTimeFloat = parseToSeconds(endTime);
  const videoDurationFloat = parseFloat(videoDuration);
  const sizeTotalFloat = parseFloat(sizeTotal);

  const extractSize =
    sizeTotalFloat * ((endTimeFloat - startTimeFloat) / videoDurationFloat);

  return extractSize >= extractLimit;
};

const parseToSeconds = (timeString) => {
  return timeString
    .split(":")
    .reduce((acc, time) => acc * 60 + parseInt(time, 10), 0);
};
