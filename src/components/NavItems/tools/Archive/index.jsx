import {
  Box,
  TextField,
  Card,
  Grid,
  Stack,
  Skeleton,
  Alert,
  Fade,
  Button,
} from "@mui/material";

import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import ArchiveTable from "./components/archiveTable";

//TODO: Matomo analyics

// Only WACZ files

function createData(archivedUrl, originalUrl) {
  return { archivedUrl, originalUrl };
}

const rows = [
  createData("https://test1.com", "https://original-test.com"),
  createData("https://test2.com", "https://original-test.com"),
  createData(
    "https://niwvknoyyiblkqhetawtuvojkngxht1e.com",
    "https://niwvknoyyiblkqhetawtuvojkngxhtue.com",
  ),
  createData(
    "https://test4.com",
    "https://niwvknoyyiblkqhetawtuvojkngxhtue.com",
  ),
  createData(
    "https://niwvknoyyiblkqhetawtuvojkngxhtue.com",
    "https://original-test.com",
  ),
];

const Archive = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");

  const [archiveLinks, setArchiveLinks] = useState([]);

  const [hasArchiveBeenCreated, setHasArchiveBeenCreated] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const isFileAWaczFile = (fileUrl) => {
    return fileUrl.split(".").pop() === "wacz";
  };

  const handleSubmit = (e) => {
    setErrorMessage("");
    setHasArchiveBeenCreated(false);
    setIsLoading(!isLoading);

    console.log(input.split(".").pop());

    if (!isFileAWaczFile(input)) {
      setErrorMessage("File error — The file is not a .wacz file");
      setIsLoading(false);
      setHasArchiveBeenCreated(false);
    } else {
      setTimeout(() => {
        setArchiveLinks(["url1", "url2"]);
        setIsLoading(false);
        setHasArchiveBeenCreated(true);
      }, 200);
    }
  };

  return (
    <div>
      <HeaderTool
        name={"Archive"}
        description={"Archive a link with Web Archive (Wayback Machine)"}
        icon={<ArchiveIcon sx={{ fill: "#00926c", width: 40, height: 40 }} />}
      />
      <Card>
        <Box p={3}>
          <form>
            <Stack spacing={4}>
              <Grid container direction="row" spacing={3} alignItems="center">
                <Grid item xs>
                  <TextField
                    disabled={isLoading}
                    id="standard-full-width"
                    label={"wacz file to archive"}
                    placeholder={"my-example-file.wacz"}
                    fullWidth
                    value={input}
                    variant="outlined"
                    onChange={(e) => setInput(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <Button startIcon={<FolderOpenIcon />}>
                    <label htmlFor="fileInputMagnifier">Select file</label>
                    <input
                      id="fileInputMagnifier"
                      type="file"
                      hidden={true}
                      onChange={(e) => {
                        setInput(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                  </Button>
                </Grid>
                <Grid item>
                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                  >
                    {"Submit"}
                  </LoadingButton>
                </Grid>
              </Grid>
              <Box>
                {errorMessage && (
                  <Box mb={4}>
                    <Fade in={errorMessage} timeout={750}>
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
                      <>
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={40} />
                      </>
                    )}
                  </>
                ) : (
                  <Box>
                    <ArchiveTable rows={rows} />
                    {/* <Typography variant="h5">Archived links</Typography> */}
                  </Box>
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
