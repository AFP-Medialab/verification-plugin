import React from "react";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";

import { ImageWithFade } from "@/components/NavItems/tools/Keyframes/components/ImageWithFade";

/**
 * Image grid with fade-in effect using MUI Grid and Card.
 *
 * @param {Array<ImagesFeature|Keyframe>} images - List of image items.
 * @param {string} alt - Base alt text; the index is appended automatically.
 * @param {(item: ImagesFeature|Keyframe) => string} getImageUrl - Function that returns the image URL.
 * @param {?number} nbOfCols - Optional fixed number of columns.
 * @param {?function(string): void} onClick - Optional click handler; receives the image src URL as a string.
 * @returns {JSX.Element}
 */
const ImageGrid = ({ images, alt, getImageUrl, nbOfCols, onClick }) => {
  return (
    <Grid container direction="row" spacing={2}>
      {images.map((item, i) => (
        <Grid
          key={i}
          size={
            nbOfCols
              ? {
                  xs: nbOfCols,
                  sm: nbOfCols,
                  md: nbOfCols,
                  lg: nbOfCols,
                  xl: nbOfCols,
                }
              : { md: 3, lg: 1 }
          }
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: "0px !important",
            }}
          >
            {onClick ? (
              <CardActionArea onClick={() => onClick(getImageUrl(item))}>
                <ImageWithFade
                  src={getImageUrl(item)}
                  alt={`${alt} #${i + 1}`}
                />
              </CardActionArea>
            ) : (
              <ImageWithFade src={getImageUrl(item)} alt={`${alt} #${i + 1}`} />
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGrid;
