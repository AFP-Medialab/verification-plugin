import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
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
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import Alert from "@mui/material/Alert";
import { resetForensicState } from "../../../../redux/actions/tools/forensicActions";
import { setError } from "redux/reducers/errorReducer";
import axios from "axios";
import { preprocessFileUpload } from "../../../Shared/Utils/fileUtils";
import StringFileUploadField from "../../../Shared/StringFileUploadField";

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
  const gifAnimationState = useSelector((state) => state.forensic.gifAnimation);
  const masks = useSelector((state) => state.forensic.masks);
  const session = useSelector((state) => state.userSession);
  const role = useSelector((state) => state.userSession.user.roles);

  const uid = session && session.user ? session.user.id : null;

  const [input, setInput] = useState(resultUrl);
  const [imageFile, setImageFile] = useState(undefined);
  const [urlDetected, setUrlDetected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState("");

  useGetImages(imageFile, type, keyword);

  const dispatch = useDispatch();

  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "forensic",
    "Forensice analysis assistant",
    input,
    client_id,
    imageFile,
    uid,
  );
  const submitUrl = () => {
    const fileUrl = imageFile ? URL.createObjectURL(imageFile) : input;

    setType("url");
    setLoaded(true);

    setImageFile(fileUrl);
  };

  useEffect(() => {
    if (url) {
      if (url.startsWith("http")) {
        dispatch(resetForensicState());
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
    setImageFile(undefined);
  }, [imageFile]);

  const preprocessingSuccess = (file) => {
    setImageFile(file);
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

  const preprocessImage = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  const handleCloseSelectedFile = () => {
    setImageFile(undefined);
    setInput("");
    dispatch(resetForensicState());
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
              <StringFileUploadField
                labelKeyword={keyword("forensic_input")}
                placeholderKeyword={keyword("forensic_input_placeholder")}
                submitButtonKeyword={keyword("button_submit")}
                localFileKeyword={keyword("button_localfile")}
                urlInput={input}
                setUrlInput={setInput}
                fileInput={imageFile}
                setFileInput={setImageFile}
                handleSubmit={submitUrl}
                fileInputTypesAccepted={"image/*"}
                handleCloseSelectedFile={handleCloseSelectedFile}
                preprocessLocalFile={preprocessImage}
              />
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
            onClose={handleCloseSelectedFile}
          />
        )}
      </ThemeProvider>
    </div>
  );
};
export default Forensic;
