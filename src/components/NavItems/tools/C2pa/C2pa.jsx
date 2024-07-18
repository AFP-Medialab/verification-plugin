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
  const [isIngredient, setIsIngredient] = useState(false);
  const result = useSelector((state) => state.c2pa.result);
  const currentImageId = useSelector((state) => state.c2pa.currentImageId);
  const mainImageId = useSelector((state) => state.c2pa.mainImageId);
  const url = useSelector((state) => state.c2pa.url);
  const [displayResult, setDisplayResult] = useState();
  const [displayUrl, setDisplayUrl] = useState();
  const currentManifest = useSelector((state) => state.c2pa.currentManifest);

  const ingredientResult = useSelector((state) => state.c2pa.ingredientResult);

  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(undefined);

  const dispatch = useDispatch();

  const classes = useMyStyles();

  //   const loadImage = (sampleImage) => {

  //     try {
  //         const { manifestStore } = await c2pa.read(sampleImage);
  //         console.log('manifestStore', manifestStore);
  //       } catch (err) {
  //         console.error('Error reading image:', err);
  //       }
  //   }
  const handleSubmit = () => {
    if (imageFile) {
      dispatch(c2paStateCleaned());
      getC2paData(imageFile, dispatch);
    }
  };

  const openIngredient = (ingredientId) => {
    //const ingredientResult = readManifest(ingredient.manifest);

    // dispatch(c2paIngredientResultsCleaned());
    // dispatch(c2paIngredientResultsSet({result: ingredient.manifest, url: ingredient.url}));
    //dispatch(c2paCurrentManifestSet({result: ingredient.manifest, url: ingredient.url}));
    //setDisplayUrl(ingredient.url);
    dispatch(c2paCurrentImageIdSet(ingredientId));
    setIsIngredient(true);
  };

  const handleClose = () => {
    setImageFile(undefined);
    setIsIngredient(false);
    dispatch(c2paStateCleaned());
  };

  const returnToMain = () => {
    // dispatch(c2paCurrentManifestSet({result: result, url: url}));
    dispatch(c2paCurrentImageIdSet(mainImageId));
    setIsIngredient(false);
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
      {result && (
        <C2paResults
          result={result}
          handleClose={handleClose}
          openIngredient={openIngredient}
          isIngredient={isIngredient}
          returnToMain={returnToMain}
        />
      )}
    </Box>
  );
};

export default C2paData;
