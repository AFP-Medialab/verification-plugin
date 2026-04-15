import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Stack from "@mui/material/Stack";

import { FaceRetouchingNatural } from "@mui/icons-material";

import { useUrlOrFile } from "@/Hooks/useUrlOrFile";
import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import { preprocessFileUpload } from "@/components/Shared/Utils/fileUtils";
import { resetPoiForensics } from "@/redux/actions/tools/poiForensicsActions";
import { setError } from "@/redux/reducers/errorReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useGetPoiForensics from "./Hooks/useGetPoiForensic";
import { PERSON_OF_INTEREST } from "./poiUtils";

/**
 * React node that displays the POI Forensics feature
 * @returns
 */
const PoiForensics = () => {
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keyword = i18nLoadNamespace("components/NavItems/tools/PoiForensics");
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const [searchParams] = useSearchParams();

  const isLoading = useSelector((state) => state.poiForensics.isLoading);
  const result = useSelector((state) => state.poiForensics.result);
  const url = useSelector((state) => state.poiForensics.url);
  const role = useSelector((state) => state.userSession.user.roles);
  const [input = url || "", setInput, videoFile, setVideoFile] = useUrlOrFile();
  const fromAssistant = searchParams.has("fromAssistant");
  const [type, setType] = useState(() => {
    if (fromAssistant) {
      return videoFile ? "local" : input ? "url" : "";
    }
    return "";
  });

  const dispatch = useDispatch();

  /**
   * Initialize selected POI with Macron
   * @returns {selectedValue}
   */
  const initializeSelectedPoi = () => {
    let selectedList = {};

    for (const poi of Object.values(PERSON_OF_INTEREST)) {
      selectedList[poi.NAME_TOSEND] =
        poi.NAME_TOSEND === PERSON_OF_INTEREST.MACRON.NAME_TOSEND;
    }

    return selectedList;
  };

  const [selectedPoi, setSelectedPoi] = useState(() => initializeSelectedPoi());

  const handleChangePoi = (event) => {
    setSelectedPoi({
      ...selectedPoi,
      [event.target.value]: event.target.checked,
    });
  };

  // pour l'instant on va juste console log l'url construit
  const submitUrl = async () => {
    await useGetPoiForensics(
      selectedPoi,
      keyword,
      input,
      true,
      dispatch,
      role,
      keywordWarning("error_invalid_url"),
      type,
      videoFile,
    );
  };

  const preprocessingSuccess = (file) => {
    setVideoFile(file);
    setType("local");
    return file;
  };

  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const preprocessVideo = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  const handleSubmit = async () => {
    dispatch(resetPoiForensics());
    await submitUrl();
  };

  const resetState = () => {
    setInput("");
    setVideoFile(undefined);
    setType("");
    dispatch(resetPoiForensics());
  };

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_poiforensics")}
          description={keywordAllTools("navbar_poiforensics_description")}
          icon={
            <FaceRetouchingNatural
              style={{
                fill: "var(--mui-palette-primary-main)",
                height: "40px",
                width: "auto",
              }}
            />
          }
        />

        <Alert severity="warning">
          {keywordWarning("warning_beta_poiforensics")}
        </Alert>

        <Card variant="outlined">
          <Box
            sx={{
              p: 4,
            }}
          >
            <form>
              <StringFileUploadField
                labelKeyword={keyword("poiforensics_video_link")}
                placeholderKeyword={keyword("poiforensics_placeholder")}
                submitButtonKeyword={keyword("submit_button")}
                localFileKeyword={keyword("button_localfile")}
                urlInput={input}
                setUrlInput={setInput}
                fileInput={videoFile}
                setFileInput={setVideoFile}
                handleSubmit={handleSubmit}
                fileInputTypesAccepted={"video/*"}
                handleCloseSelectedFile={resetState}
                preprocessLocalFile={preprocessVideo}
                isParentLoading={isLoading}
                handleClearUrl={resetState}
              />
            </form>
            <Box
              sx={{
                m: 2,
              }}
            />
            <FormControl component="fieldset">
              <FormGroup row>
                {Object.entries(PERSON_OF_INTEREST).map(([index, poi]) => {
                  return (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={selectedPoi[poi.NAME_TOSEND] || false}
                          value={poi.NAME_TOSEND}
                          onChange={(e) => handleChangePoi(e)}
                          color="primary"
                        />
                      }
                      label={poi.DISPLAY_NAME}
                      labelPlacement="end"
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
};
export default PoiForensics;
