import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { TabContext, TabList } from "@mui/lab";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { imageGif } from "../../../../constants/tools";
import {
  setStateInit,
  setStateReady,
  setStateSelectingLocal,
  setStateSelectingUrl,
} from "../../../../redux/reducers/tools/gifReducer";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import AnimatedGif from "./AnimatedGif";
import DragAndDrop from "./DragAndDrop";
import useGetHomographics from "./Hooks/useGetHomographics";

const CheckGif = () => {
  //Init variables
  //============================================================================================
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/CheckGIF");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const toolState = useSelector((state) => state.gif.toolState);
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;
  const client_id = getclientId();

  const dispatch = useDispatch();

  //Selecting mode
  //============================================================================================

  const [classButtonURL, setClassButtonURL] = useState(classes.bigButtonDiv);
  const [classButtonLocal, setClassButtonLocal] = useState(
    classes.bigButtonDiv,
  );

  const [selectedMode, setSelectedMode] = useState("URL");

  // Initialize to URL on first render
  useEffect(() => {
    dispatch(setStateSelectingUrl());
  }, []);

  if (
    toolState === 1 &&
    classButtonURL !== classes.bigButtonDiv &&
    classButtonLocal !== classes.bigButtonDiv
  ) {
    setClassButtonURL(classes.bigButtonDiv);
    setClassButtonLocal(classes.bigButtonDiv);
  }

  function clickURL() {
    changeStylesToUrl();
    dispatch(setStateSelectingUrl());
    setSelectedMode("URL");
    cleanInputs();
  }

  function clickLocal() {
    changeStylesToLocal();
    dispatch(setStateSelectingLocal());
    setSelectedMode("LOCAL");
    cleanInputs();
  }

  const handleTabSelectedChange = (event, newValue) => {
    if (newValue === "URL") {
      clickURL();
    } else clickLocal();
  };

  function changeStylesToLocal() {
    //Change styles of the local button to selected
    setClassButtonLocal(classes.bigButtonDivSelected);

    //Change styles of the URL button to not selected
    setClassButtonURL(classes.bigButtonDiv);
  }

  function changeStylesToUrl() {
    //Change styles of the url button to selected
    setClassButtonURL(classes.bigButtonDivSelected);

    //Change styles of the Local button to not selected
    setClassButtonLocal(classes.bigButtonDiv);
  }

  //Load images for the GIF
  //============================================================================================

  //1=Images | 2=URL
  const [modeHomo, setModeHomo] = useState(0);

  const [imageDropped1, setImageDropped1] = useState(null);
  const [showDropZone1, setShowDropZone1] = useState(true);

  const [imageDropped2, setImageDropped2] = useState(null);
  const [showDropZone2, setShowDropZone2] = useState(true);

  const [selectedFile1, setSelectedFile1] = useState(undefined);
  const [selectedFile2, setSelectedFile2] = useState(undefined);
  const [filesToSend, setFilesToSend] = useState(undefined);

  //--- Local files mode ---

  //FIRST IMAGE

  //Load by drop
  const handleDrop = (files) => {
    //console.log(files);//DEBUG
    const urlFile = URL.createObjectURL(files[0]);
    setImageDropped1(urlFile);
    setSelectedFile1(files[0]);
    setShowDropZone1(false);
  };

  //Load by Click
  const handleInput = (event) => {
    //console.log(event);//DEBUG
    const urlFile = URL.createObjectURL(event.target.files[0]);
    setImageDropped1(urlFile);
    setSelectedFile1(event.target.files[0]);
    setShowDropZone1(false);
  };

  //SECOND IMAGE

  //Load by drop
  const handleDrop2 = (files) => {
    //console.log(files);//DEBUG
    const urlFile = URL.createObjectURL(files[0]);
    setImageDropped2(urlFile);
    setSelectedFile2(files[0]);
    setShowDropZone2(false);
  };

  //Load by clikc
  const handleInput2 = (event) => {
    //console.log(event);//DEBUG
    const urlFile = URL.createObjectURL(event.target.files[0]);
    setImageDropped2(urlFile);
    setSelectedFile2(event.target.files[0]);
    setShowDropZone2(false);
  };

  //Remove image1
  const removeImage1 = () => {
    setImageDropped1(null);
    setSelectedFile1(null);
    setShowDropZone1(true);
  };

  //Remove image1
  const removeImage2 = () => {
    setImageDropped2(null);
    setSelectedFile2(null);
    setShowDropZone2(true);
  };

  //--- URL mode ---

  //URL
  const [imageURL1, setImageURL1] = useState(undefined);
  const [imageURL2, setImageURL2] = useState(undefined);

  //Code to enable the button to upload the images
  /* if (toolState === 22 && imageURL1 !== "" && imageURL2 !== "") {
                                                                                        //console.log("Ready to send"); //DEBUG
                                                                                        dispatch(setStateReady());
                                                                                    }*/

  //Code to enable the button to upload the images
  /* if (toolState === 21 && imageDropped1 !== null && imageDropped2 !== null) {
                                                                                        //console.log("Ready to send"); //DEBUG
                                                                                        dispatch(setStateReady());
                                                                                    }*/

  useEffect(() => {
    if (toolState === 22 && imageURL1 !== "" && imageURL2 !== "") {
      //console.log("Ready to send"); //DEBUG
      dispatch(setStateReady());
    }
    if (toolState === 21 && imageDropped1 !== null && imageDropped2 !== null) {
      //console.log("Ready to send"); //DEBUG
      dispatch(setStateReady());
    }

    if (toolState === 6) {
      console.log("error");
      cleanInputs();
      if (selectedMode === "URL") {
        dispatch(setStateSelectingUrl());
      } else if (selectedMode === "LOCAL") {
        dispatch(setStateSelectingLocal());
      }
    }
  }, [toolState, imageDropped1, imageDropped2, imageURL1, imageURL2]);

  const [eventUrl1, setEventUrl1] = useState(undefined);
  const [eventUrl2, setEventUrl2] = useState(undefined);
  const [eventUrlType1, setEventUrlType1] = useState(undefined);
  const [eventUrlType2, setEventUrlType2] = useState(undefined);
  //Function to prepare the files to trigger the submission
  useTrackEvent(
    "submission",
    "checkgif",
    eventUrlType1,
    eventUrl1,
    client_id,
    eventUrl1,
    uid,
  );
  useTrackEvent(
    "submission",
    "checkgif",
    eventUrlType2,
    eventUrl2,
    client_id,
    eventUrl1,
    uid,
  );
  const handleSubmissionURL = () => {
    setEventUrl1(imageURL1);
    setEventUrlType1("url fake image");
    setEventUrl2(imageURL2);
    setEventUrlType2("url original image");
    /*trackEvent(
                                                                                                                                                                      "submission",
                                                                                                                                                                      "checkgif",
                                                                                                                                                                      "url fake image",
                                                                                                                                                                      imageURL1,
                                                                                                                                                                      client_id,
                                                                                                                                                                      uid
                                                                                                                                                                    );
                                                                                                                                                                    trackEvent(
                                                                                                                                                                      "submission",
                                                                                                                                                                      "checkgif",
                                                                                                                                                                      "url original image",
                                                                                                                                                                      imageURL2,
                                                                                                                                                                      client_id,
                                                                                                                                                                      uid
                                                                                                                                                                    );*/
    /*submissionEvent(imageURL1);
                                                                                                                                                                        submissionEvent(imageURL2);*/
    const files = {
      url_0: imageURL1,
      url_1: imageURL2,
    };
    setModeHomo(2);
    setFilesToSend(files);
  };

  const handleSubmission = () => {
    setEventUrl1(selectedFile1);
    setEventUrlType1("file fake image");
    setEventUrl2(selectedFile2);
    setEventUrlType2("file original image");
    /* trackEvent(
                                                                                                                                                                      "submission",
                                                                                                                                                                      "checkgif",
                                                                                                                                                                      "file fake image",
                                                                                                                                                                      selectedFile1,
                                                                                                                                                                      client_id,
                                                                                                                                                                      uid
                                                                                                                                                                    );
                                                                                                                                                                    trackEvent(
                                                                                                                                                                      "submission",
                                                                                                                                                                      "checkgif",
                                                                                                                                                                      "file original image",
                                                                                                                                                                      selectedFile2,
                                                                                                                                                                      client_id,
                                                                                                                                                                      uid
                                                                                                                                                                    );*/
    /*submissionEvent(selectedFile1);
                                                                                                                                                                        submissionEvent(selectedFile2);*/
    const files = {
      file1: selectedFile1,
      file2: selectedFile2,
    };
    setModeHomo(1);
    setFilesToSend(files);
  };

  //Call to the API
  useGetHomographics(filesToSend, modeHomo, keyword);

  //GIF preview
  //============================================================================================

  const homoImg1 = useSelector((state) => state.gif.homoImg1);
  const homoImg2 = useSelector((state) => state.gif.homoImg2);

  //Reset states
  //============================================================================================

  const newGif = () => {
    //stopLoop();
    cleanInputs();

    setClassButtonURL(classes.bigButtonDiv);

    setClassButtonLocal(classes.bigButtonDiv);

    dispatch(setStateInit());

    selectedMode === "URL"
      ? dispatch(setStateSelectingUrl())
      : dispatch(setStateSelectingLocal());
  };

  function cleanInputs() {
    setImageDropped1(null);
    setSelectedFile1(null);
    setShowDropZone1(true);

    setImageDropped2(null);
    setSelectedFile2(null);
    setShowDropZone2(true);

    setImageURL1("");
    setImageURL2("");

    setFilesToSend(null);
    setModeHomo(0);

    //setFilesForGif(null);
    //setDelayGif(null);
  }

  useEffect(() => {
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      newGif();
    };
    // eslint-disable-next-line
  }, []);

  //HTML Code
  //============================================================================================

  return (
    <Box sx={{ minWidth: "400px" }}>
      {
        //=== Title ===
      }

      <HeaderTool
        name={keywordAllTools("navbar_gif")}
        description={keywordAllTools("navbar_gif_description")}
        icon={<imageGif.icon sx={{ fill: "#00926c", fontSize: "40px" }} />}
      />

      {
        //=== Load of the images ===
      }

      {/*TODO: use a better switch*/}
      <TabContext value={selectedMode}>
        <Box>
          <TabList
            onChange={handleTabSelectedChange}
            aria-label="lab API tabs example"
          >
            <Tab
              icon={<LinkIcon />}
              iconPosition="start"
              label={keyword("title_URL")}
              value="URL"
              sx={{ minWidth: "inherit !important", textTransform: "none" }}
            />
            <Tab
              icon={<UploadFileIcon />}
              iconPosition="start"
              label={keyword("title_local")}
              value="LOCAL"
              sx={{ minWidth: "inherit", textTransform: "none" }}
            />
          </TabList>
          <Divider />
        </Box>
      </TabContext>

      <Box m={3} />

      {toolState >= 2 && (
        <Card variant="outlined">
          <CardHeader
            title={
              <Grid2
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <span>{keyword("title_gifcreation")}</span>

                <Button variant="contained" onClick={newGif}>
                  {keyword("button_new")}
                </Button>
              </Grid2>
            }
            className={classes.headerUploadedImage}
          />

          <Box p={3}>
            <Grid2
              container
              direction={{ md: "row", xs: "column" }}
              spacing={3}
            >
              <Grid2
                size={{ md: 5, xs: 12 }}
                style={{ padding: "0.5em" }}
                sx={{
                  borderRight: { md: "0.1em solid #ECECEC", xs: "none" },
                  borderBottom: { xs: "0.1em solid #ECECEC", md: "none" },
                }}
              >
                <Box p={2}>
                  {selectedMode === "LOCAL" && (
                    <div>
                      <Typography variant="h6" className={classes.headingGif}>
                        {keyword("title_image1")}
                      </Typography>

                      <Box m={2} />

                      {!showDropZone1 && (
                        <Grid2
                          container
                          spacing={1}
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <img
                            src={imageDropped1}
                            className={classes.imageDropped}
                            alt=""
                          />
                          <IconButton onClick={removeImage1}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Grid2>
                      )}

                      {showDropZone1 && (
                        <DragAndDrop handleDrop={(files) => handleDrop(files)}>
                          <Grid2
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            className={classes.dropZone}
                          >
                            <Grid2 className={classes.inputContainer}>
                              <input
                                accept="image/*"
                                className={classes.input}
                                style={{ display: "none" }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={(e) => handleInput(e)}
                              />
                              <div>
                                <Box textAlign="center">
                                  <label
                                    htmlFor="raised-button-file"
                                    className={classes.inputLabel}
                                  >
                                    <span>{keyword("body_droparea")}</span>
                                  </label>
                                </Box>
                              </div>
                            </Grid2>
                          </Grid2>
                        </DragAndDrop>
                      )}

                      <Box m={4} />

                      <Typography variant="h6" className={classes.headingGif}>
                        {keyword("title_image2")}
                      </Typography>

                      <Box m={2} />

                      {!showDropZone2 && (
                        <Grid2
                          container
                          spacing={1}
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <img
                            src={imageDropped2}
                            className={classes.imageDropped}
                            alt=""
                          />
                          <IconButton onClick={removeImage2}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Grid2>
                      )}

                      {showDropZone2 && (
                        <DragAndDrop handleDrop={(files) => handleDrop2(files)}>
                          <Grid2
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            className={classes.dropZone}
                          >
                            <Grid2 className={classes.inputContainer}>
                              <input
                                accept="image/*"
                                className={classes.input}
                                style={{ display: "none" }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={(e) => handleInput2(e)}
                              />
                              <div>
                                <Box p={2} textAlign="center">
                                  <label
                                    htmlFor="raised-button-file"
                                    className={classes.inputLabel}
                                  >
                                    <span>{keyword("body_droparea")}</span>
                                  </label>
                                </Box>
                              </div>
                            </Grid2>
                          </Grid2>
                        </DragAndDrop>
                      )}

                      <Box m={4} />

                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmission}
                        disabled={toolState !== 3}
                      >
                        {keyword("button_loadImages")}
                      </Button>
                    </div>
                  )}

                  {selectedMode === "URL" && (
                    <div>
                      <Typography variant="h6" className={classes.headingGif}>
                        {keyword("title_image1")}
                      </Typography>

                      <Box m={2} />

                      <TextField
                        id="outlined-multiline-static"
                        label={keyword("input_label1")}
                        placeholder={keyword("input_placeholder")}
                        multiline
                        rows={8}
                        fullWidth
                        variant="outlined"
                        onChange={(e) => {
                          setImageURL1(e.target.value);
                        }}
                      />

                      <Box m={4} />

                      <Typography variant="h6" className={classes.headingGif}>
                        {keyword("title_image2")}
                      </Typography>

                      <Box m={2} />

                      <TextField
                        id="outlined-multiline-static"
                        label={keyword("input_label2")}
                        placeholder={keyword("input_placeholder")}
                        multiline
                        rows={8}
                        fullWidth
                        variant="outlined"
                        onChange={(e) => {
                          setImageURL2(e.target.value);
                        }}
                      />

                      <Box m={4} />

                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmissionURL}
                        disabled={toolState !== 3}
                      >
                        {keyword("button_loadImages")}
                      </Button>
                    </div>
                  )}
                </Box>
              </Grid2>
              <Grid2 size={{ md: 7, xs: 12 }} style={{ padding: "0.5em" }}>
                {(toolState === 21 || toolState === 22 || toolState === 3) && (
                  <Grid2
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={classes.height100}
                  >
                    <imageGif.icon sx={{ fill: "#C9C9C9", fontSize: "40px" }} />
                    <Box p={4}>
                      <Typography
                        variant="h6"
                        style={{ color: "#C9C9C9" }}
                        align="center"
                      >
                        {keyword("text_preview")}
                      </Typography>
                    </Box>
                  </Grid2>
                )}

                {toolState === 4 && (
                  <Grid2
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={classes.height100}
                  >
                    <CircularProgress />
                  </Grid2>
                )}

                {(toolState === 5 || toolState === 7) && (
                  <AnimatedGif
                    toolState={toolState}
                    homoImg1={homoImg1}
                    homoImg2={homoImg2}
                    isCanvas={true}
                  ></AnimatedGif>
                )}
              </Grid2>
            </Grid2>
          </Box>
        </Card>
      )}
    </Box>
  );
};
export default CheckGif;
