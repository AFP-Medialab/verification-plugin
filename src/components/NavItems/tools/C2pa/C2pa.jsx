import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardHeader,
  FormControlLabel,
  FormGroup,
  Grid2,
  LinearProgress,
  Stack,
  Switch,
} from "@mui/material";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import C2paResults from "./Results/C2paResults";
import {
  c2paLoadingSet,
  resetC2paState,
  setAfpHdImage,
  setC2paThumbnail,
  setC2paThumbnailCaption,
  setHdImageC2paData,
} from "redux/reducers/tools/c2paReducer";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useAuthenticatedRequest from "../../../Shared/Authentication/useAuthenticatedRequest";
import CircularProgress from "@mui/material/CircularProgress";
import getC2paData, { getC2paDataHd } from "./Hooks/useGetC2paData";
import exifr from "exifr";
import { ArrowDownward } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";
import { ROLES } from "../../../../constants/roles";
import AfpReverseSearchResults from "./components/AfpReverseSearchResults";

const C2paData = () => {
  const role = useSelector((state) => state.userSession.user.roles);

  const isLoading = useSelector((state) => state.c2pa.loading);
  const result = useSelector((state) => state.c2pa.result);

  const thumbnailImage = useSelector((state) => state.c2pa.thumbnail);

  const thumbnailImageCaption = useSelector(
    (state) => state.c2pa.thumbnailCaption,
  );

  const hdImage = useSelector((state) => state.c2pa.afpHdImage);

  const hdImageC2paData = useSelector((state) => state.c2pa.hdImageC2paData);

  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(undefined);

  const dispatch = useDispatch();

  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const [errorMessage, setErrorMessage] = useState(null);

  const [loadingProgress, setLoadingProgress] = useState(null);

  const [performReverseSearch, setPerformReverseSearch] = useState(false);

  const authenticatedRequest = useAuthenticatedRequest();

  const getAfpReverseSearch = async () => {
    // Creates a random request id
    const requestId = uuidv4();

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
        "X-AFP-TRANSACTION-ID": requestId,
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
      setErrorMessage(keyword("error_message_reverse_search_generic"));
      return;
    }

    if (res.data.progress) setLoadingProgress(res.data.progress);

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
        await sleep(2000);

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
        url: `https://plugin-archiving.afp.com/gateway/c2paafp/${urls.thumbnailUrl}`,
      };

      const blob = (await authenticatedRequest(thumbnailImageConfig)).data;

      const imageUrl = URL.createObjectURL(blob);

      const metadata = await exifr.parse(blob, true);

      if (metadata["Caption"])
        dispatch(setC2paThumbnailCaption(metadata["Caption"]));

      dispatch(setC2paThumbnail(imageUrl));
    }

    if (urls.hdUrl && !role.includes(ROLES.AFP_C2PA_2)) {
      const hdImageConfig = {
        method: "get",
        responseType: "blob",
        maxBodyLength: Infinity,
        url: `${serverUrl}/${urls.hdUrl}`,
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

  const handleClose = () => {
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
      <Card>
        <CardHeader
          title={
            <Grid2
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("image_link")}</span>
            </Grid2>
          }
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
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
                handleCloseSelectedFile={handleClose}
                isParentLoading={isLoading}
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
                <Box mt={3}>
                  <LinearProgress />
                </Box>
              )}
            </Stack>
          </form>
        </Box>

        {/*<Box m={2} />*/}
      </Card>

      <Box m={3} />
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
              />
            </AccordionDetails>
          </Accordion>
        )}
        <Box m={3} />
      </Stack>
    </Box>
  );
};

export default C2paData;
