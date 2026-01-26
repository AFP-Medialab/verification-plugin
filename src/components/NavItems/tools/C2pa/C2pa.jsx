import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { ArrowDownward } from "@mui/icons-material";

import { ROLES } from "@/constants/roles";
import { useUrlOrFile } from "Hooks/useUrlOrFile";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import exifr from "exifr";
import {
  c2paLoadingSet,
  resetC2paState,
  setAfpHdImage,
  setC2paThumbnail,
  setC2paThumbnailCaption,
  setHdImageC2paData,
} from "redux/reducers/tools/c2paReducer";
import { v4 as uuidv4 } from "uuid";

import useAuthenticatedRequest from "../../../Shared/Authentication/useAuthenticatedRequest";
import getC2paData, { getC2paDataHd } from "./Hooks/useGetC2paData";
import C2paResults from "./Results/C2paResults";
import AfpReverseSearchResults from "./components/AfpReverseSearchResults";
import HdImageResults from "./components/HdImageResults";

const C2paData = () => {
  const [searchParams] = useSearchParams();
  const fromAssistant = searchParams.has("fromAssistant");

  const role = useSelector((state) => state.userSession.user.roles);

  const isLoading = useSelector((state) => state.c2pa.loading);
  const result = useSelector((state) => state.c2pa.result);

  const thumbnailImage = useSelector((state) => state.c2pa.thumbnail);

  const thumbnailImageCaption = useSelector(
    (state) => state.c2pa.thumbnailCaption,
  );

  const hdImage = useSelector((state) => state.c2pa.afpHdImage);

  const hdImageC2paData = useSelector((state) => state.c2pa.hdImageC2paData);

  const urlImage = useSelector((state) => state.c2pa.url);

  const [input = urlImage || "", setInput, imageFile, setImageFile] =
    useUrlOrFile();

  const [imageMetadata, setImageMetadata] = useState(null);

  const dispatch = useDispatch();

  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const [errorMessage, setErrorMessage] = useState(null);

  const [loadingProgress, setLoadingProgress] = useState(null);

  const [performReverseSearch, setPerformReverseSearch] = useState(true);

  const authenticatedRequest = useAuthenticatedRequest();

  const getTransactionId = () => {
    return `verificationplugin-${chrome.runtime.getManifest().version}-${uuidv4()}`;
  };

  const getAfpReverseSearch = async () => {
    const formData = new FormData();

    formData.append("imageData", imageFile);

    const data = input ? { imageUrl: input } : formData;

    const afpRenditionTypeHD = "HD";
    const afpRenditionTypeThumbnail = "THUMBNAIL";

    const afpRenditionType =
      role.includes(ROLES.AFP_C2PA_GOLD) || role.includes(ROLES.EXTRA_FEATURE)
        ? afpRenditionTypeHD
        : afpRenditionTypeThumbnail;

    const serverUrl = process.env.REACT_APP_AFP_REVERSE_SEARCH_URL;

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${serverUrl}/search/async`,
      headers: {
        Accept: "*/*",
        "X-AFP-RENDITION-TYPE": afpRenditionType,
        "X-AFP-TRANSACTION-ID": getTransactionId(),
        "Content-Type": input
          ? "application/x-www-form-urlencoded"
          : imageFile.type,
      },
      data: data,
    };

    let res;

    try {
      res = await authenticatedRequest(config);
    } catch (error) {
      console.log(error);
      setErrorMessage(keyword("error_message_reverse_search_generic"));
      return;
    }

    if (res.data.progress) {
      setLoadingProgress(res.data.progress);
    } else {
      setLoadingProgress("0");
    }

    const reverseSearchUrl = res.data.iMatagReverseSearchUrl
      .split("/")
      .filter(Boolean)
      .pop();

    const statusData = res.data;

    const waitAndRetrieveCompletedReverseSearch = async (
      data,
      reverseSearchUrl,
    ) => {
      let status = data;

      const serverUrl = process.env.REACT_APP_AFP_REVERSE_SEARCH_URL;

      const getNewStatus = async () => {
        const statusConfig = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${serverUrl}/search/${reverseSearchUrl}`,
          headers: {
            "Content-Type": "application/json",
            "X-AFP-TRANSACTION-ID": getTransactionId(),
          },
          data: data,
        };

        return (await authenticatedRequest(statusConfig)).data;
      };

      function sleep(timeout) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), timeout);
        });
      }

      while (status.status === "pending" || status.status === "in progress") {
        await sleep(10000);

        status = await getNewStatus();

        if (status.progress && !Number.isNaN(status.progress)) {
          setLoadingProgress(status.progress);
        }
      }
      return status;
    };

    let urls;

    try {
      urls = await waitAndRetrieveCompletedReverseSearch(
        statusData,
        reverseSearchUrl,
      );

      if (!urls.thumbnailUrl && !urls.hdUrl) {
        throw new Error(keyword("error_message_reverse_search_generic"));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);

      if (
        error.status === 404 ||
        (error.status === 200 &&
          error.message.includes("No watermarked result"))
      ) {
        setErrorMessage(keyword("error_message_no_result_found"));
      }

      setLoadingProgress(false);
      dispatch(c2paLoadingSet(false));
      return;
    }

    if (urls.thumbnailUrl) {
      const thumbnailImageConfig = {
        method: "get",
        responseType: "blob",
        maxBodyLength: Infinity,
        url: `${serverUrl}${urls.thumbnailUrl}`,
        headers: {
          "X-AFP-TRANSACTION-ID": getTransactionId(),
        },
      };

      const blob = (await authenticatedRequest(thumbnailImageConfig)).data;

      const imageUrl = URL.createObjectURL(blob);

      const options = {
        exif: true,
        gps: true,
        iptc: true,
        jfif: true,
        tiff: true,
        mergeOutput: false,
      };

      const metadata = await exifr.parse(blob, options);

      setImageMetadata(metadata);

      if (metadata.iptc && metadata.iptc["Caption"])
        dispatch(setC2paThumbnailCaption(metadata.iptc["Caption"]));

      dispatch(setC2paThumbnail(imageUrl));
    }

    if (urls.hdUrl && !role.includes(ROLES.AFP_C2PA_2)) {
      const hdImageConfig = {
        method: "get",
        responseType: "blob",
        maxBodyLength: Infinity,
        url: `${serverUrl}${urls.hdUrl}`,
        headers: {
          "X-AFP-TRANSACTION-ID": getTransactionId(),
        },
      };

      const blob = (await authenticatedRequest(hdImageConfig)).data;

      const imageUrl = URL.createObjectURL(blob);

      dispatch(setAfpHdImage(imageUrl));

      dispatch(setHdImageC2paData(await getC2paDataHd(imageUrl), dispatch));
    }
  };

  const handleSubmit = async () => {
    dispatch(resetC2paState());
    setLoadingProgress(null);

    setErrorMessage(null);

    dispatch(c2paLoadingSet(true));

    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      getC2paData(url, dispatch);
    } else if (input) {
      getC2paData(input, dispatch);
    }

    if (performReverseSearch) await getAfpReverseSearch();

    setLoadingProgress(null);

    dispatch(c2paLoadingSet(false));
  };

  useEffect(() => {
    if (urlImage && input && !result && !fromAssistant) {
      handleSubmit();
    }
  }, [urlImage, input, result]);

  useEffect(() => {
    if (fromAssistant && (input || imageFile)) {
      handleSubmit();
    }
  }, [searchParams, input, imageFile]);

  const resetState = () => {
    setImageFile(undefined);
    setInput("");
    setErrorMessage(null);

    dispatch(resetC2paState());
  };

  const togglePerformReverseSearch = () => {
    setPerformReverseSearch((prev) => !prev);
  };

  const downloadHdImage = () => {
    if (
      !role.includes(ROLES.AFP_C2PA_GOLD) &&
      !role.includes(ROLES.EXTRA_FEATURE)
    ) {
      return;
    }

    const a = document.createElement("a");

    if (hdImage && typeof hdImage === "string") {
      a.href = hdImage;
      a.download = "AFP_Image_From_Camera.jpg";
      a.click();
    }
  };

  return (
    <Box>
      <HeaderTool
        name={keyword("c2pa_title")}
        description={keyword("c2pa_description")}
      />
      <Card variant="outlined" sx={{ minWidth: 500 }}>
        <Box
          sx={{
            p: 4,
          }}
        >
          <form>
            <Stack direction="column" spacing={4}>
              <StringFileUploadField
                labelKeyword={keyword("image_link")}
                placeholderKeyword={keyword("placeholder")}
                submitButtonKeyword={keyword("submit_button")}
                localFileKeyword={keyword("button_localfile")}
                urlInput={input}
                setUrlInput={setInput}
                fileInput={imageFile}
                setFileInput={setImageFile}
                handleSubmit={handleSubmit}
                fileInputTypesAccepted={"image/*, video/*"}
                handleCloseSelectedFile={resetState}
                isParentLoading={isLoading}
                handleClearUrl={resetState}
              />

              {(role.includes(ROLES.AFP_C2PA_GOLD) ||
                role.includes(ROLES.EXTRA_FEATURE)) && (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={performReverseSearch}
                        onChange={togglePerformReverseSearch}
                        size="small"
                        disabled={isLoading}
                        inputProps={{
                          "aria-label": "toggle using reverse search",
                        }}
                      />
                    }
                    label={keyword("reverse_search_switch_label")}
                  />
                </FormGroup>
              )}

              {isLoading && (
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <LinearProgress />
                </Box>
              )}
            </Stack>
          </form>
        </Box>
      </Card>
      <Box
        sx={{
          m: 4,
        }}
      />
      <Stack direction="column" spacing={4}>
        {loadingProgress && (
          <Alert icon={<CircularProgress size={20} />} severity="info">
            {/*TODO: verify display for RTL languages*/}
            {`${keyword("reverse_search_loading_info")} ${loadingProgress}%`}
          </Alert>
        )}

        {errorMessage && typeof errorMessage === "string" && (
          <Alert severity="error">{errorMessage}</Alert>
        )}

        {result && (
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDownward />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>
                {keyword("submitted_image_results_title")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {result && (
                <C2paResults
                  result={result}
                  hasSimilarAfpResult={!!thumbnailImage}
                />
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {thumbnailImage && typeof thumbnailImage === "string" && (
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDownward />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>{keyword("reverse_search_results_title")}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <AfpReverseSearchResults
                thumbnailImage={thumbnailImage}
                downloadHdImage={downloadHdImage}
                hdImage={hdImage}
                thumbnailImageCaption={thumbnailImageCaption}
                hdImageC2paData={hdImageC2paData}
                imageMetadata={imageMetadata}
              />
            </AccordionDetails>
          </Accordion>
        )}

        {hdImage && (
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDownward />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                {keyword("reverse_search_results_title_hd")}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <HdImageResults
                downloadHdImage={downloadHdImage}
                hdImage={hdImage}
                hdImageC2paData={hdImageC2paData}
              />
            </AccordionDetails>
          </Accordion>
        )}

        <Box
          sx={{
            m: 4,
          }}
        />
      </Stack>
    </Box>
  );
};

export default C2paData;
