import React, { useEffect, useState } from "react";

import { Box, Button, Card, Grid2, Stack, Typography } from "@mui/material";
import useAuthenticatedRequest from "../../../Shared/Authentication/useAuthenticatedRequest";
import { useParams } from "react-router-dom";
import {
  archiveStateCleaned,
  setArchiveUrl,
} from "redux/reducers/tools/archiveReducer";
import { useDispatch, useSelector } from "react-redux";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { archiving } from "../../../../constants/tools";
import {
  KNOWN_LINK_PATTERNS,
  KNOWN_LINKS,
  matchPattern,
} from "../../Assistant/AssistantRuleBook";
import assistantApiCalls from "../../Assistant/AssistantApiHandlers/useAssistantApi";
import { QueryClient, useMutation } from "@tanstack/react-query";
import CustomizedMenus, { StyledMenu } from "./components/StyledMenu";
import FirstStep from "./components/FirstStep";
import SecondStep from "./components/SecondStep";
import { ArrowBack } from "@mui/icons-material";
import ThirdStep from "./components/ThirdStep";
import FourthStep from "./components/FourthStep";
import FifthStep from "./components/FifthStep";
import SixthStep from "./components/SixthStep"; //TODO:UI for long strings

//TODO:UI for long strings

const queryClient = new QueryClient();

