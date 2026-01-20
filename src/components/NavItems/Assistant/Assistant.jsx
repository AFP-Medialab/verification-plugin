import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";

import { Close } from "@mui/icons-material";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import AssistantIcon from "@/components/NavBar/images/navbar/assistant-icon-primary.svg";
import AssistantCheckStatus from "@/components/NavItems/Assistant/AssistantCheckResults/AssistantCheckStatus";
import AssistantNEResult from "@/components/NavItems/Assistant/AssistantCheckResults/AssistantNEResult";
import AssistantCommentResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantCommentResult";
import AssistantLinkResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantLinkResult";
import AssistantMediaResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantMediaResult";
import AssistantTextResult from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantTextResult";
import AssistantSCResults from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantUrlDomainAnalysisResults";
import AssistantWarnings from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantWarnings";
import HeaderTool from "@/components/Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import { getFileTypeFromFileObject } from "@/components/Shared/Utils/fileUtils";
import { KNOWN_LINKS, TOOLS_CATEGORIES } from "@/constants/tools";
import {
  cleanAssistantState,
  setImageVideoSelected,
  setInputUrl,
  setScrapedData,
  setSingleMediaPresent,
  setUrlMode,
  submitInputUrl,
  submitUpload,
} from "@/redux/actions/tools/assistantActions";
import { setError } from "@/redux/reducers/errorReducer";
import { useTrackEvent } from "Hooks/useAnalytics";
import { useSetInputFromAssistant } from "Hooks/useUrlOrFile";

import {
  TransAssistantHelpFourTooltip,
  TransAssistantHelpThreeTooltip,
  TransAssistantHelpTwoTooltip,
  TransHtmlDoubleLineBreak,
  TransSupportedToolsLink,
} from "./TransComponents";

