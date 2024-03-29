import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import useGetImages from "./Hooks/useGetImages";
import LinearProgress from "@mui/material/LinearProgress";
import ForensicResults from "./Results/ForensicResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { useParams } from "react-router-dom";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import ForensicIcon from "../../../NavBar/images/SVG/Image/Forensic.svg";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import Alert from "@mui/material/Alert";
import { cleanForensicState } from "../../../../redux/actions/tools/forensicActions";
import { setError } from "redux/reducers/errorReducer";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import axios from "axios";
import { preprocessFileUpload } from "../../../Shared/Utils/fileUtils";

const Forensic = () => {
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Forensic");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const theme = createTheme({
    components: {
      MuiCardHeader: {
        styleOverrides: {
          root: {
            backgroundColor: "#00926c",
          },
          title: {
            color: "white",
            fontSize: 20,
            fontweight: 500,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          wrapper: {
            fontSize: 12,
          },
          root: {
            minWidth: "25%!important",
          },
        },
      },
    },

    palette: {
      primary: {
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
    },
  });

  const resultUrl = useSelector((state) => state.forensic.url);
  const resultData = useSelector((state) => state.forensic.result);
  const isLoading = useSelector((state) => state.forensic.loading);
  const gifAnimationState = useSelector((state) => state.forensic.gifAnimation);
  const masks = useSelector((state) => state.forensic.masks);
  const session = useSelector((state) => state.userSession);
  const role = useSelector((state) => state.userSession.user.roles);

  const uid = session && session.user ? session.user.id : null;

  const [input, setInput] = useState(resultUrl);
  const [image, setImage] = useState(undefined);
  const [urlDetected, setUrlDetected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState("");

  useGetImages(image, type, keyword);

  const dispatch = useDispatch();

  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "forensic",
    "Forensice analysis assistant",
    input,
    client_id,
    image,
    uid,
  );
  const submitUrl = () => {
    if (input && input !== "") {
      setType("url");
      setLoaded(true);
      /*trackEvent(
                                                              "submission",
                                                              "forensic",
                                                              "Forensice analysis assistant",
                                                              input,
                                                              client_id,
                                                              uid
                                                            );*/
      setImage(input);
    }
  };

  useEffect(() => {
    if (url) {
      if (url.startsWith("http")) {
        dispatch(cleanForensicState());
        const uri = decodeURIComponent(url);
        setInput(uri);
        setUrlDetected(true);
      } else {
        const load = async () => {
          let blob =
            (await axios.get(url, { responseType: "blob" })).data ?? null;
          blob
            ? preprocessFileUpload(
                blob,
                role,
                undefined,
                preprocessingSuccess,
                preprocessingError,
              )
            : dispatch(setError(keywordWarning("error")));
        };
        load();
      }
    }
  }, [url]);

  useEffect(() => {
    if (urlDetected) {
      submitUrl();
    }
    return () => setUrlDetected(false);
  }, [urlDetected]);

  useEffect(() => {
    setImage(undefined);
  }, [image]);

  const preprocessingSuccess = (file) => {
    setImage(file);
    setType("local");
  };

  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const loading = useSelector((state) => state.forensic.loading);

  const resetImage = () => {
    setLoaded(false);
    setInput("");
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        {
          //=== Title ===
        }

        <HeaderTool
          name={keywordAllTools("navbar_forensic")}
          description={keywordAllTools("navbar_forensic_description")}
          icon={
            <ForensicIcon
              style={{ fill: "#00926c" }}
              width="40px"
              height="40px"
            />
          }
        />
        <Alert severity="warning">{keywordWarning("warning_forensic")}</Alert>
        <Box mt={3} />
        <Card style={{ display: resultData || loading ? "none" : "block" }}>
          <CardHeader
            title={keyword("cardheader_source")}
            className={classes.headerUploadedImage}
          />
          <Box p={3}>
            <form>
              <Box display={"block"}>
                <Grid container direction="row" spacing={3} alignItems="center">
                  <Grid item xs>
                    <TextField
                      value={input}
                      id="standard-full-width"
                      label={keyword("forensic_input")}
                      placeholder={keyword("forensic_input_placeholder")}
                      fullWidth
                      variant="outlined"
                      disabled={isLoading}
                      onChange={(e) => {
                        setInput(e.target.value);
                      }}
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
                      disabled={isLoading}
                      style={{ height: "50px" }}
                    >
                      {keyword("button_submit")}
                    </Button>
                  </Grid>
                  <Box m={2} />
                  <Button startIcon={<FolderOpenIcon />}>
                    <label htmlFor="fileInputForensic">
                      {keyword("button_localfile")}
                    </label>
                    <input
                      id="fileInputForensic"
                      type="file"
                      hidden={true}
                      onChange={(e) => {
                        preprocessFileUpload(
                          e.target.files[0],
                          role,
                          undefined,
                          preprocessingSuccess,
                          preprocessingError,
                        );
                      }}
                    />
                  </Button>
                </Grid>
              </Box>
            </form>
          </Box>
        </Card>

        {loading && (
          <div>
            <LinearProgress />
          </div>
        )}

        {resultData && (
          <ForensicResults
            result={resultData}
            url={resultUrl}
            type={type}
            loaded={loaded}
            gifAnimation={gifAnimationState}
            resetImage={resetImage}
            masksData={masks}
          />
        )}
      </ThemeProvider>
    </div>
  );
};
export default Forensic;
