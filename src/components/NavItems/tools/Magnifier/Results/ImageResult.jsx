import React, { createRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";

import CloseIcon from "@mui/icons-material/Close";

import { setMagnifierResult } from "@/redux/actions/tools/magnifierActions";
import { reverseImageSearch } from "@Shared/ReverseSearch/reverseSearchUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { ReverseSearchButtons } from "components/Shared/ReverseSearch/ReverseSearchButtons";
import "tui-image-editor/dist/tui-image-editor.css";

import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import ImageEditor from "../Utils/ImageEditor";
import Loop from "./Loop";

const myTheme = {
  "loadButton.backgroundColor": "#151515",
  "loadButton.border": "0px",
  "loadButton.color": "#151515",
  "loadButton.fontFamily": "NotoSans, sans-serif",
  "loadButton.fontSize": "0px",

  "downloadButton.backgroundColor": "#151515",
  "downloadButton.border": "0px",
  "downloadButton.color": "#151515",
  "downloadButton.fontFamily": "NotoSans, sans-serif",
  "downloadButton.fontSize": "0px",

  "menu.backgroundColor": "white",
  "common.backgroundColor": "#151515",
  //"menu.normalIcon.path": icond,
  //"menu.activeIcon.path": iconb,
  //"menu.disabledIcon.path": icona,
  //"menu.hoverIcon.path": iconc,

  // submenu icons
  //'submenu.normalIcon.path': icona,
  "submenu.normalIcon.name": "icon-a",
  //'submenu.activeIcon.path': iconc,
  "submenu.activeIcon.name": "icon-c",
  "submenu.iconSize.width": "64px",
  "submenu.iconSize.height": "64px",

  // submenu labels
  "submenu.normalLabel.color": "#fff",
  "submenu.normalLabel.fontWeight": "bold",
  "submenu.activeLabel.color": "var(--mui-palette-text-secondary)",
  "submenu.activeLabel.fontWeight": "bold",
};

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

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (imageEditor !== null && imageEditor.current !== null) {
      const imageEditorInst = imageEditor.current;
      imageEditorInst
        .loadImageFromURL(resultImage, "image")
        .catch((error) => console.error(error));
    }
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
            <IconButton aria-label="close" onClick={handleCloseResults}>
              <CloseIcon />
            </IconButton>
          }
        />
        <div className={classes.root2}>
          <Modal
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
                  includeUI={{
                    loadImage: {
                      path: resultImage,
                      name: "SampleImage",
                    },
                    theme: myTheme,
                    menu: ["crop", "flip", "rotate", "filter"],
                    initMenu: "",
                    uiSize: {
                      height: `calc(100vh - 160px)`,
                    },
                    menuBarPosition: "bottom",
                  }}
                  cssMaxHeight={window.innerHeight * 0.8}
                  cssMaxWidth={window.innerWidth * 0.8}
                  selectionStyle={{
                    cornerSize: 20,
                    rotatingPointOffset: 70,
                  }}
                  usageStatistics={false}
                  ref={imageEditor}
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
          </Modal>

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