const Archive = () => {
  const { url } = useParams();

  const dispatch = useDispatch();
  const mainUrl = useSelector((state) => state.archive.mainUrl);

  const [urlInput, setUrlInput] = useState("");

  const [mediaUrl, setMediaUrl] = useState("");

  const [urlResults, setUrlResults] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [fileToUpload, setFileToUpload] = useState(/** @type {File?} */ null);

  const [archiveLinks, setArchiveLinks] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const [step, setStep] = useState(1);

  const authenticatedRequest = useAuthenticatedRequest();

  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  useEffect(() => {
    if (mainUrl) {
      setUrlResults(true);
      setUrlInput(mainUrl);
      handleSubmit(mainUrl);
    } else if (url && url !== "") {
      setUrlResults(true);
      setUrlInput(url);
      setArchiveUrl(url);
      handleSubmit(url);
    }
  }, []);

  const handleCloseUrl = () => {
    setFileToUpload(null);
    setUrlResults(false);
    setErrorMessage("");
    dispatch(archiveStateCleaned());
    setUrlInput("");
    archiveFileToWbm.reset();
    setArchiveLinks(null);
  };

  const isFileAWaczFile = (fileName) => {
    return fileName.split(".").pop() === "wacz";
  };

  const fetchArchivedUrls = async (waczFileUrl) => {
    const fetchUrl = process.env.ARCHIVE_BACKEND;

    if (!waczFileUrl) {
      throw new Error("upload_error");
    }

    try {
      let data = new FormData();
      data.append("file", waczFileUrl);

      const axiosConfig = {
        method: "post",
        url: fetchUrl,
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      return await authenticatedRequest(axiosConfig);
    } catch (error) {
      console.error(error);
      throw new Error("upload_error");
    }
  };

  const fetchMediaUrl = async (urlType, urlInput) => {
    const res = await assistantApiCalls().callAssistantScraper(
      urlType,
      urlInput,
    );

    if (!res.status || res.status !== "success") throw new Error("fetch_error");

    return res;
  };

  const fetchMediaLinkForSocialMediaPost = async (url) => {
    if (!url || typeof url !== "string") {
      return;
    }

    setErrorMessage("");

    setArchiveUrl(url);
    setUrlResults(true);
    dispatch(setArchiveUrl(url));

    const urlType = matchPattern(url, KNOWN_LINK_PATTERNS);

    try {
      if (urlType === KNOWN_LINKS.TWITTER) {
        setIsLoading(true);

        const res = await queryClient.ensureQueryData({
          queryKey: ["extracted_media_link", url],
          queryFn: () => fetchMediaUrl(urlType, url),
          staleTime: 1000 * 60 * 5,
        });

        let mediaUrl;

        if (res.images && res.images.length > 0) {
          mediaUrl = res.images[0];
        } else if (res.videos && res.videos.length > 0) {
          mediaUrl = res.videos[0];
        }

        if (mediaUrl && typeof mediaUrl === "string") setMediaUrl(mediaUrl);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWaczFileToWbm = async () => {
    if (!fileToUpload || !isFileAWaczFile(fileToUpload.name)) {
      throw new Error("file_error");
    }

    let result;

    try {
      result = await fetchArchivedUrls(fileToUpload);
    } catch (error) {
      // User friendly Errors
      throw new Error("upload_error");
    }

    if (!result) throw new Error("upload_error");

    let results = [];

    for (const page of Object.keys(result.data.pages)) {
      let archivedUrl = result.data.pages[page].capture_url;
      let originalUrl = result.data.pages[page].url;
      results.push({ archivedUrl, originalUrl });
    }

    if (results.length === 0) {
      throw new Error("upload_error");
    }

    return results;
  };

  const archiveFileToWbm = useMutation({
    mutationFn: () => {
      return sendWaczFileToWbm();
    },
    onSuccess: (data) => {
      setArchiveLinks(data);
    },
  });

  /**
   *
   * @param url {?string}
   * @returns {Promise<void>}
   */
  const handleSubmit = async (url) => {
    // Reset states
    setErrorMessage("");
    setArchiveLinks([]);
    setMediaUrl("");
    setIsLoading(true);

    if (fileToUpload) {
      await archiveFileToWbm.mutate();
    } else {
      const urlToFetch = url && urlInput && urlInput !== url ? urlInput : url;

      await fetchMediaLinkForSocialMediaPost(urlToFetch);
    }

    setIsLoading(false);
  };

  const handleContinueToNextStep = async () => {
    if (step <= 3) {
      setStep((prev) => prev + 1);
    } else if (step === 4) {
      await handleSubmit();
      setStep(5);
    } else if (step === 5 || step === 6) {
      // reset to 1st step
      handleCloseUrl();
      setStep(1);
    }
  };

  return (
    <Box sx={{ minHeight: "65vh" }}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <Box p={3} sx={{ height: "fill-available" }}>
          <Stack
            direction="column"
            sx={{
              justifyContent: "space-between",
              height: "100%",
            }}
            spacing={2}
          >
            <Stack direction="column" spacing={4}>
              <Stack direction="row" justifyContent={"space-between"}>
                <Box>
                  <Grid2
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                  >
                    <archiving.icon
                      style={{
                        fontSize: "40px",
                        fill: "#00926c",
                      }}
                    />

                    <Typography variant="h5" color={"primary"}>
                      {keyword("archive_name")}
                    </Typography>
                  </Grid2>
                </Box>
                <Box>
                  <CustomizedMenus
                    handleGoToFirstStep={() => setStep(1)}
                    handleGoToWaczUpload={() => setStep(4)}
                    handleGoToWbmStep={() => setStep(6)}
                  />
                </Box>
              </Stack>

              {step === 1 && (
                <FirstStep
                  handleClick={setStep}
                  url={urlInput}
                  handleUrlChange={setUrlInput}
                />
              )}
              {step === 2 && <SecondStep url={urlInput} />}
              {step === 3 && <ThirdStep />}
              {step === 4 && (
                <FourthStep
                  fileInput={fileToUpload}
                  setFileInput={setFileToUpload}
                />
              )}
              {step === 5 && (
                <FifthStep
                  archiveFileToWbm={archiveFileToWbm}
                  fileToUpload={fileToUpload}
                  errorMessage={errorMessage}
                  archiveLinks={archiveLinks}
                />
              )}
              {step === 6 && (
                <SixthStep urlInput={urlInput} mediaUrl={mediaUrl} />
              )}
            </Stack>

            {step >= 2 && (
              <Stack
                direction="row"
                spacing={4}
                sx={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {step < 5 && (
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setStep((prev) => prev - 1)}
                  >
                    {"Back"}
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={() => handleContinueToNextStep()}
                  disabled={step === 4 && !fileToUpload}
                >
                  {step <= 4 ? "Continue" : "New archive"}
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Card>
      <Box p={2} />
    </Box>
  );
};

export default Archive;
