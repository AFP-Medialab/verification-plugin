import React, { useState } from "react";
import { ReactPhotoEditor } from "react-photo-editor";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

import { setMagnifierResult } from "@/redux/actions/tools/magnifierActions";
import { reverseImageSearch } from "@Shared/ReverseSearch/reverseSearchUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { ReverseSearchButtons } from "components/Shared/ReverseSearch/ReverseSearchButtons";

import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import ImageCropper from "../Utils/ImageCropper";
import Loop from "./Loop";

const ImageResult = ({ handleCloseResults }) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Magnifier");

  const original = useSelector((state) => state.magnifier.url);
  const resultImage = useSelector((state) => state.magnifier.result);

  const dispatch = useDispatch();

  const [isImageUrl, setIsImageUrl] = useState(
    original.startsWith("http:") || original.startsWith("https:"),
  );

  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result); // base64 data URL
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleSaveImage = async (editedFile) => {
    setEditorImage(editedFile);
    const data = await fileToDataUrl(editedFile);
    dispatch(
      setMagnifierResult({
        url: original,
        result: data,
        notification: false,
        loading: false,
      }),
    );
    setIsImageUrl(false);
  };

  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]); // base64 decode
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const [editorImage, setEditorImage] = useState(dataURLtoFile(resultImage));

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setEditorImage(dataURLtoFile(resultImage, "imageName"));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getDownloadLink = (image) => {
    let image_name = image.substring(image.lastIndexOf("/") + 1);
    return image_name.substring(0, image_name.lastIndexOf("."));
  };

  const reverseSearch = (searchEngineName) => {
    reverseImageSearch(
      isImageUrl ? original : resultImage,
      searchEngineName,
      false,
    );
  };

  const [imageCropperOpen, setImageCropperOpen] = useState(false);

  return (
    <Card variant="outlined">
      <Box
        sx={{
          m: 2,
        }}
      >
        <CardHeader
          title={keyword("cardheader_results")}
          className={classes.headerUploadedImage}
          action={
            <IconButton
              aria-label="close"
              onClick={handleCloseResults}
              sx={{ p: 1 }}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <div className={classes.root2}>
          <ReactPhotoEditor
            open={open}
            onClose={handleClose}
            onSaveImage={async (editedFile) =>
              await handleSaveImage(editedFile)
            }
            file={editorImage}
          />
          <ImageCropper
            imageCropperOpen={imageCropperOpen}
            setImageCropperOpen={setImageCropperOpen}
            resultImage={resultImage}
            keyword={keyword}
            setEditorImage={setEditorImage}
            fileToDataUrl={fileToDataUrl}
            dispatch={dispatch}
            setMagnifierResult={setMagnifierResult}
            original={original}
            setIsImageUrl={setIsImageUrl}
          />

          <Box
            sx={{
              m: 1,
            }}
          />
          <Grid
            container
            direction="row"
            spacing={3}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid>
              <Button color="primary" variant="contained" onClick={handleOpen}>
                {keyword("edit_image")}
              </Button>
            </Grid>
            <Grid>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  setImageCropperOpen(true);
                }}
              >
                {keyword("crop_image")}
              </Button>
            </Grid>
            <Grid>
              <a
                style={{ textDecoration: "none" }}
                href={resultImage}
                download={getDownloadLink(resultImage)}
              >
                <Button color="primary" variant="contained">
                  {keyword("download")}
                </Button>
              </a>
            </Grid>
          </Grid>
          <Box
            sx={{
              m: 2,
            }}
          />
          <Loop src={resultImage} />
          <Box
            sx={{
              m: 2,
            }}
          />
          <ReverseSearchButtons
            isimageUrl={isImageUrl}
            reverseSearch={reverseSearch}
          >
            <></>
          </ReverseSearchButtons>
        </div>
      </Box>
    </Card>
  );
};
export default ImageResult;
