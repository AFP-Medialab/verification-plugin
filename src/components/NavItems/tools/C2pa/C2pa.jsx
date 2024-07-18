import { Box, Card, CardHeader, Grid, LinearProgress } from "@mui/material";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import { useEffect, useState } from "react";
import getC2paData, { readManifest } from "./Hooks/useGetC2paData";
import { useDispatch, useSelector } from "react-redux";
import C2paResults from "./Results/C2paResults";
import {
  c2paCurrentImageIdSet,
  c2paStateCleaned,
} from "redux/reducers/tools/c2paReducer";

const C2paData = () => {
  const isLoading = useSelector((state) => state.c2pa.loading);
  const result = useSelector((state) => state.c2pa.result);

  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(undefined);

  const dispatch = useDispatch();

  const classes = useMyStyles();

  const handleSubmit = () => {
    if (imageFile) {
      dispatch(c2paStateCleaned());
      getC2paData(imageFile, dispatch);
    }
  };

  const handleClose = () => {
    setImageFile(undefined);
    dispatch(c2paStateCleaned());
  };

  return (
    <Box>
      <HeaderTool name={"C2pa data"} description={"c2pa description"} />
      <Card>
        <CardHeader
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{"C2pa data"}</span>
            </Grid>
          }
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
          <form>
            <StringFileUploadField
              labelKeyword={""}
              placeholderKeyword={""}
              submitButtonKeyword={"submit"}
              localFileKeyword={"local file"}
              urlInput={input}
              setUrlInput={setInput}
              fileInput={imageFile}
              setFileInput={setImageFile}
              handleSubmit={handleSubmit}
              fileInputTypesAccepted={"image/*"}
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
