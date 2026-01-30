import { getKeyframesJobPositionInQueueApi } from "@/components/NavItems/tools/Keyframes/api/getKeyframesJobPositionInQueue";
import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";

/**
 * Polls the status of a keyframe job until it completes.
 *
 * @param {Function} authenticatedRequest - The authenticated request function.
 * @param {string} jobId - The ID of the keyframe job to monitor.
 * @param {Function} [setStatus] - Optional function to update status messages (e.g. for UI).
 * @returns {Promise<string>} Resolves with the jobId once status is "completed:::100".
 * @throws {Error} Will throw an error if the job fails, is not found, or exceeds empty status retries.
 */
export async function pollKeyframeJobStatusApi(
  authenticatedRequest,
  jobId,
  setStatus,
) {
  let currentStatus;
  let emptyStatusTriesNumber = 0;
  const EMPTY_STATUS_MAX_TRIES = 3;

  do {
    if (emptyStatusTriesNumber > EMPTY_STATUS_MAX_TRIES) {
      throw new Error("Empty status. Try again.");
    }

    const config = {
      method: "get",
      url: `${import.meta.env.VITE_KEYFRAME_API}/status/${jobId}`,
    };

    const response = await authenticatedRequest(config);

    if (!response.data.status) {
      throw new Error("KSE Job id not found");
    }

    currentStatus = response.data.status;

    const statusMessage =
      currentStatus.indexOf(":") !== -1
        ? currentStatus.substring(0, currentStatus.indexOf(":"))
        : currentStatus;
    const statusPercentage = currentStatus.split(":").pop();

    if (statusMessage.includes("failed")) {
      throw new Error(statusMessage);
    }

    if (!statusMessage) {
      emptyStatusTriesNumber++;
      setStatus?.(`Processing... Trying to retrieve the status`);
    } else if (statusMessage.includes("waiting in queue")) {
      const queueLength = await getKeyframesJobPositionInQueueApi(
        authenticatedRequest,
        jobId,
      );
      setStatus?.(`Processing... ${statusMessage} (position: ${queueLength})`);
    } else {
      setStatus?.(`Processing... ${statusMessage} ${statusPercentage}%`);
    }

    if (currentStatus !== "completed:::100") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } while (currentStatus !== "completed:::100");

  return jobId;
}

/**
 * React hook that returns a polling function for a keyframe job.
 *
 * @param {Function} setStatus - Optional setter for displaying polling progress.
 * @returns {(jobId: string) => Promise<string>} A function that polls the job status until completion.
 */
export const usePollKeyframeJobStatus = (setStatus) => {
  const authenticatedRequest = useAuthenticatedRequest();

  return (jobId) =>
    pollKeyframeJobStatusApi(authenticatedRequest, jobId, setStatus);
};
