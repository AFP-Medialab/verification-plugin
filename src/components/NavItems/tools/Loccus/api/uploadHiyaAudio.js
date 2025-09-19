import { v4 as uuidv4 } from "uuid";

/**
 * Uploads an audio file to the Loccus service for processing
 *
 * @param {string} base64EncodedFile - The base64 encoded audio file data
 * @param {Function} authenticatedRequest - The authenticated request function from useAuthenticatedRequest hook
 * @param {string} [alias] - Optional alias for the upload. If not provided, a random UUID will be generated
 * @returns {Promise<Object>} Promise that resolves to the upload response containing the file handle
 * @throws {Error} When upload fails, no data is returned, or file state is not available
 *
 * @example
 * ```javascript
 * import { uploadAudioToLoccus } from './uploadHiyaAudio';
 * import useAuthenticatedRequest from 'components/Shared/Authentication/useAuthenticatedRequest';
 *
 * const authenticatedRequest = useAuthenticatedRequest();
 * const base64Audio = await blobToBase64(audioFile);
 *
 * try {
 *   const uploadResult = await uploadAudioToLoccus(base64Audio, authenticatedRequest);
 *   console.log('File handle:', uploadResult.data.handle);
 * } catch (error) {
 *   console.error('Upload failed:', error.message);
 * }
 * ```
 */
export const uploadAudioToLoccus = async (
  base64EncodedFile,
  authenticatedRequest,
  alias = null,
) => {
  if (!base64EncodedFile) {
    throw new Error("Base64 encoded file is required");
  }

  if (!authenticatedRequest) {
    throw new Error("Authenticated request function is required");
  }

  const uploadRequestData = JSON.stringify({
    file: base64EncodedFile,
    alias: alias || uuidv4(),
  });

  const uploadRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.REACT_APP_LOCCUS_URL + "/upload",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: uploadRequestData,
    timeout: 60000,
    signal: AbortSignal.timeout(60000),
  };

  try {
    const uploadResponse = await authenticatedRequest(uploadRequestConfig);

    if (
      !uploadResponse ||
      !uploadResponse.data ||
      uploadResponse.data.message
    ) {
      throw new Error("No data received from upload endpoint");
    }

    if (
      !uploadResponse.data.state ||
      uploadResponse.data.state !== "available"
    ) {
      throw new Error("The file is not available after upload");
    }

    return uploadResponse;
  } catch (error) {
    if (
      error.message.includes("canceled") ||
      error.message.includes("timeout")
    ) {
      throw new Error("Upload request timed out");
    }
    throw new Error(error.response?.data?.message || error.message);
  }
};
