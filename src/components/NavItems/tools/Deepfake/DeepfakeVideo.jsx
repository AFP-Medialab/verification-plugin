import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import DeepfakeIcon from "../../../NavBar/images/SVG/Image/Deepfake.svg";
import Grid from "@mui/material/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResultsVideo from "./Results/DeepfakeResultsVideo";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import Alert from "@mui/material/Alert";
import { resetDeepfake } from "../../../../redux/actions/tools/deepfakeVideoActions";

const Deepfake = () => {
  //const { url } = useParams();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Deepfake");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.deepfakeVideo.loading);
  const result = useSelector((state) => state.deepfakeVideo.result);
  const url = useSelector((state) => state.deepfakeVideo.url);
  const role = useSelector((state) => state.userSession.user.roles);
  const [input, setInput] = useState(url ? url : "");
  //Selecting mode
  //============================================================================================
  const [selectedMode, setSelectedMode] = useState("");

  if (selectedMode !== "VIDEO") {
    setSelectedMode("VIDEO");
  }

  //Submiting the URL
  //============================================================================================

  const dispatch = useDispatch();

  const cleanup = () => {
    dispatch(resetDeepfake());
    setInput("");
  };
  const submitUrl = () => {
    UseGetDeepfake(
      input,
      true,
      selectedMode,
      dispatch,
      role,
      keywordWarning("error_invalid_url"),
    );
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_deepfake_video")}
        description={keywordAllTools("navbar_deepfake_video_description")}
        icon={
          <DeepfakeIcon
            style={{ fill: "#00926c", height: "75px", width: "auto" }}
          />
        }
      />

      <Alert severity="warning">{keywordWarning("warning_beta")}</Alert>

      <Box m={3} />

      <Card>
        <CardHeader
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("deepfake_video_link")}</span>
            </Grid>
          }
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
          {selectedMode !== "" && (
            <form>
              <Box>
                <Grid container direction="row" spacing={3} alignItems="center">
                  <Grid item xs>
                    <TextField
                      id="standard-full-width"
                      label={keyword("deepfake_video_link")}
                      placeholder={keyword("deepfake_placeholder")}
                      fullWidth
                      type="url"
                      value={input}
                      variant="outlined"
                      disabled={selectedMode === "" || isLoading}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </Grid>

                  <Grid item>
                    {!result ? (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault(), submitUrl();
                        }}
                        disabled={
                          selectedMode === "" || input === "" || isLoading
                        }
                      >
                        {"Submit"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault(), cleanup();
                        }}
                      >
                        {keyword("button_remove")}
                      </Button>
                    )}
                  </Grid>
                </Grid>

                {isLoading && (
                  <Box mt={3}>
                    <LinearProgress />
                  </Box>
                )}
              </Box>
            </form>
          )}
        </Box>
      </Card>

      <Box m={3} />

      {result && <DeepfakeResultsVideo result={result} url={url} />}
    </div>
  );
};
export default Deepfake;
