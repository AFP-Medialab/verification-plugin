import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { getBlob } from "@Shared/ReverseSearch/utils/searchUtils";
import { deepClone } from "@mui/x-data-grid/internals";

import { ROLES } from "../../../../../constants/roles";
import C2paCard from "./c2paCard";

const HdImageResults = ({ downloadHdImage, hdImage, hdImageC2paData }) => {
  const role = useSelector((state) => state.userSession.user.roles);
  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const [thumbnailImage, setThumbnailImage] = useState(null);

  const [resizedHdImageUrl, setResizedHdImageUrl] = useState(null);

  const [selectedImage, setSelectedImage] = useState(resizedHdImageUrl);

  const workerRef = useRef(null);

  const [processedC2paData, setProcessedC2paData] = useState(null);

  useEffect(() => {
    if (!hdImageC2paData) return;

    if (!resizedHdImageUrl) return;

    if (
      !hdImageC2paData ||
      !hdImageC2paData.result ||
      Object.keys(hdImageC2paData.result).length !== 2
    )
      return;

    let c2paDataWithResizedHdUrl = deepClone(hdImageC2paData);

    c2paDataWithResizedHdUrl.result[c2paDataWithResizedHdUrl.mainImageId].url =
      resizedHdImageUrl;

    setProcessedC2paData(c2paDataWithResizedHdUrl);
    setSelectedImage(resizedHdImageUrl);
  }, [hdImageC2paData, resizedHdImageUrl]);

  useEffect(() => {
    if (
      hdImageC2paData &&
      hdImageC2paData.result &&
      Object.keys(hdImageC2paData.result).length === 2
    ) {
      for (const image of Object.values(hdImageC2paData.result)) {
        if (image.parent !== null) {
          setThumbnailImage(image);
          return;
        }
      }
    }
  }, [hdImageC2paData]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@workers/resizeImageWorker", import.meta.url),
    );

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (!hdImage) return;

    getBlob(hdImage).then((blob) => {
      resizeImageWithWorker(blob.obj).then((resizedImage) => {
        setResizedHdImageUrl(URL.createObjectURL(resizedImage));
      });
    });
  }, [hdImage]);

  /**
   *
   * @param image
   */
  const resizeImageWithWorker = (image) => {
    return new Promise((resolve, reject) => {
      const workerInstance = new Worker(
        new URL("@workers/resizeImageWorker", import.meta.url),
      );
      workerInstance.postMessage(image);

      workerInstance.onerror = function (e) {
        reject(e.error);
      };

      workerInstance.onmessage = function (e) {
        resolve(e.data);
      };
    });
  };

  const handleImageCardClick = (image) => {
    if (image === hdImage) setSelectedImage(resizedHdImageUrl);
    else setSelectedImage(image);
  };

  const ImageCard = (src, alt, legend, isSelected) => {
    return (
      <Card
        variant="outlined"
        sx={{
          width: 345,
          border: isSelected
            ? "3px solid #00926c"
            : "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <CardActionArea onClick={() => handleImageCardClick(src)}>
          <CardMedia component="img" image={src} alt={alt} />
          <CardContent>
            <Typography
              gutterBottom
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              {legend}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Stack direction="row" spacing={4}>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Grid
          container
          direction="row"
          spacing={4}
          sx={{
            p: 4,
            width: "100%",
          }}
        >
          <Alert severity="info">
            <Typography variant="body2">
              {
                "To protect the image, an invisible watermark is embedded. This change is automatically recorded in the C2PA history below."
              }
            </Typography>
            <Typography variant="body2">
              {"Two thumbnails are displayed:"}
            </Typography>
            <Box>
              <ul>
                <li>
                  {
                    "The first thumbnail is the original thumbnail which comes from the camera."
                  }
                </li>
                <li>{"The second thumbnail is the watermarked image."}</li>
              </ul>
            </Box>
          </Alert>

          <Grid
            container
            direction="column"
            size={{ md: 12, lg: 6 }}
            spacing={4}
            sx={{
              alignItems: "start",
            }}
          >
            {ImageCard(
              // hdImage,
              resizedHdImageUrl,
              "AFP HD Image",
              keyword("reverse_search_results_hd_afp_label"),
              selectedImage === resizedHdImageUrl,
            )}

            <Divider orientation="vertical" flexItem sx={{ width: "100%" }} />

            {thumbnailImage &&
              thumbnailImage.url &&
              thumbnailImage.url.length > 0 &&
              ImageCard(
                thumbnailImage.url,
                "Original image from Camera",
                keyword("reverse_search_results_hd_camera_label"),
                selectedImage === thumbnailImage.url,
              )}
          </Grid>
          <Grid
            container
            direction="column"
            size={{ md: 12, lg: 6 }}
            spacing={2}
          >
            <Alert severity="info" sx={{ width: "fit-content" }}>
              {keyword("afp_produced_image_info")}
            </Alert>

            {hdImage &&
              (role.includes(ROLES.AFP_C2PA_GOLD) ||
                role.includes(ROLES.EXTRA_FEATURE)) && (
                <Grid>
                  <Button variant="contained" onClick={downloadHdImage}>
                    {keyword("reverse_search_original_image_download_button")}
                  </Button>
                </Grid>
              )}

            {processedC2paData && resizedHdImageUrl && (
              <C2paCard
                c2paData={processedC2paData}
                currentImageSrc={selectedImage}
                setCurrentImageSrc={setSelectedImage}
                resizedImageUrl={resizedHdImageUrl}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default HdImageResults;
