import React from "react";

import Grid from "@mui/material/Grid";

import { ImageWithFade } from "@/components/NavItems/tools/Keyframes/components/ImageWithFade";

/**
 * Displays a grid of images with fade effect using Material UI Grid.
 *
 * @param images {ImagesFeature[]} Array of image feature objects
 * @param alt {string} Base alt text for images; the index is appended automatically.
 * @returns {Element}
 * @constructor
 */
const ImageGrid = ({ images, alt }) => {
  return (
    <Grid container direction="row" spacing={2}>
      {images.map((item, i) => (
        <Grid key={i} size={{ md: 3, lg: 1 }}>
          <ImageWithFade
            src={item.representative.imageUrl}
            alt={`${alt} #${i + 1}`}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGrid;
