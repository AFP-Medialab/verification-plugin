import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Fade,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import ArchiveTable from "./components/archiveTable";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useAuthenticatedRequest from "../../../Shared/Authentication/useAuthenticatedRequest";
import { useParams } from "react-router-dom";
import UrlArchive from "./components/urlArchive";
import {
  archiveStateCleaned,
  setArchiveUrl,
} from "redux/reducers/tools/archiveReducer";
import { useDispatch, useSelector } from "react-redux";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import { archiving } from "../../../../constants/tools";
import {
  KNOWN_LINK_PATTERNS,
  KNOWN_LINKS,
  matchPattern,
} from "../../Assistant/AssistantRuleBook";
import assistantApiCalls from "../../Assistant/AssistantApiHandlers/useAssistantApi"; //TODO:UI for long strings

//TODO:UI for long strings

const Archive = () => {
  const { url } = useParams();

  const dispatch = useDispatch();
  const mainUrl = useSelector((state) => state.archive.mainUrl);

  const [urlInput, setUrlInput] = useState("");

  const [mediaUrl, setMediaUrl] = useState("");

  const [urlResults, setUrlResults] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");

  const [fileToUpload, setFileToUpload] = useState(/** @type {File?} */ null);

  const [archiveLinks, setArchiveLinks] = useState([]);

  const [hasArchiveBeenCreated, setHasArchiveBeenCreated] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const authenticatedRequest = useAuthenticatedRequest();

  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  useEffect(() => {
    if (mainUrl) {
      setUrlResults(true);
      setUrlInput(mainUrl);
    } else if (url && url !== "") {
      setUrlResults(true);
      setUrlInput(url);
      setArchiveUrl(url);
    }
  }, []);

  const handleCloseUrl = () => {
    setFileToUpload(null);
    setUrlResults(false);
    setErrorMessage("");
    dispatch(archiveStateCleaned());
    setUrlInput("");
    setHasArchiveBeenCreated(false);
    setArchiveLinks(null);
  };

  const handleSubmitUrl = () => {
    setArchiveUrl(urlInput);
    setUrlResults(true);
    dispatch(setArchiveUrl(urlInput));
  };

  const isFileAWaczFile = (fileName) => {
    return fileName.split(".").pop() === "wacz";
  };

  const fetchArchivedUrls = async (waczFileUrl) => {
    const fetchUrl = process.env.ARCHIVE_BACKEND;

    if (!waczFileUrl) {
      throw new Error("[fetchArchivedUrls] Error: waczFileUrl is not defined");
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
      throw new Error(error);
    }
  };

  const handleSubmitFile = async () => {
    if (!fileToUpload || !isFileAWaczFile(fileToUpload.name)) {
      setErrorMessage("File error — The file is not a .wacz file");
      setIsLoading(false);
      setHasArchiveBeenCreated(false);
      return;
    }

    let result;

    try {
      result = await fetchArchivedUrls(fileToUpload);
    } catch (error) {
      setErrorMessage(keyword("upload_error"));
      setIsLoading(false);
      setHasArchiveBeenCreated(false);
      setInput("");
      setArchiveLinks([]);
      return;
    }

    if (!result) {
      setErrorMessage(keyword("upload_error"));
      setIsLoading(false);
      setHasArchiveBeenCreated(false);
      return;
    }

    let results = [];

    for (const page of Object.keys(result.data.pages)) {
      let archivedUrl = result.data.pages[page].capture_url;
      let originalUrl = result.data.pages[page].url;

      results.push({ archivedUrl, originalUrl });
    }

    if (results.length === 0) {
      setErrorMessage(keyword("upload_error"));
      setIsLoading(false);
      setHasArchiveBeenCreated(false);
      return;
    }

    setArchiveLinks(results);
  };

  const handleSubmit = async () => {
    // Reset states
    setErrorMessage("");
    setArchiveLinks([]);
    setHasArchiveBeenCreated(false);
    setMediaUrl("");
    setIsLoading(true);

    if (urlInput) {
      handleSubmitUrl();
      const urlType = matchPattern(urlInput, KNOWN_LINK_PATTERNS);

      if (urlType === KNOWN_LINKS.TWITTER) {
        const res = await assistantApiCalls().callAssistantScraper(
          urlType,
          urlInput,
        );

        let mediaUrl;

        if (res.images && res.images.length > 0) {
          mediaUrl = res.images[0];
        } else if (res.videos && res.videos.length > 0) {
          mediaUrl = res.videos[0];
        }

        if (mediaUrl && typeof mediaUrl === "string") setMediaUrl(mediaUrl);
      }
    } else {
      await handleSubmitFile();
      setHasArchiveBeenCreated(true);
      setInput("");
    }

    setIsLoading(false);
  };

  return (
    <Box>
      <HeaderTool
        name={keyword("archive_name")}
        description={keyword("archive_description")}
        icon={
          // <
          <archiving.icon
            style={{
              fontSize: "40px",
              fill: "#00926c",
            }}
          />
        }
      />
      <Card variant="outlined">
        <Box p={3}>
          <form>
            <StringFileUploadField
              labelKeyword={"Archive an url"}
              placeholderKeyword={"Url to archive"}
              submitButtonKeyword={keyword("submit_button")}
              localFileKeyword={keyword("archive_wacz_accordion")}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              fileInput={fileToUpload}
              setFileInput={setFileToUpload}
              handleSubmit={handleSubmit}
              fileInputTypesAccepted={".wacz"}
              handleCloseSelectedFile={handleCloseUrl}
              preprocessLocalFile={null}
              isParentLoading={isLoading}
            />
          </form>
        </Box>
      </Card>
      <Box p={2} />
      {errorMessage && (
        <Box mb={4}>
          <Fade in={!!errorMessage} timeout={750}>
            <Alert severity="error">{errorMessage}</Alert>
          </Fade>
        </Box>
      )}

      {isLoading && fileToUpload && (
        <Fade in={isLoading} timeout={750}>
          <Stack direction="column" spacing={4}>
            <Alert severity="info">
              Loading... This can take up to a few minutes
            </Alert>
            <Skeleton variant="text" height={200} />
          </Stack>
        </Fade>
      )}

      {urlResults && urlInput !== "" ? (
        <Card variant="outlined" m={2}>
          <CardContent>
            <Typography variant="h6" component="div" pb={2}>
              {keyword("links_card_title")}
            </Typography>
            <UrlArchive url={urlInput} mediaUrl={mediaUrl}></UrlArchive>
          </CardContent>
        </Card>
      ) : null}

      {hasArchiveBeenCreated && archiveLinks.length > 0 && (
        <Card variant="outlined">
          <Box p={3}>
            <form>
              <Stack spacing={4}>
                <Box>
                  {hasArchiveBeenCreated && (
                    <Box mb={4}>
                      <Fade in={hasArchiveBeenCreated} timeout={750}>
                        <Alert severity="success">
                          {keyword("upload_success")}
                        </Alert>
                      </Fade>
                    </Box>
                  )}
                  {isLoading || archiveLinks.length === 0 ? (
                    <>
                      {isLoading && (
                        <Fade in={isLoading} timeout={750}>
                          <Box>
                            <Alert severity="info">
                              {keyword("upload_loading")}
                            </Alert>
                            <Box>
                              <Skeleton variant="text" height={100} />
                            </Box>
                          </Box>
                        </Fade>
                      )}
                    </>
                  ) : (
                    <>
                      {fileToUpload && fileToUpload.name && (
                        <Fade in={!isLoading} timeout={1000}>
                          <Box>
                            <ArchiveTable
                              rows={archiveLinks}
                              fileName={fileToUpload.name}
                            />
                          </Box>
                        </Fade>
                      )}
                    </>
                  )}
                </Box>
              </Stack>
            </form>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default Archive;
