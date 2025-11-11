import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { green } from "@mui/material/colors";

import CloseIcon from "@mui/icons-material/Close";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
// import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { TOOLS_CATEGORIES } from "@/constants/tools";
import { getFileTypeFromFileObject } from "@Shared/Utils/fileUtils";
import accept from "attr-accept";

import { prettifyLargeString } from "../tools/Archive/utils";
import { KNOWN_LINKS, selectCorrectActions } from "./AssistantRuleBook";
import AssistantMediaResult from "./AssistantScrapeResults/AssistantMediaResult";

const AssistantFileSelected = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // uploading an image/video
  const [fileInput, setFileInput] = useState(null);
  const [error, setError] = useState(false);

  const fileRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [validDrop, setValidDrop] = useState(false);
  const [disableToolList, setDisableToolList] = useState(false);

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;
  const dropColor = resolvedMode === "light" ? green[50] : green[900];

  const submitButtonKeyword = keyword("button_submit");
  const localFileKeyword = keyword("button_localfile");

  const preprocessLocalFile = "";
  const fileInputTypesAccepted = ["image/*, video/*"];
  const isParentLoading = false;

  // find tool lsit
  const getActionList = (contentType) => {
    let known_link = KNOWN_LINKS.OWN; // this is the uploaded link
    const role = useSelector((state) => state.userSession.user.roles);
    const userAuthenticated = useSelector(
      (state) => state.userSession.userAuthenticated,
    );
    return selectCorrectActions(
      contentType,
      known_link,
      known_link,
      "",
      role,
      userAuthenticated,
    );
  };

  const imageActions = getActionList(TOOLS_CATEGORIES.IMAGE);
  const videoActions = getActionList(TOOLS_CATEGORIES.VIDEO);

  const handleClick = (path, cType) => {
    //history.push("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType)
    navigate("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType);
  };

  // const resetFileSelectedState = () => {
  //   // dispatch(cleanMetadataState());
  //   // getVideoMetadata.reset();
  //   // setImageMetadata(null);
  //   setError(false);
  //   // setImageUrl(null);
  // };

  const submitUrl = async () => {
    resetState();
    setDisableToolList(true);

    try {
      if (!fileInput) {
        throw new Error("No input provided"); // Handle missing input
      }

      // Determine file type
      const fileType = await getFileTypeFromFileObject(fileInput);

      if (!fileType || fileType instanceof Error) {
        throw new Error("Unable to determine file type");
      }
      if (fileType.mime.includes("video")) {
        // set the video URL
        const video = URL.createObjectURL(fileInput);

        // TODO show recommended tools
        return <AssistantMediaResult />;
      }

      if (fileType.mime.includes("image")) {
        // Set the image URL
        const imageUrl = URL.createObjectURL(fileInput);

        // TODO show recommended tools
        return <AssistantMediaResult />;
      }

      throw new Error("Unsupported file type");
    } catch (error) {
      console.error("Error in submitUrl:", error.message);
      setError(error.message);
    }
  };

  const resetState = () => {
    // setInput("");
    setFileInput(null);
    setError(false);
    setDisableToolList(false);
  };

  const generateList = (title, cType, actionList) => {
    return (
      <>
        <Box
          sx={{
            mx: 2,
            my: 0.5,
          }}
        >
          <Typography
            variant={"h6"}
            style={{ fontWeight: "bold" }}
            sx={{
              textAlign: "start",
            }}
          >
            {title}
          </Typography>
        </Box>
        <List>
          {actionList.map((action, index) => {
            return (
              <Box
                key={index}
                sx={{
                  m: 2,
                }}
              >
                <Card className={classes.assistantHover} variant="outlined">
                  <ListItem
                    onClick={() => {
                      handleClick(action.path, cType);
                    }}
                  >
                    <ListItemAvatar>{action.icon}</ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          component={"span"}
                          sx={{
                            textAlign: "start",
                          }}
                        >
                          <Box
                            sx={{
                              fontWeight: "fontWeightBold",
                            }}
                          >
                            {keyword(action.title)}
                          </Box>
                        </Typography>
                      }
                      secondary={
                        <Typography
                          color={"textSecondary"}
                          component={"span"}
                          sx={{
                            textAlign: "start",
                          }}
                        >
                          <Box
                            sx={{
                              fontStyle: "italic",
                            }}
                          >
                            {keyword(action.text)}
                          </Box>
                        </Typography>
                      }
                    />
                  </ListItem>
                </Card>
              </Box>
            );
          })}
        </List>
      </>
    );
  };

  /**
   *
   * @param e {DragEvent}
   */
  const onDragOver = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    setIsDragging(true);

    if (file && accept(file, fileInputTypesAccepted)) {
      setValidDrop(true);
    } else {
      setValidDrop(false);
    }
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFile = async (file) => {
    if (preprocessLocalFile) {
      file = await preprocessLocalFile(file);
    }
    setFileInput(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setValidDrop(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && accept(file, fileInputTypesAccepted)) {
      handleFile(file);
    }
  };

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
              {keyword("assistant_upload")}
            </Typography>
          }
        />
        <CardContent>
          <form>
            <Box
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              sx={{
                position: "relative",
              }}
            >
              {isDragging && (
                <Stack
                  sx={{
                    height: "100%",
                    border: "4px dashed var(--mui-palette-primary-main)",
                    backgroundColor: dropColor,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <Typography>{keyword("droppable_zone")}</Typography>
                </Stack>
              )}
              <Box
                sx={{
                  visibility: isDragging ? "hidden" : "visible",
                }}
              >
                <Grid
                  container
                  direction="row"
                  spacing={3}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Grid
                    sx={{
                      mt: 2,
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      // disabled={isParentLoading || urlInput !== ""}
                    >
                      <Button
                        startIcon={<FolderOpenIcon />}
                        style={
                          isDragging
                            ? { cursor: validDrop ? "copy" : "no-drop" }
                            : undefined
                        }
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                      >
                        <label htmlFor="file">
                          {fileInput
                            ? prettifyLargeString(fileInput.name, 24)
                            : localFileKeyword}
                        </label>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          accept={fileInputTypesAccepted}
                          hidden={true}
                          ref={fileRef}
                          onChange={(e) => {
                            e.preventDefault();
                            handleFile(e.target.files[0]);
                            e.target.value = null;
                          }}
                        />
                      </Button>
                      {fileInput instanceof Blob && (
                        <Button
                          size="small"
                          aria-label="remove selected file"
                          onClick={(e) => {
                            e.preventDefault();
                            resetState();
                            fileRef.current.value = null;
                            setFileInput(null);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </Button>
                      )}
                    </ButtonGroup>
                  </Grid>
                  <Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={async (e) => {
                        e.preventDefault();
                        await submitUrl(e);
                      }}
                      loading={isParentLoading}
                      // disabled={(urlInput === "" && !fileInput) || isParentLoading}
                    >
                      {submitButtonKeyword}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            {/* <Box
            sx={{
              p: 4,
              textAlign: "left",
            }}
          >
            <StringFileUploadField
              labelKeyword={keyword("metadata_content_input")}
              placeholderKeyword={keyword("metadata_content_input_placeholder")}
              submitButtonKeyword={keyword("button_submit")}
              localFileKeyword={keyword("button_localfile")}
              //urlInput={input}
              //setUrlInput={setInput}
              fileInput={fileInput}
              setFileInput={setFileInput}
              handleSubmit={submitUrl}
              fileInputTypesAccepted={"image/*, video/*"}
              handleCloseSelectedFile={resetState}
              handleClearUrl={resetState}
            />
          </Box> */}
          </form>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ mt: 4 }} disabled={disableToolList}>
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
              {keyword("assistant_choose_tool")}
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 6 }}>
              {generateList(
                keyword("upload_image"),
                TOOLS_CATEGORIES.IMAGE,
                imageActions,
              )}
            </Grid>
            <Grid size={{ xs: 6 }}>
              {generateList(
                keyword("upload_video"),
                TOOLS_CATEGORIES.VIDEO,
                videoActions,
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
export default AssistantFileSelected;
