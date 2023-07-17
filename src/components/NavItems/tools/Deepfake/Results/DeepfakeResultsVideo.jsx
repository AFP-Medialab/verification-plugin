import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Grid, Popover, Typography } from "@mui/material";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const DeepfakeResutlsVideo = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Deepfake.tsv",
    tsv,
  );
  const results = props.result;
  //const url = props.url;

  const [shotSelectedKey, setShotSelectedKey] = useState(-1);
  const [shotSelectedValue, setShotSelectedValue] = useState(null);
  const videoClip = React.useRef(null);

  function clickShot(value, key) {
    setShotSelectedKey(-1);
    setShotSelectedKey(key);
    setShotSelectedValue(value);
    if (videoClip.current !== null) {
      videoClip.current.load();
    }
  }

  //console.log("Results", results);

  useEffect(() => {
    var prediction = results.deepfake_video_report.prediction;
    var shot = -1;
    for (
      var i = 0;
      i < results.deepfake_video_report.results.length && shot === -1;
      i++
    ) {
      if (results.deepfake_video_report.results[i].prediction === prediction) {
        shot = i;
      }
    }

    if (shot !== -1) {
      clickShot(results.deepfake_video_report.results[shot], shot);
    }
  }, []);

  //console.log("Rectangles: ", rectangles);

  //Help
  //============================================================================================
  const [anchorHelp, setAnchorHelp] = React.useState(null);
  const openHelp = Boolean(anchorHelp);
  const help = openHelp ? "simple-popover" : undefined;

  function clickHelp(event) {
    setAnchorHelp(event.currentTarget);
  }

  function closeHelp() {
    setAnchorHelp(null);
  }

  return (
    <div>
      <Box m={3} />

      <Grid container direction="column">
        <Grid item container direction="row" spacing={3}>
          <Grid item xs={6} container direction="column">
            <Typography
              variant="body1"
              style={{ color: "#00926c", fontSize: "24px", fontWeight: "500" }}
            >
              {keyword("deepfake_video")}
            </Typography>

            <Box m={1} />

            <video
              width="100%"
              height="auto"
              controls
              style={{
                borderRadius: "10px",
                boxShadow:
                  "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
              }}
            >
              <source
                src={results.deepfake_video_report.video_path + "#t=2,4"}
                type="video/mp4"
              />
              {keyword("deepfake_support")}
            </video>
          </Grid>

          <Grid item xs={6} container direction="column">
            <Typography
              variant="body1"
              style={{ color: "#00926c", fontSize: "24px", fontWeight: "500" }}
            >
              {keyword("deepfake_clips")}
            </Typography>
            <Box m={1} />

            <Grid container spacing={3}>
              {results.deepfake_video_report.results.map(
                (valueShot, keyShot) => {
                  var shotStart = valueShot.shot_start;
                  var shotEnd = valueShot.shot_end;

                  var startMin = ("0" + Math.floor(shotStart / 60)).slice(-2);
                  var startSec = ("0" + (shotStart % 60)).slice(-2);
                  var endMin = ("0" + Math.floor(shotEnd / 60)).slice(-2);
                  var endSec = ("0" + (shotEnd % 60)).slice(-2);

                  return (
                    <Grid item xs={12} sm={4} key={keyShot}>
                      {keyShot === shotSelectedKey ? (
                        <Box
                          onClick={() => clickShot(valueShot, keyShot)}
                          style={{
                            backgroundColor: "#00926c",
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow:
                              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                          }}
                        >
                          <img
                            alt="shot"
                            src={valueShot.shot_image}
                            style={{ width: "100%", height: "auto" }}
                          />
                          <Box mt={1} />
                          <Typography
                            variant="body1"
                            style={{ fontSize: "14px", color: "#ffffff" }}
                          >
                            {startMin}:{startSec}
                            {" - "}
                            {endMin}:{endSec}
                          </Typography>
                          <Box mt={1} />
                        </Box>
                      ) : (
                        <Box
                          onClick={() => clickShot(valueShot, keyShot)}
                          style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow:
                              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                          }}
                        >
                          <img
                            alt="shot"
                            src={valueShot.shot_image}
                            style={{ width: "100%", height: "auto" }}
                          />
                          <Box mt={1} />
                          <Typography
                            variant="body1"
                            style={{ fontSize: "14px" }}
                          >
                            {startMin}:{startSec}
                            {" - "}
                            {endMin}:{endSec}
                          </Typography>
                          <Box mt={1} />
                        </Box>
                      )}
                    </Grid>
                  );
                },
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box m={3} />

      <Card style={{ overflow: "visible" }}>
        <CardHeader
          style={{ borderRadius: "4px 4px 0px 0px" }}
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("deepfake_results")}</span>
              <HelpOutlineIcon
                style={{ color: "#FFFFFF" }}
                onClick={clickHelp}
              />

              <Popover
                id={help}
                open={openHelp}
                anchorEl={anchorHelp}
                onClose={closeHelp}
                PaperProps={{
                  style: {
                    width: "300px",
                    fontSize: 14,
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Box p={3}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                  >
                    <Typography variant="h6" gutterBottom>
                      {keyword("deepfake_title_what")}
                    </Typography>

                    <CloseIcon onClick={closeHelp} />
                  </Grid>
                  <Box m={1} />
                  <Typography variant="body2">
                    {keyword("deepfake_filters_explanation_video")}
                  </Typography>
                </Box>
              </Popover>
            </Grid>
          }
          className={classes.headerUpladedImage}
        />
        <div>
          <Box p={3}>
            {shotSelectedValue === null ? (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: "350px" }}
              >
                <Box p={4}>
                  <Typography
                    variant="h6"
                    style={{ color: "#C9C9C9" }}
                    align="center"
                  >
                    {keyword("deepfake_select")}
                  </Typography>
                </Box>
              </Grid>
            ) : (
              <Grid container direction="row" spacing={4}>
                <Grid item container direction="column" xs={6}>
                  <Typography variant="h6">
                    {keyword("deepfake_clip")}
                  </Typography>

                  <Box m={1} />

                  <video
                    ref={videoClip}
                    width="100%"
                    height="auto"
                    controls
                    style={{
                      borderRadius: "10px",
                      boxShadow:
                        "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                    }}
                  >
                    <source
                      src={
                        results.deepfake_video_report.video_path +
                        "#t=" +
                        shotSelectedValue.shot_start +
                        "," +
                        shotSelectedValue.shot_end
                      }
                      type="video/mp4"
                    />
                    {keyword("deepfake_support")}
                  </video>
                </Grid>

                <Grid
                  item
                  container
                  direction="column"
                  xs={6}
                  style={{ borderLeft: "0.1em solid #ECECEC" }}
                >
                  <Typography variant="h6">
                    {keyword("deepfake_faces")}
                  </Typography>
                  <Box m={1} />

                  <Grid container direction="row" spacing={3}>
                    {shotSelectedValue.face_image_paths.map(
                      (valueFace, keyFace) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            key={keyFace}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <img
                              alt="face"
                              src={valueFace}
                              style={{ width: "100%", height: "auto" }}
                            />
                            <Box mt={1} />
                            <Typography variant="h3">
                              {Math.round(
                                shotSelectedValue.face_predictions[keyFace] *
                                  100,
                              )}
                              %
                            </Typography>
                            <Typography
                              variant="h6"
                              style={{ color: "#989898" }}
                            >
                              {keyword("deepfake_name")}
                            </Typography>
                          </Grid>
                        );
                      },
                    )}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Box>
        </div>
      </Card>
    </div>
  );
};
export default DeepfakeResutlsVideo;
