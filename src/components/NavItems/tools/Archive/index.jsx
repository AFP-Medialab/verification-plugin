import { QueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid2 from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ArrowBack } from "@mui/icons-material";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import {
  archiveStateCleaned,
  setArchiveUrl,
} from "redux/reducers/tools/archiveReducer";

import { archiving } from "../../../../constants/tools";
import useAuthenticatedRequest from "../../../Shared/Authentication/useAuthenticatedRequest";
import assistantApiCalls from "../../Assistant/AssistantApiHandlers/useAssistantApi";
import {
  KNOWN_LINKS,
  KNOWN_LINK_PATTERNS,
  matchPattern,
} from "../../Assistant/AssistantRuleBook";
import FifthStep from "./components/FifthStep";
import FirstStep from "./components/FirstStep";
import FourthStep from "./components/FourthStep";
import SecondStep from "./components/SecondStep";
import SixthStep from "./components/SixthStep";
import CustomizedMenus, { StyledMenu } from "./components/StyledMenu";
import ThirdStep from "./components/ThirdStep";

const queryClient = new QueryClient();

const Archive = () => {
  const { url } = useParams();

  const dispatch = useDispatch();
  const mainUrl = useSelector((state) => state.archive.mainUrl);

  const [urlInput, setUrlInput] = useState("");

  const [mediaUrl, setMediaUrl] = useState("");

  const [urlResults, setUrlResults] = useState(false);

  const [fileToUpload, setFileToUpload] = useState(/** @type {?File} */ null);

  const [archiveLinks, setArchiveLinks] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const [step, setStep] = useState(1);

  const [isWaczFileReplayable, setIsWaczFileReplayable] = useState(" ");
  const [step3HelperText, setStep3HelperText] = useState("");
  const [step3Error, setStep3Error] = useState(false);

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
    setIsWaczFileReplayable(" ");
    setStep3HelperText("");
    setStep3Error(false);
  };

  const isFileAWaczFile = (fileName) => {
    return fileName.split(".").pop() === "wacz";
  };

  const fetchArchivedUrls = async (waczFileUrl) => {
    const fetchUrl = process.env.REACT_APP_ARCHIVE_BACKEND;

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

    if (fileToUpload) {
      await archiveFileToWbm.mutate();
    } else {
      const urlToFetch = url && urlInput && urlInput !== url ? urlInput : url;

      await fetchMediaLinkForSocialMediaPost(urlToFetch);
    }
  };

  // It may be easier to read these form validations in the components themselves instead of having everything
  // in the parent component
  const handleContinueToNextStep = async () => {
    if (step === 3 && isWaczFileReplayable === " ") {
      setStep3HelperText("step3_radio_helper_text");
      setStep3Error(true);
      return;
    }

    if (step === 3 && isWaczFileReplayable === "false") {
      // jump to the archiving tips
      setStep(6);
    } else if (step <= 3) {
      // Increment to the next step
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
                    isRestartEnabled={step !== 1}
                    isGoToWbmStepEnabled={urlInput}
                    handleGoToFirstStep={() => {
                      handleCloseUrl();
                      setStep(1);
                    }}
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
              {step === 3 && (
                <ThirdStep
                  isWaczFileReplayable={isWaczFileReplayable}
                  setIsWaczFileReplayable={setIsWaczFileReplayable}
                  helperText={step3HelperText}
                  setHelperText={setStep3HelperText}
                  error={step3Error}
                  setError={setStep3Error}
                />
              )}
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
                    {keyword("back_button")}
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={() => handleContinueToNextStep()}
                  disabled={step === 4 && !fileToUpload}
                  sx={{ textTransform: "none" }}
                  startIcon={
                    step > 4 ? (
                      <archiving.icon
                        style={{
                          fontSize: "20px",
                        }}
                      />
                    ) : undefined
                  }
                >
                  {step <= 4
                    ? keyword("continue_button")
                    : keyword("new_archive_button")}
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
