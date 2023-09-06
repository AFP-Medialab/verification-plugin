import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import tsvWarning from "../../../../LocalDictionary/components/Shared/OnWarningInfo.tsv";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import DeepfakeIcon from "../../../NavBar/images/SVG/Image/Deepfake.svg";
import Grid from "@mui/material/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResultsImage from "./Results/DeepfakeResultsImage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Deepfake.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import Alert from "@mui/material/Alert";

const Deepfake = () => {
  //const { url } = useParams();
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Deepfake.tsv",
    tsv,
  );
  const keywordAllTools = useLoadLanguage(
    "components/NavItems/tools/Alltools.tsv",
    tsvAlltools,
  );
  const keywordWarning = useLoadLanguage(
    "components/Shared/OnWarningInfo.tsv",
    tsvWarning,
  );
  //const dispatch = useDispatch();

  const [input, setInput] = useState("");

  const isLoading = useSelector((state) => state.deepfakeImage.loading);
  const result = useSelector((state) => state.deepfakeImage.result);
  const url = useSelector((state) => state.deepfakeImage.url);

  //Selecting mode
  //============================================================================================

  const [selectedMode, setSelectedMode] = useState("");

  if (selectedMode !== "IMAGE") {
    setSelectedMode("IMAGE");
  }

  const dispatch = useDispatch();

  //Submiting the URL
  //============================================================================================

  const submitUrl = () => {
    UseGetDeepfake(input, true, selectedMode, dispatch);
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_deepfake_image")}
        description={keywordAllTools("navbar_deepfake_image_description")}
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
              <span>{keyword("deepfake_image_link")}</span>
            </Grid>
          }
          className={classes.headerUpladedImage}
        />

        <Box p={3}>
          {selectedMode !== "" && (
            <div>
              <Box>
                <form>
                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item xs>
                      <TextField
                        id="standard-full-width"
                        label={keyword("deepfake_image_link")}
                        placeholder={keyword("deepfake_placeholder")}
                        fullWidth
                        value={input}
                        variant="outlined"
                        disabled={selectedMode === "" || isLoading}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
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
                    </Grid>
                  </Grid>
                </form>

                {isLoading && (
                  <Box mt={3}>
                    <LinearProgress />
                  </Box>
                )}
              </Box>
            </div>
          )}
        </Box>
      </Card>

      <Box m={3} />

      {result && <DeepfakeResultsImage result={result} url={url} />}
    </div>
  );
};
export default Deepfake;
