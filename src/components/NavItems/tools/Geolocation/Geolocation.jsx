import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import StringFileUploadField from "@Shared/StringFileUploadField";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { imageGeolocation } from "../../../../constants/tools";
import {
  resetGeolocation,
  setGeolocationLoading,
  setGeolocationResult,
} from "../../../../redux/reducers/tools/geolocationReducer";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import {
  geolocateLocalFile,
  handleError,
  useGeolocate,
} from "./Hooks/useGeolocate";
import GeolocationResults from "./Results/GeolocationResults";

const Geolocation = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Geolocalizer");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");
  const dispatch = useDispatch();

  const result = useSelector((state) => state.geolocation.result);
  const urlImage = useSelector((state) => state.geolocation.urlImage);
  const isLoading = useSelector((state) => state.geolocation.loading);
  const [processUrl, setProcessUrl] = useState(false);
  const [input, setInput] = useState(urlImage ? urlImage : "");
  const [imageFile, setImageFile] = useState(null);

  const submitUrl = () => {
    setProcessUrl(true);
  };

  useGeolocate(input, processUrl, keyword);

  const handleSubmit = async () => {
    dispatch(setGeolocationLoading(true));
    if (input) {
      submitUrl();
    } else if (imageFile) {
      try {
        const prediction = (await geolocateLocalFile(imageFile)).predictions;
        dispatch(
          setGeolocationResult({
            urlImage: URL.createObjectURL(imageFile),
            result: prediction,
            loading: false,
          }),
        );
      } catch (error) {
        handleError(error, keyword, dispatch);
        dispatch(setGeolocationLoading(false));
      }
    }
  };

  const handleClose = () => {
    setImageFile(null);
    dispatch(resetGeolocation());
    setInput("");
  };

  return (
    <Box>
      <Stack direction={"column"} spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_geolocation")}
          description={keywordAllTools("navbar_geolocation_description")}
          icon={
            <imageGeolocation.icon sx={{ fill: "#00926c", fontSize: "40px" }} />
          }
        />
        <Alert severity="warning">{keywordWarning("warning_beta")}</Alert>
        <Card variant="outlined">
          <Box p={4}>
            <form>
              <StringFileUploadField
                labelKeyword={keyword("geo_link")}
                placeholderKeyword={keyword("geo_paste")}
                submitButtonKeyword={keyword("geo_submit")}
                localFileKeyword={keyword("button_localfile")}
                urlInput={input}
                setUrlInput={setInput}
                fileInput={imageFile}
                setFileInput={setImageFile}
                handleSubmit={handleSubmit}
                fileInputTypesAccepted={"image/*"}
                handleCloseSelectedFile={handleClose}
                isParentLoading={isLoading}
              />
            </form>
          </Box>
          {isLoading && <LinearProgress />}
        </Card>
        {result && !isLoading && (
          <GeolocationResults result={result} urlImage={urlImage} />
        )}
      </Stack>
    </Box>
  );
};
export default Geolocation;
