import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";
import { ROLES } from "../../../../../constants/roles";
import C2paCard from "./c2paCard";
import CardMedia from "@mui/material/CardMedia";

const HdImageResults = ({ downloadHdImage, hdImage, hdImageC2paData }) => {
  const role = useSelector((state) => state.userSession.user.roles);
  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const [thumbnailImage, setThumbnailImage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(hdImage);

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

  const handleImageCardClick = (image) => {
    setSelectedImage(image);
  };

  const ImageCard = (src, alt, legend, isSelected) => {
    return (
      <Card
        variant="outlined"
        sx={{
          maxWidth: 345,
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
      <Box width="100%">
        <Grid2 container direction="row" spacing={2} p={4} width="100%">
          <Grid2
            container
            direction="column"
            size={{ xs: 6 }}
            spacing={4}
            alignItems="center"
          >
            {ImageCard(
              hdImage,
              "AFP HD Image",
              "AFP C2PA Image",
              selectedImage === hdImage,
            )}

            <Divider orientation="vertical" flexItem sx={{ width: "100%" }} />

            {thumbnailImage &&
              thumbnailImage.url &&
              ImageCard(
                thumbnailImage.url,
                "Original image from Camera",
                "Original image from Camera",
                selectedImage === thumbnailImage.url,
              )}
          </Grid2>
          <Grid2 container direction="column" size={{ xs: 6 }} spacing={2}>
            <Alert severity="info" sx={{ width: "fit-content" }}>
              {keyword("afp_produced_image_info")}
            </Alert>

            {hdImage &&
              (role.includes(ROLES.AFP_C2PA_GOLD) ||
                role.includes(ROLES.EXTRA_FEATURE)) && (
                <Grid2>
                  <Button
                    variant="contained"
                    onClick={downloadHdImage}
                    sx={{ textTransform: "none" }}
                  >
                    {keyword("reverse_search_original_image_download_button")}
                  </Button>
                </Grid2>
              )}

            {hdImageC2paData && (
              <C2paCard
                c2paData={hdImageC2paData}
                currentImageSrc={selectedImage}
                setCurrentImageSrc={setSelectedImage}
              />
            )}
          </Grid2>
        </Grid2>
      </Box>
    </Stack>
  );
};

export default HdImageResults;
