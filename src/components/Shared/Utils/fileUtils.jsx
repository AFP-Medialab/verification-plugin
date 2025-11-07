import {
  MAX_AUDIO_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
} from "@/config";
import { ROLES } from "@/constants/roles";
import {
  fileTypeFromBlob,
  fileTypeFromBuffer,
  fileTypeFromStream,
} from "file-type";

export const FILE_TYPES = {
  image: "image",
  audio: "audio",
  video: "video",
};

/**
 * Returns the file type by fetching the remote content
 * @param url {string} The URL string
 * @returns {Promise<{readonly ext: string, readonly mime: string}|FileTypeResult|undefined|Error>}
 */
export const getFileTypeFromUrl = async (url) => {
  try {
    const response = await fetch(url);

    return await fileTypeFromStream(response.body);
  } catch (error) {
    console.error(error);
    throw new Error(`Could not get file type for ${url}`);
  }
};

/**
 * Returns the file type for a Blob, Buffer
 * @param file {Blob | Buffer}
 * @returns {Promise<{readonly ext: string, readonly mime: string}|FileTypeResult|undefined|Error>}
 */
export const getFileTypeFromFileObject = async (file) => {
  try {
    let fileType;

    if (file instanceof Blob) fileType = await fileTypeFromBlob(file);
    else if (file instanceof Buffer) fileType = fileTypeFromBuffer(file);
    else
      throw new Error(
        `Error: the file type is not supported or file path is invalid ${file}`,
      );

    return fileType;
  } catch (error) {
    return new Error(`Error: could not get file type for ${file}: ${error}`);
  }
};

/**
 * Helper function to check if the image file is too large to be processed.
 * @param imageFile {File} The image file to check
 * @param userRole The user role
 * @param maxImageFileSize {number} The maximum image file size in bytes if not using the default size
 * @returns {boolean} True if the file is too large
 */
export const isImageFileTooLarge = (
  imageFile,
  userRole,
  maxImageFileSize = MAX_IMAGE_FILE_SIZE,
) => {
  if (!imageFile.type.includes("image")) {
    throw new Error("Invalid file type. This file is not an image.");
  }

  return (
    (!userRole || !userRole.includes(ROLES.EXTRA_FEATURE)) &&
    imageFile.size >= maxImageFileSize
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
    (!userRole || !userRole.includes(ROLES.EXTRA_FEATURE)) &&
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
    (!userRole || !userRole.includes(ROLES.EXTRA_FEATURE)) &&
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
 * @param maxImageFileSize {number} The maximum image file in bytes size if not using the default size
 * @returns {File | null | undefined} The processed file if the preprocessing succeeded
 */
//TODO: Handle custom Error from preprocessingFn
export const preprocessFileUpload = (
  file,
  role,
  preprocessingFn,
  onSuccess,
  onError,
  maxImageFileSize = MAX_IMAGE_FILE_SIZE,
) => {
  const fileType = file.type.split("/")[0];

  if (
    fileType === FILE_TYPES.image &&
    isImageFileTooLarge(file, role, maxImageFileSize)
  ) {
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

let workerInstance;

/**
 * Resizes an image using a shared Web Worker
 * @param {Blob | File} image - the image to resize
 * @returns {Promise<Blob>} the resized image
 */
export const resizeImageWithWorker = (image) => {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("@workers/resizeImageWorker", import.meta.url),
    );
  }

  return new Promise((resolve, reject) => {
    const handleMessage = (event) => {
      cleanup();
      resolve(event.data);
    };

    const handleError = (event) => {
      cleanup();
      reject(event.error || new Error("Worker error"));
    };

    const cleanup = () => {
      workerInstance.removeEventListener("message", handleMessage);
      workerInstance.removeEventListener("error", handleError);
    };

    workerInstance.addEventListener("message", handleMessage);
    workerInstance.addEventListener("error", handleError);
    workerInstance.postMessage(image);
  });
};

/**
 * Downloads a file from a URL or Blob.
 * @param {string|Blob} source - Either a URL string or a Blob object.
 * @param {string} [filename] - Optional filename for the download. If omitted, browser decides.
 */
export const downloadFile = async (source, filename) => {
  let objectUrl;

  try {
    // Determine blob
    let blob;
    if (source instanceof Blob) {
      blob = source;
    } else if (typeof source === "string") {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      blob = await response.blob();
    } else {
      throw new Error("Source must be a URL string or a Blob");
    }

    // Create object URL
    objectUrl = URL.createObjectURL(blob);

    // Create temporary anchor
    const a = document.createElement("a");
    a.href = objectUrl;

    if (filename) {
      a.download = filename;
    }

    document.body.appendChild(a);
    a.click();
    a.remove();

    // Revoke after a short delay to ensure download starts
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (err) {
    console.error("Download failed:", err);
    throw err;
  }
};

/**
 * Converts a Blob to a data URL
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} Promise that resolves to data URL
 */
export const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Converts a Blob to base64 string (without data URL prefix)
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} Promise that resolves to base64 string
 */
export const blobToBase64 = async (blob) => {
  const dataUrl = await blobToDataUrl(blob);
  return dataUrl.slice(dataUrl.indexOf(",") + 1);
};
