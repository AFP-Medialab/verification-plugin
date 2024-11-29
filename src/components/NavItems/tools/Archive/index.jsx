import React, { useEffect, useState } from "react";

import { Alert, Box, Card, Fade, Skeleton, Stack } from "@mui/material";
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
import assistantApiCalls from "../../Assistant/AssistantApiHandlers/useAssistantApi";
import { QueryClient, useMutation } from "@tanstack/react-query";
import ArchivedFileCard from "./components/archivedFileCard";
import CircularProgress from "@mui/material/CircularProgress"; //TODO:UI for long strings

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
          queryKey: ["extracted_media_link"],
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
      throw new Error(keyword("file_error"));
    }

    let result;

    try {
      result = await fetchArchivedUrls(fileToUpload);
    } catch (error) {
      // User friendly Errors
      throw new Error(keyword("upload_error"));
    }

    if (!result) throw new Error(keyword("upload_error"));

    let results = [];

    for (const page of Object.keys(result.data.pages)) {
      let archivedUrl = result.data.pages[page].capture_url;
      let originalUrl = result.data.pages[page].url;
      results.push({ archivedUrl, originalUrl });
    }

    if (results.length === 0) {
      throw new Error(keyword("upload_error"));
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

    if (urlInput || url) {
      const urlToFetch = url && urlInput && urlInput !== url ? urlInput : url;

      await fetchMediaLinkForSocialMediaPost(urlToFetch);
    } else {
      await archiveFileToWbm.mutate();
    }

    setIsLoading(false);
  };

  return (
    <Box>
      <HeaderTool
        name={keyword("archive_name")}
        description={keyword("archive_description")}
        icon={
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
              isParentLoading={isLoading || archiveFileToWbm.isPending}
            />
          </form>
        </Box>
      </Card>
      <Box p={2} />

      {archiveFileToWbm.isError && (
        <Box mb={4}>
          <Fade in={true} timeout={750}>
            <Alert severity="error">{archiveFileToWbm.error.message}</Alert>
          </Fade>
        </Box>
      )}

      {errorMessage && (
        <Box mb={4}>
          <Fade in={true} timeout={750}>
            <Alert severity="error">{keyword(errorMessage)}</Alert>
          </Fade>
        </Box>
      )}

      {archiveFileToWbm.isPending && (
        <Fade in={true} timeout={750}>
          <Stack direction="column" spacing={2}>
            <Alert icon={<CircularProgress size={20} />} severity="info">
              {keyword("upload_loading")}
            </Alert>
            <Skeleton variant="text" height={200} />
          </Stack>
        </Fade>
      )}

      {archiveFileToWbm.isSuccess && (
        <ArchivedFileCard file={fileToUpload} archiveLinks={archiveLinks} />
      )}

      {urlResults && urlInput !== "" ? (
        <UrlArchive url={urlInput} mediaUrl={mediaUrl}></UrlArchive>
      ) : null}
    </Box>
  );
};

export default Archive;
