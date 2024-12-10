import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import useAuthenticatedRequest from "../../../../Shared/Authentication/useAuthenticatedRequest";
import LoadingButton from "@mui/lab/LoadingButton";
import { Download } from "@mui/icons-material";
import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";

/**
 *
 * @param url {string}
 * @returns {Element}
 * @constructor
 */
const DownloadWaczFile = ({ url }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  const authenticatedRequest = useAuthenticatedRequest();

  const sleep = (fn, param) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fn(param)), 3000);
    });
  };

  /**
   *
   * @param url {string}
   * @returns {Promise<{wacz: (string | ArrayBuffer | ArrayBufferView | Blob)[], fileId: string}>}
   */
  const downloadWaczFileFromScoop = async (url) => {
    // Step 1: Capture the URL

    const data = JSON.stringify({
      url: url,
      options: {
        logLevel: "info",
        captureVideoAsAttachment: true,
        captureCertificatesAsAttachment: true,
        provenanceSummary: true,
        pdfSnapshot: false,
        domSnapshot: false,
        screenshot: true,
      },
    });

    const baseUrl = process.env.REACT_APP_ARCHIVE_CAPTURE;

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/capture`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let response;

    try {
      response = await authenticatedRequest(config);
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }

    let fileId = response.data.id;

    //   Step 2 Get capture status

    let isCaptureFinished = false;

    const config2 = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/capture/${fileId}`,
    };

    const fetchNewStatus = async () => {
      try {
        response = await authenticatedRequest(config2);
      } catch (error) {
        console.error(error);
        throw new Error(error.message);
      }

      return response;
    };

    while (!isCaptureFinished) {
      await sleep(fetchNewStatus);

      if (response.data.status !== "STARTED") {
        isCaptureFinished = true;
      }
    }

    // STEP 3: Download file

    const config3 = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/capture/download/${fileId}`,
      responseType: "blob",
    };

    try {
      response = await authenticatedRequest(config3);
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return {
      fileId: fileId,
      wacz: [response.data],
    };
  };

  const getWaczFileFromScoop = useMutation({
    mutationFn: () => {
      return downloadWaczFileFromScoop(url);
    },
    onSuccess: (data) => {
      // Create a Blob from the response data
      const blob = new Blob(data.wacz, {
        type: "application/octet-stream",
      });

      // Generate an URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${data.fileId}.wacz`;
      a.click();
    },
  });

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <LoadingButton
          variant="outlined"
          sx={{ textTransform: "none" }}
          onClick={async () => await getWaczFileFromScoop.mutate()}
          loading={getWaczFileFromScoop.isPending}
          loadingPosition="start"
          startIcon={<Download />}
        >
          {getWaczFileFromScoop.isPending
            ? "Processing..."
            : "Download .wacz file"}
        </LoadingButton>
        {getWaczFileFromScoop.isError && (
          <Typography variant="body2" color="error">
            {keyword("archiving_error")}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default DownloadWaczFile;