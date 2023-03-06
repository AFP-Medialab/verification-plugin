import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useGetImages from "./Hooks/useGetImages";
import LinearProgress from "@mui/material/LinearProgress";
import ForensicResults from "./Results/ForensicResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { useParams } from "react-router-dom";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import tsvAllTools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import tsvWarning from "../../../../LocalDictionary/components/Shared/OnWarningInfo.tsv";
import {
  trackEvent,
  getclientId,
} from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import ForensicIcon from "../../../NavBar/images/SVG/Image/Forensic.svg";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import Alert from "@mui/material/Alert";
import { cleanForensicState } from "../../../../redux/actions/tools/forensicActions";
import { setError } from "../../../../redux/actions/errorActions";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

const Forensic = () => {
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Forensic.tsv",
    tsv
  );
  const keywordAllTools = useLoadLanguage(
    "components/NavItems/tools/Alltools.tsv",
    tsvAllTools
  );
  const keywordWarning = useLoadLanguage(
    "components/Shared/OnWarningInfo.tsv",
    tsvWarning
  );

  const theme = createTheme({
    components: {
      MuiCardHeader: {
        styleOverrides: {
          root: {
            backgroundColor: "#05A9B4",
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
        light: "#5cdbe6",
        main: "#05a9b4",
        dark: "#007984",
        contrastText: "#fff",
      },
    },
  });

  const resultUrl = useSelector((state) => state.forensic.url);
  const resultData = useSelector((state) => state.forensic.result);
  const isLoading = useSelector((state) => state.forensic.loading);
  const gifAnimationState = useSelector((state) => state.forensic.gifAnimation);
  const masks = useSelector((state) => state.forensic.masks);

  const [input, setInput] = useState(resultUrl);
  const [image, setImage] = useState("");
  const [urlDetected, setUrlDetected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState("");

  useGetImages(image, type, keyword);

  const dispatch = useDispatch();

  const client_id = getclientId();
  const submitUrl = () => {
    if (input && input !== "") {
      setType("url");
      setLoaded(true);
      trackEvent(
        "submission",
        "forensic",
        "Forensice analysis assistant",
        input,
        client_id
      );
      setImage(input);
    }
  };

  useEffect(() => {
    if (url) {
      dispatch(cleanForensicState());
      const uri = decodeURIComponent(url);
      setInput(uri);
      setUrlDetected(true);
    }
  }, [url]);

  useEffect(() => {
    if (urlDetected) {
      submitUrl();
    }
    return () => setUrlDetected(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlDetected]);

  useEffect(() => {
    setImage("");
  }, [image]);

  const handleUploadImg = (file) => {
    if (file.size >= 6000000) {
      dispatch(setError(keyword("forensic_too_big")));
    } else {
      setImage(file);
      setType("local");
    }
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
              style={{ fill: "#51A5B2" }}
              width="40px"
              height="40px"
            />
          }
          advanced="true"
        />

        <Card style={{ display: resultData || loading ? "none" : "block" }}>
          <CardHeader
            title={keyword("cardheader_source")}
            className={classes.headerUpladedImage}
          />
          <Box p={3}>
            <form>
              <Box display={"block"}>
                <Alert severity="warning">
                  {keywordWarning("warning_forensic")}
                </Alert>
                <Box mt={3} />
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
                      onClick={submitUrl}
                      disabled={isLoading}
                      style={{ height: "50px" }}
                    >
                      {keyword("button_submit")}
                    </Button>
                  </Grid>
                  <Box m={2} />
                  <Button startIcon={<FolderOpenIcon />}>
                    <label htmlFor="fileInputMagnifier">
                      {keyword("button_localfile")}
                    </label>
                    <input
                      id="fileInputMagnifier"
                      type="file"
                      hidden={true}
                      onChange={(e) => {
                        handleUploadImg(e.target.files[0]);
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
            <Alert severity="warning">
              {keywordWarning("warning_forensic")}
            </Alert>
            <Box mt={3} />
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
