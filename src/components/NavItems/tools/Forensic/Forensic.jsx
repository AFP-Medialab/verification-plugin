import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { preprocessFileUpload } from "@Shared/Utils/fileUtils";
import axios from "axios";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";

import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { imageForensic } from "../../../../constants/tools";
import { resetForensicState } from "../../../../redux/actions/tools/forensicActions";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import useGetImages from "./Hooks/useGetImages";
import ForensicResults from "./Results/ForensicResult";

const Forensic = () => {
  const { url } = useParams();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Forensic");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

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

  const processUrl = useSelector((state) => state.assistant.processUrl);
  useEffect(() => {
    if (processUrl) {
      setInput(processUrl);
      setUrlDetected(true);
    }
  }, [processUrl]);

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
    <Stack direction="column" spacing={2}>
      <HeaderTool
        name={keywordAllTools("navbar_forensic")}
        description={keywordAllTools("navbar_forensic_description")}
        icon={
          <imageForensic.icon
            sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
          />
        }
      />
      <Alert severity="warning">{keywordWarning("warning_forensic")}</Alert>
      <Card variant="outlined">
        <Box
          sx={{
            p: 4,
          }}
        >
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
              isParentLoading={loading}
            />
          </form>
        </Box>
        {loading && (
          <div>
            <LinearProgress />
          </div>
        )}
      </Card>

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
    </Stack>
  );
};
export default Forensic;
