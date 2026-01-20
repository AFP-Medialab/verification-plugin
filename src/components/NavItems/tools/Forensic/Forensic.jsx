import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { imageForensic } from "@/constants/tools";
import { resetForensicState } from "@/redux/actions/tools/forensicActions";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { preprocessFileUpload } from "@Shared/Utils/fileUtils";
import { useUrlOrFile } from "Hooks/useUrlOrFile";
import axios from "axios";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import useGetImages from "./Hooks/useGetImages";
import ForensicResults from "./Results/ForensicResult";

const Forensic = () => {
  const { url } = useParams();
  const [searchParams] = useSearchParams();
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

  const [input = resultUrl, setInput, imageFile, setImageFile] = useUrlOrFile();
  const [urlDetected, setUrlDetected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState("");

  // const fromAssistant = searchParams.has('fromAssistant');

  // console.log("FORENSIC", "resultUrl=", resultUrl);
  // console.log("FORENSIC", type, "=", imageFile);

  // if (fromAssistant && imageFile) {
  //   console.log("useGetImages && fromAssistant && local");
  //   setType("local");
  //   // useGetImages(imageFile, "local", keyword);
  // } else {
  //   console.log("useGetImages &&", type)
  //   // setType("url");
  //   // useGetImages(imageFile, type, keyword);
  // }

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
    dispatch(resetForensicState());
    // dispatch(setForensicsLoading(true));
    //
    // if (fromAssistant && imageFile) {
    //   setType("local");
    //   setLoaded(true);
    //   setImageFile(imageFile);
    //   setInput("");
    // } else {
    //   setType(imageFile ? "local" : "url");
    //   setLoaded(true);
    //   setImageFile(imageFile || "");
    //   setInput(input || "")
    // }

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

  // useEffect(() => {
  //   const fromAssistant = searchParams.has('fromAssistant');
  //   if (fromAssistant && (input || imageFile)) {
  //     if (imageFile) {
  //       setType("local");
  //     }
  //     submitUrl();
  //   }
  // }, [searchParams]);

  const preprocessingSuccess = (file) => {
    dispatch(resetForensicState());
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

  const resetToolState = () => {
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
              handleCloseSelectedFile={resetToolState}
              preprocessLocalFile={preprocessImage}
              isParentLoading={loading}
              handleClearUrl={resetToolState}
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
          onClose={resetToolState}
        />
      )}
    </Stack>
  );
};
export default Forensic;
