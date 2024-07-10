import { Box, Card, CardHeader, Grid } from "@mui/material";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import { useEffect, useState } from "react";
import getC2paData from "./Hooks/useGetC2paData";

const C2paData = () => {
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(undefined);
  const handleClose = () => null;
  const preprocessImage = (image) => image;

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
      getC2paData(imageFile);
    }
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
              preprocessLocalFile={preprocessImage}
            />
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default C2paData;