const Assistant = () => {
  // styles, language, dispatch, params
  const { url } = useParams();
  const navigate = useNavigate();
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // form states
  const loading = useSelector((state) => state.assistant.loading);
  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const urlMode = useSelector((state) => state.assistant.urlMode);
  const [formInput, setFormInput] = useState("");
  const inputUrlType = useSelector((state) => state.assistant.inputUrlType);

  // uploading an image/video
  const imageVideoSelected = useSelector(
    (state) => state.assistant.imageVideoSelected,
  );
  const [fileInput, setFileInput] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const setAssistantSelection = useSetInputFromAssistant();

  // result states
  const imageList = useSelector((state) => state.assistant.imageList);
  const videoList = useSelector((state) => state.assistant.videoList);
  const text = useSelector((state) => state.assistant.urlText);
  const linkList = useSelector((state) => state.assistant.linkList);
  const collectedComments = useSelector(
    (state) => state.assistant.collectedComments,
  );
  const errorKey = useSelector((state) => state.assistant.errorKey);

  //third party check states
  const neResult = useSelector((state) => state.assistant.neResultCategory);

  // source credibility
  const positiveSourceCred = useSelector(
    (state) => state.assistant.positiveSourceCred,
  );
  const cautionSourceCred = useSelector(
    (state) => state.assistant.cautionSourceCred,
  );
  const mixedSourceCred = useSelector(
    (state) => state.assistant.mixedSourceCred,
  );

  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const dbkfImageResult = useSelector(
    (state) => state.assistant.dbkfImageMatch,
  );
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);

  // third party fail states
  const scFailState = useSelector((state) => state.assistant.inputSCFail);
  const dbkfTextFailState = useSelector(
    (state) => state.assistant.dbkfTextMatchFail,
  );
  const dbkfMediaFailState = useSelector(
    (state) => state.assistant.dbkfMediaMatchFail,
  );
  const neFailState = useSelector((state) => state.assistant.neFail);
  const newsFramingFailState = useSelector(
    (state) => state.assistant.newsFramingFail,
  );
  const newsGenreFailState = useSelector(
    (state) => state.assistant.newsGenreFail,
  );
  const persuasionFailState = useSelector(
    (state) => state.assistant.persuasionFail,
  );
  const prevFactChecksFailState = useSelector(
    (state) => state.assistant.previousFactChecksFail,
  );
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );
  const subjectivityFailState = useSelector(
    (state) => state.assistant.subjectivityFail,
  );
  const machineGeneratedTextChunksFailState = useSelector(
    (state) => state.assistant.machineGeneratedChunksTextFail,
  );
  const machineGeneratedTextSentencesFailState = useSelector(
    (state) => state.assistant.machineGeneratedTextSentencesFail,
  );
  const multilingualStanceFailState = useSelector(
    (state) => state.assistant.multilingualStanceFail,
  );

  useTrackEvent(
    "submission",
    "assistant",
    "page assistant",
    formInput,
    null,
    url, // TODO right url?
  );

  // submit url or file
  const handleSubmit = async (src) => {
    dispatch(cleanAssistantState());
    // set fileInput and formInput
    if (formInput) {
      // submit url
      dispatch(submitInputUrl(src));
      navigate("/app/assistant/" + encodeURIComponent(src));
      //trackEvent("submission", "assistant", "page assistant", formInput);
      setAssistantSelection(formInput);
    } else if (fileInput) {
      // submit file
      try {
        if (!fileInput) {
          throw new Error("No input provided"); // Handle missing input
        }
        setAssistantSelection(fileInput);

        // Determine file type
        const fileType = await getFileTypeFromFileObject(fileInput);

        if (!fileType || fileType instanceof Error) {
          throw new Error("Unable to determine file type");
        }

        // set ImgaeVideoSelected for user media upload
        dispatch(setImageVideoSelected(true));
        // set single media present for display
        dispatch(setSingleMediaPresent(true));
        navigate("/app/assistant/");

        if (fileType.mime.includes("video")) {
          // set the video URL
          const videoUrl = URL.createObjectURL(fileInput);
          const ctype = TOOLS_CATEGORIES.VIDEO;

          dispatch(setInputUrl(videoUrl, KNOWN_LINKS.OWN));
          dispatch(
            setScrapedData(null, null, null, [], [videoUrl], null, null),
          );
          dispatch(submitUpload(videoUrl, ctype));
          setVideoUploaded(true);

          return;
        }

        if (fileType.mime.includes("image")) {
          // Set the image URL
          const imageUrl = URL.createObjectURL(fileInput);
          const ctype = TOOLS_CATEGORIES.IMAGE;

          dispatch(setInputUrl(imageUrl, KNOWN_LINKS.OWN)); // kicks off getSourceCredSaga
          dispatch(
            setScrapedData(null, null, null, [imageUrl], [], null, null),
          );
          dispatch(submitUpload(imageUrl, ctype));
          setImageUploaded(true);

          return;
        }

        throw new Error("Unsupported file type");
      } catch (error) {
        console.error("Error in submitUrl:", error.message);
        // TODO assistant results need to disappear and display an error to user on page
        setError(error.message);
      }
    }
  };

  // for archiving URLs
  const handleArchive = () => {
    let archiveUrl = "";

    switch (inputUrlType) {
      case KNOWN_LINKS.FACEBOOK:
        archiveUrl =
          "https://www.facebook.com/plugins/post.php?href=" +
          encodeURIComponent(inputUrl);
        break;
      case KNOWN_LINKS.INSTAGRAM:
        if (inputUrl.endsWith("/"))
          archiveUrl = inputUrl.endsWith("/")
            ? inputUrl + "embed/captioned/"
            : inputUrl + "/embed/captioned/";
        break;
      default:
        archiveUrl = inputUrl;
    }
    navigator.clipboard.writeText(archiveUrl).then(() => {
      window.open("https://web.archive.org/save/" + archiveUrl, "_blank");
    });
  };

  // pre process media file
  const preprocessFileInput = (file) => {
    setFileInput(file);
    return file;
  };

  // clean assistant
  const cleanAssistant = () => {
    dispatch(cleanAssistantState());
    // clean url mode
    setFormInput("");
    navigate("/app/assistant/");
    dispatch(setUrlMode(false));
    // clean upload mode
    dispatch(setImageVideoSelected(false));
    dispatch(setSingleMediaPresent(false));
    setImageUploaded(false);
    setVideoUploaded(false);
  };

  // set correct error message
  useEffect(() => {
    if (errorKey) {
      dispatch(setError(keyword(errorKey)));
      cleanAssistant();
    }
  }, [errorKey]);

  // if a url is present in the plugin url (as a param), set it to input
  useEffect(() => {
    if (url !== undefined) {
      let uri = url !== null ? decodeURIComponent(url) : undefined;
      dispatch(setUrlMode(true));
      setFormInput(uri);
      dispatch(submitInputUrl(uri));
      navigate("/app/assistant/" + encodeURIComponent(url));
    }
  }, [url]);

  // for having a single results section with a close button
  const handleClose = () => {
    cleanAssistant();
  };

  return (
    <div>
      <HeaderTool
        name={keyword("assistant_title")}
        description={keyword("assistant_intro")}
        icon={
          <AssistantIcon
            style={{ marginRight: "10px" }}
            width="40px"
            height="40px"
          />
        }
        action={
          <Tooltip
            interactive={"true"}
            title={
              <>
                <TransAssistantHelpTwoTooltip keyword={keyword} />
                <TransSupportedToolsLink keyword={keyword} />
              </>
            }
            classes={{ tooltip: classes.assistantTooltip }}
          >
            <HelpOutlineOutlinedIcon
              className={classes.toolTipIcon}
              color={"primary"}
            />
          </Tooltip>
        }
      />

      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
              {keyword("assistant_choose")}
            </Typography>
          }
          action={
            <Tooltip
              interactive={"true"}
              title={
                <>
                  <TransAssistantHelpThreeTooltip keyword={keyword} />
                  <TransHtmlDoubleLineBreak keyword={keyword} />
                  <TransAssistantHelpFourTooltip keyword={keyword} />
                </>
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          }
        />

        <CardContent>
          <form>
            <StringFileUploadField
              labelKeyword={keyword("assistant_urlbox")}
              placeholderKeyword={keyword("assistant_urlbox_placeholder")}
              submitButtonKeyword={keyword("button_submit")}
              localFileKeyword={keyword("button_localfile")}
              urlInput={formInput}
              setUrlInput={setFormInput}
              fileInput={fileInput}
              setFileInput={setFileInput}
              handleSubmit={handleSubmit}
              fileInputTypesAccepted={"image/*, video/*"}
              handleCloseSelectedFile={cleanAssistant}
              preprocessLocalFile={preprocessFileInput}
              handleClearUrl={cleanAssistant}
            />
          </form>

          {/* archive */}
          {inputUrl !== null && imageVideoSelected === false ? (
            <Stack
              direction="row"
              sx={{
                justifyContent: "flex-start",
                alignItems: "left",
                mt: 1,
              }}
            >
              <Button
                onClick={() => handleArchive()}
                startIcon={<ArchiveOutlinedIcon />}
              >
                <label>{keyword("archive_url_link")}</label>
              </Button>
            </Stack>
          ) : null}
        </CardContent>
      </Card>

      {/* loading results */}
      {loading && (
        <Card sx={{ mt: 4 }}>
          <Stack
            direction="column"
            spacing={4}
            sx={{
              p: 4,
            }}
          >
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" width="50%" height={40} />
          </Stack>
        </Card>
      )}

      {/* assistant status */}
      {(urlMode || imageVideoSelected) &&
      (scFailState ||
        dbkfTextFailState ||
        dbkfMediaFailState ||
        neFailState ||
        newsFramingFailState ||
        newsGenreFailState ||
        persuasionFailState ||
        subjectivityFailState ||
        prevFactChecksFailState ||
        machineGeneratedTextChunksFailState ||
        machineGeneratedTextSentencesFailState ||
        multilingualStanceFailState) ? (
        <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
          <AssistantCheckStatus />
        </Grid>
      ) : null}

      {/* assistant local file results section */}
      {!urlMode && imageVideoSelected ? (
        <Card variant="outlined" sx={{ width: "100%", mb: 2, mt: 4 }}>
          <CardHeader
            className={classes.assistantCardHeader}
            title={
              <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
                {keyword("assistant_results")}
              </Typography>
            }
            action={
              <IconButton aria-label="close" onClick={handleClose}>
                <Close
                  sx={{ color: resolvedMode === "dark" ? "white" : "grey" }}
                />
              </IconButton>
            }
          />

          <CardContent>
            <AssistantMediaResult
              title={
                videoUploaded
                  ? "upload_video"
                  : imageUploaded
                    ? "upload_image"
                    : null
              }
            />
          </CardContent>
        </Card>
      ) : null}

      {/* assistant url results section */}
      {urlMode && inputUrl ? (
        <Card variant="outlined" sx={{ width: "100%", mb: 2, mt: 4 }}>
          <CardHeader
            className={classes.assistantCardHeader}
            title={
              <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
                {keyword("assistant_results")}
              </Typography>
            }
            action={
              <IconButton aria-label="close" onClick={handleClose}>
                <Close
                  sx={{ color: resolvedMode === "dark" ? "white" : "grey" }}
                />
              </IconButton>
            }
          />

          <CardContent>
            <Grid container spacing={4}>
              {/* warnings and api status checks */}
              {dbkfTextMatch ||
              dbkfImageResult ||
              dbkfVideoMatch ||
              prevFactChecksResult ? (
                <Grid
                  size={{ xs: 12 }}
                  className={classes.assistantGrid}
                  hidden={urlMode === false}
                >
                  <AssistantWarnings />
                </Grid>
              ) : null}

              {/* source credibility/URL domain analysis results */}
              {positiveSourceCred || cautionSourceCred || mixedSourceCred ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantSCResults />
                </Grid>
              ) : null}

              {/* media results */}
              {imageList.length > 0 || videoList.length > 0 ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantMediaResult />
                </Grid>
              ) : null}

              {/* YouTube comments if video */}
              {collectedComments?.length > 0 ? (
                <Grid size={12}>
                  <AssistantCommentResult
                    collectedComments={collectedComments}
                  />
                </Grid>
              ) : null}

              {/* text results */}
              {text ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantTextResult />
                </Grid>
              ) : null}

              {/* named entity results */}
              {text && neResult ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantNEResult />
                </Grid>
              ) : null}

              {/* extracted urls with url domain analysis */}
              {text && linkList.length !== 0 ? (
                <Grid size={{ xs: 12 }}>
                  <AssistantLinkResult />
                </Grid>
              ) : null}
            </Grid>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
export default Assistant;
