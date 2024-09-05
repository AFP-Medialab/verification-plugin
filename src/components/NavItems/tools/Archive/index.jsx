import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Fade,
  Grid2,
  Skeleton,
  Stack,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import ArchiveTable from "./components/archiveTable";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useAuthenticatedRequest from "../../../Shared/Authentication/useAuthenticatedRequest";
import { prettifyLargeString } from "./utils";
// import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
// import { useSelector } from "react-redux";
// import { useTrackEvent } from "Hooks/useAnalytics";

//TODO:UI for long strings

const Archive = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");

  const [fileToUpload, setFileToUpload] = useState(/** @type {File?} */ (null));

  const [archiveLinks, setArchiveLinks] = useState([]);

  const [hasArchiveBeenCreated, setHasArchiveBeenCreated] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const authenticatedRequest = useAuthenticatedRequest();

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

      const response = await authenticatedRequest(axiosConfig);

      //console.log(response);

      return response;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  const handleSubmit = async () => {
    // Reset states
    setErrorMessage("");
    setHasArchiveBeenCreated(false);

    setIsLoading(true);

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
    setIsLoading(false);
    setHasArchiveBeenCreated(true);
    setInput("");
    return;
  };

  return (
    <div>
      <HeaderTool
        name={"Archiving"}
        description={"Archive a .wacz file with Web Archive (Wayback Machine)"}
        icon={<ArchiveIcon sx={{ fill: "#00926c", width: 40, height: 40 }} />}
      />
      <Card>
        <Box p={3}>
          <form>
            <Stack spacing={4}>
              <Grid2 container direction="row" spacing={3} alignItems="start">
                {/* <Grid2  >
                  <TextField
                    disabled={isLoading}
                    id="standard-full-width"
                    label={".wacz file to archive"}
                    placeholder={"my-example-file.wacz"}
                    fullWidth
                    value={input}
                    variant="outlined"
                    onChange={(e) => setInput(e.target.value)}
                  />
                </Grid2> */}

                <Grid2>
                  <Stack
                    direction="column"
                    spacing={2}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Button variant="outlined" startIcon={<FolderOpenIcon />}>
                      <label htmlFor="fileInputMagnifier">
                        {input !== "" ? input : "Select a .wacz file"}
                      </label>
                      <input
                        id="fileInputMagnifier"
                        type="file"
                        hidden={true}
                        onChange={(e) => {
                          setInput(prettifyLargeString(e.target.files[0].name));
                          setFileToUpload(e.target.files[0]);
                        }}
                      />
                    </Button>
                    <LoadingButton
                      loading={isLoading}
                      disabled={!input}
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      {"Archive File"}
                    </LoadingButton>
                  </Stack>
                </Grid2>
              </Grid2>
              <Box>
                {errorMessage && (
                  <Box mb={4}>
                    <Fade in={errorMessage ? true : false} timeout={750}>
                      <Alert severity="error">{errorMessage}</Alert>
                    </Fade>
                  </Box>
                )}

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
                            <Skeleton variant="text" height={40} />
                            <Skeleton variant="text" height={40} />
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
    </div>
  );
};

export default Archive;
