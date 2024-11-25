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
import { archiving } from "../../../../constants/tools"; //TODO:UI for long strings

//TODO:UI for long strings

const Archive = () => {
  const { url } = useParams();

  const dispatch = useDispatch();
  const mainUrl = useSelector((state) => state.archive.mainUrl);
  const [urlInput, setUrlInput] = useState("");
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

      //console.log(data);

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
      setErrorMessage(
        "Upload error — An error happened with the file upload. Try with another file.",
      );
      setIsLoading(false);
      setHasArchiveBeenCreated(false);
      setInput("");
      setArchiveLinks([]);
      return;
    }

    if (!result) {
      setErrorMessage(
        "Upload error — An error happened wit the upload of the file. Try again or with another file.",
      );
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
      setErrorMessage(
        "Upload error — An error happened wit the upload of the file. Try again or with another file.",
      );
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

    setIsLoading(true);

    if (urlInput) {
      handleSubmitUrl();
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
        description={"Archive a .wacz file with Web Archive (Wayback Machine)"}
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
              Archivable links
            </Typography>
            <UrlArchive url={urlInput}></UrlArchive>
          </CardContent>
        </Card>
      ) : null}

      {hasArchiveBeenCreated && archiveLinks.length > 0 && (
        <Card variant="outlined">
          <Typography>{keyword("archive_wacz_accordion")}</Typography>
          <Box p={3}>
            <form>
              <Stack spacing={4}>
                <Box>
                  {hasArchiveBeenCreated && (
                    <Box mb={4}>
                      <Fade in={hasArchiveBeenCreated} timeout={750}>
                        <Alert severity="success">
                          The archive was created successfully!
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
                              Loading... This can take up to a few minutes
                            </Alert>
                            <Box>
                              <Skeleton variant="text" height={100} />
                              {/*<Skeleton variant="text" height={40} />*/}
                            </Box>
                          </Box>
                        </Fade>
                      )}
                    </>
                  ) : (
                    <Fade in={!isLoading} timeout={1000}>
                      <Box>
                        <ArchiveTable
                          rows={archiveLinks}
                          fileName={fileToUpload.name}
                        />
                      </Box>
                    </Fade>
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
