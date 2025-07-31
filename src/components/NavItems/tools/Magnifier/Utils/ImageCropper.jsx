import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

const TO_RADIANS = Math.PI / 180;
/**
 *
 * @param {*} image
 * @param {*} canvas
 * @param {*} crop
 * @param {*} scale
 * @param {*} rotate
 *
 * Function from react-image-crop doc
 * https://codesandbox.io/p/sandbox/react-image-crop-demo-with-react-hooks-y831o?file=%2Fsrc%2FApp.tsx%3A107%2C1
 */
export async function canvasPreview(
  image,
  canvas,
  crop,
  scale = 1,
  rotate = 0,
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();
}

const ImageCropper = ({
  imageCropperOpen,
  setImageCropperOpen,
  resultImage,
  keyword,
  setEditorImage,
  fileToDataUrl,
  dispatch,
  setMagnifierResult,
  original,
  setIsImageUrl,
}) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleClose = () => {
    setImageCropperOpen(false);
    setCrop();
    setCompletedCrop();
  };

  const handleSaveImage = async (editedFile) => {
    setEditorImage(editedFile);
    const data = await fileToDataUrl(editedFile);
    imgRef.current.src = data;
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

  async function onDownloadCropClick() {
    canvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      completedCrop,
      1,
      0,
    );
    const previewCanvas = previewCanvasRef.current;
    if (!completedCrop) return;

    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    let cropBlob = await offscreen.convertToBlob({
      type: "image/png",
    });
    let cropFile = new File([cropBlob], "croppedImage");
    await handleSaveImage(cropFile);
    setCrop();
    setCompletedCrop();
  }

  return (
    <>
      <Modal open={imageCropperOpen} onClose={() => handleClose()}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            m: 3,
          }}
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            minHeight={100}
            aspect={undefined}
          >
            <img
              ref={imgRef}
              src={resultImage}
              style={{ maxWidth: "100%", maxHeight: "600px" }}
              onLoad={(e) => (imgRef.current = e.currentTarget)}
            />
          </ReactCrop>
          {completedCrop && (
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
                hidden
              />
            </div>
          )}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              color="primary"
              variant="contained"
              onClick={() => onDownloadCropClick()}
            >
              {keyword("crop_save")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleClose()}
            >
              {keyword("crop_cancel")}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ImageCropper;
