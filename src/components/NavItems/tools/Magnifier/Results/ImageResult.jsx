import React, { createRef, useState } from "react";
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
import Loop from "./Loop";

const ImageResult = ({ handleCloseResults }) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Magnifier");

  const original = useSelector((state) => state.magnifier.url);
  const resultImage = useSelector((state) => state.magnifier.result);

  const dispatch = useDispatch();
  const imageEditor = createRef();

  const [isImageUrl, setIsImageUrl] = useState(
    original.startsWith("http:") || original.startsWith("https:"),
  );

  const updateImage = () => {
    const imageEditorInst = imageEditor.current;
    const data = imageEditorInst.toDataURL();
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
    if (imageEditor !== undefined && imageEditor !== null) {
      updateImage();
    }
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

  console.log(editorImage);

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
            onClose={() => setOpen(false)}
            file={editorImage}
          />
          {/* <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{
              backdrop: Backdrop,
            }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <ImageEditor
                  image={resultImage}
                />
                <Box
                  sx={{
                    m: 1,
                  }}
                />

                <div className={classes.modalButton}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpen(false)}
                  >
                    {keyword("quit")}
                  </Button>
                  <div className={classes.grow} />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                  >
                    {keyword("save")}
                  </Button>
                </div>
              </div>
            </Fade>
          </Modal> */}

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
