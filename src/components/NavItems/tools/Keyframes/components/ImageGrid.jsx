import React from "react";

import Grid from "@mui/material/Grid";

import { ImageWithFade } from "@/components/NavItems/tools/Keyframes/components/ImageWithFade";

/**
 * Displays a grid of images with fade effect using Material UI Grid.
 *
 * @param images {ImagesFeature[] | Keyframe[]} Array of image feature objects
 * @param alt {string} Base alt text for images; the index is appended automatically.
 * @param getImageUrl {function(item: ImagesFeature | Keyframe): string} A function that returns the image URL
 * @param nbOfCols {?number} Set a custom number of rows
 * @returns {Element}
 * @constructor
 */
const ImageGrid = ({ images, alt, getImageUrl, nbOfCols }) => {
  const colSize = nbOfCols ? Math.floor(12 / nbOfCols) : null;

  return (
    <Grid container direction="row" spacing={2}>
      {images.map((item, i) => (
        <Grid
          key={i}
          size={
            nbOfCols
              ? {
                  xs: colSize,
                  sm: colSize,
                  md: colSize,
                  lg: colSize,
                  xl: colSize,
                }
              : { md: 3, lg: 1 }
          }
        >
          <ImageWithFade src={getImageUrl(item)} alt={`${alt} #${i + 1}`} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGrid;
