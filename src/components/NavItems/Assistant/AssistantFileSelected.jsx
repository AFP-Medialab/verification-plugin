import React, { useState } from "react";
import {
  useDispatch,
  // useSelector,
} from "react-redux";

// import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemAvatar from "@mui/material/ListItemAvatar";
// import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { TOOLS_CATEGORIES } from "@/constants/tools";
import { getFileTypeFromFileObject } from "@Shared/Utils/fileUtils";
import {
  cleanAssistantState,
  // setImageVideoSelected,
  setInputUrl,
  setScrapedData,
  setSingleMediaPresent,
  submitUpload,
} from "redux/actions/tools/assistantActions";

import {
  KNOWN_LINKS,
  // selectCorrectActions,
} from "./AssistantRuleBook";
import AssistantMediaResult from "./AssistantScrapeResults/AssistantMediaResult";
import FileUploadField from "./FileUploadField";

const AssistantFileSelected = () => {
  // resetFileSelectedState();

  const classes = useMyStyles();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // uploading an image/video
  const [fileInput, setFileInput] = useState(null);

  const [error, setError] = useState(false);

  // const imageVideoSelected = useSelector(
  //   (state) => state.assistant.imageVideoSelected,
  // );
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  // // find tool list
  // const getActionList = (contentType) => {
  //   let known_link = KNOWN_LINKS.OWN; // this is the uploaded link
  //   const role = useSelector((state) => state.userSession.user.roles);
  //   const userAuthenticated = useSelector(
  //     (state) => state.userSession.userAuthenticated,
  //   );
  //   return selectCorrectActions(
  //     contentType,
  //     known_link,
  //     known_link,
  //     "",
  //     role,
  //     userAuthenticated,
  //   );
  // };

  // const imageActions = getActionList(TOOLS_CATEGORIES.IMAGE);
  // const videoActions = getActionList(TOOLS_CATEGORIES.VIDEO);

  // const handleClick = (path, cType) => {
  //   //history.push("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType)
  //   navigate("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType);
  // };

  const submitUrl = async () => {
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

      // set single media present
      dispatch(setSingleMediaPresent(true));

      if (fileType.mime.includes("video")) {
        // set the video URL
        const videoUrl = URL.createObjectURL(fileInput);

        // dispatch(setProcessUrl(videoUrl, TOOLS_CATEGORIES.VIDEO));
        dispatch(submitUpload(TOOLS_CATEGORIES.VIDEO));
        dispatch(setInputUrl(videoUrl, KNOWN_LINKS.OWN));
        dispatch(setScrapedData(null, null, null, [], [videoUrl], null, null));
        dispatch(submitUpload(TOOLS_CATEGORIES.VIDEO)); // TODO working correctly?
        setVideoUploaded(true);

        return;
      }

      if (fileType.mime.includes("image")) {
        // Set the image URL
        const imageUrl = URL.createObjectURL(fileInput);

        // dispatch(setProcessUrl(imageUrl, TOOLS_CATEGORIES.IMAGE));
        dispatch(submitUpload(TOOLS_CATEGORIES.IMAGE));
        dispatch(setInputUrl(imageUrl, KNOWN_LINKS.OWN));
        dispatch(setScrapedData(null, null, null, [imageUrl], [], null, null));
        dispatch(submitUpload(TOOLS_CATEGORIES.IMAGE)); // TODO working correctly?
        setImageUploaded(true);

        return;
      }

      throw new Error("Unsupported file type");
    } catch (error) {
      console.error("Error in submitUrl:", error.message);
      setError(error.message);
    }
  };

  // const generateList = (title, cType, actionList) => {
  //   return (
  //     <>
  //       <Box
  //         sx={{
  //           mx: 2,
  //           my: 0.5,
  //         }}
  //       >
  //         <Typography
  //           variant={"h6"}
  //           style={{ fontWeight: "bold" }}
  //           sx={{
  //             textAlign: "start",
  //           }}
  //         >
  //           {title}
  //         </Typography>
  //       </Box>
  //       <List>
  //         {actionList.map((action, index) => {
  //           return (
  //             <Box
  //               key={index}
  //               sx={{
  //                 m: 2,
  //               }}
  //             >
  //               <Card className={classes.assistantHover} variant="outlined">
  //                 <ListItem
  //                   onClick={() => {
  //                     handleClick(action.path, cType);
  //                   }}
  //                 >
  //                   <ListItemAvatar>{action.icon}</ListItemAvatar>
  //                   <ListItemText
  //                     primary={
  //                       <Typography
  //                         component={"span"}
  //                         sx={{
  //                           textAlign: "start",
  //                         }}
  //                       >
  //                         <Box
  //                           sx={{
  //                             fontWeight: "fontWeightBold",
  //                           }}
  //                         >
  //                           {keyword(action.title)}
  //                         </Box>
  //                       </Typography>
  //                     }
  //                     secondary={
  //                       <Typography
  //                         color={"textSecondary"}
  //                         component={"span"}
  //                         sx={{
  //                           textAlign: "start",
  //                         }}
  //                       >
  //                         <Box
  //                           sx={{
  //                             fontStyle: "italic",
  //                           }}
  //                         >
  //                           {keyword(action.text)}
  //                         </Box>
  //                       </Typography>
  //                     }
  //                   />
  //                 </ListItem>
  //               </Card>
  //             </Box>
  //           );
  //         })}
  //       </List>
  //     </>
  //   );
  // };

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
                p: 4,
                textAlign: "left",
              }}
            >
              <FileUploadField
                submitButtonKeyword={keyword("button_submit")}
                localFileKeyword={keyword("button_localfile")}
                fileInput={fileInput}
                setFileInput={setFileInput}
                handleSubmit={submitUrl}
                fileInputTypesAccepted={"image/*, video/*"}
                handleCloseSelectedFile={cleanAssistantState}
              />
            </Box>
          </form>
        </CardContent>
      </Card>

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
