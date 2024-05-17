import {
  MAX_AUDIO_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
} from "../../../config";

export const FILE_TYPES = {
  image: "image",
  audio: "audio",
  video: "video",
};

/**
 * Helper function to check if the image file is too large to be processed.
 * @param imageFile {File} The image file to check
 * @param userRole The user role
 * @returns {boolean} True if the file is too large
 */
export const isImageFileTooLarge = (imageFile, userRole) => {
  if (!imageFile.type.includes("image")) {
    throw new Error("Invalid file type. This file is not an image.");
  }

  return (
    (!userRole || !userRole.includes("EXTRA_FEATURE")) &&
    imageFile.size >= MAX_IMAGE_FILE_SIZE
  );
};

/**
 * Helper function to check if a video file is too large to be processed.
 * @param videoFile {File} The image file to check
 * @param userRole The user role
 * @returns {boolean} True if the file is too large
 */
export const isVideoFileTooLarge = (videoFile, userRole) => {
  if (!videoFile.type.includes("video")) {
    throw new Error("Invalid file type. This file is not an image.");
  }

  return (
    (!userRole || !userRole.includes("EXTRA_FEATURE")) &&
    videoFile.size >= MAX_VIDEO_FILE_SIZE
  );
};

/**
 * Helper function to check if the audio file is too large to be processed.
 * @param audioFile {File} The audio file to check
 * @param userRole The user role
 * @returns {boolean} True if the file is too large
 */
export const isAudioFileTooLarge = (audioFile, userRole) => {
  if (!audioFile.type.includes("audio")) {
    throw new Error("Invalid file type. This file is not an audio file.");
  }

  return (
    (!userRole || !userRole.includes("EXTRA_FEATURE")) &&
    audioFile.size >= MAX_AUDIO_FILE_SIZE
  );
};

/**
 * Preprocesses a file for file upload
 * @param file {File} The file to preprocess
 * @param role The user's role
 * @param preprocessingFn {File | undefined | Error } Optional additional preprocessing that can return a new preprocessed file or handle additional errors
 * @param onSuccess {function} The function to run on preprocessing success
 * @param onError {function} The function to run in case of a preprocessing error
 * @returns {File | null | undefined} The processed file if the preprocessing succeeded
 */
//TODO: Handle custom Error from preprocessingFn
export const preprocessFileUpload = (
  file,
  role,
  preprocessingFn,
  onSuccess,
  onError,
) => {
  const fileType = file.type.split("/")[0];

  if (fileType === FILE_TYPES.image && isImageFileTooLarge(file, role)) {
    onError();
    return undefined;
  } else if (fileType === FILE_TYPES.audio && isAudioFileTooLarge(file, role)) {
    onError();
    return undefined;
  } else if (fileType === FILE_TYPES.video && isVideoFileTooLarge(file, role)) {
    onError();
    return undefined;
  }
  //Check if file type is not supported
  else if (
    fileType !== FILE_TYPES.image &&
    fileType !== FILE_TYPES.audio &&
    fileType !== FILE_TYPES.video
  ) {
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
