import { Box, Card, CardHeader, Grid, LinearProgress } from "@mui/material";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import { useState } from "react";
import getC2paData from "./Hooks/useGetC2paData";
import { useDispatch, useSelector } from "react-redux";
import C2paResults from "./Results/C2paResults";
import { c2paStateCleaned } from "redux/reducers/tools/c2paReducer";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const C2paData = () => {
  const isLoading = useSelector((state) => state.c2pa.loading);
  const result = useSelector((state) => state.c2pa.result);

  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(undefined);

  const dispatch = useDispatch();

  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const handleSubmit = () => {
    dispatch(c2paStateCleaned());

    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      getC2paData(url, dispatch);
    } else if (input) {
      getC2paData(input, dispatch);
    }
  };

  const handleClose = () => {
    setImageFile(undefined);
    setInput("");
    dispatch(c2paStateCleaned());
  };

  return (
    <Box>
      <HeaderTool
        name={keyword("c2pa_title")}
        description={keyword("c2pa_description")}
      />
      <Card>
        <CardHeader
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("image_link")}</span>
            </Grid>
          }
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
          <form>
            <StringFileUploadField
              labelKeyword={keyword("image_link")}
              placeholderKeyword={keyword("placeholder")}
              submitButtonKeyword={keyword("submit_button")}
              localFileKeyword={keyword("button_localfile")}
              urlInput={input}
              setUrlInput={setInput}
              fileInput={imageFile}
              setFileInput={setImageFile}
              handleSubmit={handleSubmit}
              fileInputTypesAccepted={"image/*, video/*"}
              handleCloseSelectedFile={handleClose}
            />
          </form>
        </Box>

        <Box m={2} />
        {isLoading && (
          <Box mt={3}>
            <LinearProgress />
          </Box>
        )}
      </Card>
      <Box m={3} />
      {result && <C2paResults result={result} handleClose={handleClose} />}
    </Box>
  );
};

export default C2paData;
