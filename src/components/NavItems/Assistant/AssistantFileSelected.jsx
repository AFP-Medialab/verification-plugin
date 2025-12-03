import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { TOOLS_CATEGORIES } from "@/constants/tools";
import { getFileTypeFromFileObject } from "@Shared/Utils/fileUtils";
import {
  cleanAssistantState,
  setInputUrl,
  setScrapedData,
  setSingleMediaPresent,
  setVideoThumbnailUrl,
  submitUpload,
} from "redux/actions/tools/assistantActions";

import { KNOWN_LINKS } from "./AssistantRuleBook";
import AssistantMediaResult from "./AssistantScrapeResults/AssistantMediaResult";
import AssistantWarnings from "./AssistantScrapeResults/AssistantWarnings";
import FileUploadField from "./FileUploadField";

const AssistantFileSelected = () => {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // dbkf similar images results
  const dbkfImageResult = useSelector(
    (state) => state.assistant.dbkfImageMatch,
  );
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);

  // uploading an image/video
  const [fileInput, setFileInput] = useState(null);

  const [error, setError] = useState(false);

  const [videoUploaded, setVideoUploaded] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const getVideoThumbnail = (blobUrl) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = blobUrl;
      video.currentTime = 1;
      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        canvas.toBlob(resolve);
      };
    });
  };

  // const convertToDataUrl = (file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.readAsDataURL(file); // Pass the File object, not the blob URL
  //   });
  // };

  const submitLocalFile = async () => {
    cleanAssistantState();

    try {
      if (!fileInput) {
        throw new Error("No input provided"); // Handle missing input
      }

      // Determine file type
      const fileType = await getFileTypeFromFileObject(fileInput);

      if (!fileType || fileType instanceof Error) {
        throw new Error("Unable to determine file type");
      }

      // convert file object to data url - error 414 from dbkf, url too long!
      // const dataUrl = await convertToDataUrl(fileInput); // file object
      // host temporarily on backend to get a real url?

      // set single media present
      dispatch(setSingleMediaPresent(true));

      if (fileType.mime.includes("video")) {
        // set the video URL
        const videoUrl = URL.createObjectURL(fileInput);
        const ctype = TOOLS_CATEGORIES.VIDEO;

        dispatch(setInputUrl(videoUrl, KNOWN_LINKS.OWN));
        dispatch(setScrapedData(null, null, null, [], [videoUrl], null, null));

        // dispatch(submitUpload(dataUrl, ctype));
        dispatch(submitUpload(videoUrl, ctype));
        setVideoUploaded(true);

        const thumbnailBlob = await getVideoThumbnail(videoUrl);
        dispatch(setVideoThumbnailUrl(URL.createObjectURL(thumbnailBlob)));

        return;
      }

      if (fileType.mime.includes("image")) {
        // Set the image URL
        const imageUrl = URL.createObjectURL(fileInput);
        const ctype = TOOLS_CATEGORIES.IMAGE;

        dispatch(setInputUrl(imageUrl, KNOWN_LINKS.OWN)); // kicks off getSourceCredSaga
        dispatch(setScrapedData(null, null, null, [imageUrl], [], null, null));

        // dispatch(submitUpload(dataUrl, ctype));
        dispatch(submitUpload(imageUrl, ctype));
        setImageUploaded(true);

        return;
      }

      throw new Error("Unsupported file type");
    } catch (error) {
      console.error("Error in submitUrl:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      {/* File upload form */}
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
              sx={{
                p: 2,
                textAlign: "left",
              }}
            >
              <FileUploadField
                submitButtonKeyword={keyword("button_submit")}
                localFileKeyword={keyword("button_localfile")}
                fileInput={fileInput}
                setFileInput={setFileInput}
                handleSubmit={submitLocalFile}
                fileInputTypesAccepted={"image/*, video/*"}
                handleCloseSelectedFile={cleanAssistantState}
              />
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* display warnings if any exist */}
      {dbkfImageResult || dbkfVideoMatch ? (
        <Box sx={{ mt: 4 }}>
          <AssistantWarnings />
        </Box>
      ) : null}

      {/* display image or video with recommended tools list */}
      <Box sx={{ mt: 4 }}>
        <AssistantMediaResult
          title={
            videoUploaded
              ? keyword("upload_video")
              : imageUploaded
                ? keyword("upload_image")
                : null
          }
        />
      </Box>
    </>
  );
};
export default AssistantFileSelected;
