import { MAX_AUDIO_FILE_SIZE, MAX_IMAGE_FILE_SIZE } from "../../../config";

/**
 * Helper function to check if the image file is too large to be processed.
 * @param imageFile {file} The image file to check
 * @param userRole The user role
 * @returns {boolean} True if the file is too large
 */
export const isImageFileTooLarge = (imageFile, role) => {
  if (!imageFile.type.includes("image")) {
    throw new Error("Invalid file type. This file is not an image.");
  }

  if (
    (!role || !role.includes("EXTRA_FEATURE")) &&
    imageFile.size >= MAX_IMAGE_FILE_SIZE
  ) {
    return true;
  }

  return false;
};

/**
 * Helper function to check if the audio file is too large to be processed.
 * @param audioFile {file} The audio file to check
 * @param userRole The user role
 * @returns {boolean} True if the file is too large
 */
export const isAudioFileTooLarge = (audioFile, role) => {
  if (!audioFile.type.includes("audio")) {
    throw new Error("Invalid file type. This file is not an audio file.");
  }

  if (
    (!role || !role.includes("EXTRA_FEATURE")) &&
    audioFile.size >= MAX_AUDIO_FILE_SIZE
  ) {
    return true;
  }

  return false;
};
