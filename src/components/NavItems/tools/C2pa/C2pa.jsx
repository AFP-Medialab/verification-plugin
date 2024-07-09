import { Box, Card, CardHeader, Grid } from "@mui/material";
import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import { useState } from "react";

const C2paData = () => {
  const [input, setInput] = useState();
  const [imageFile, setImageFile] = useState();
  const handleClose = () => null;
  const preprocessImage = (image) => image;
  const handleSubmit = () => null;
  const classes = useMyStyles();

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
