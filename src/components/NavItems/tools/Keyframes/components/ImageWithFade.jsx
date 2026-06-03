import React, { useState } from "react";

import Fade from "@mui/material/Fade";
import Skeleton from "@mui/material/Skeleton";

/**
 * A component that displays a skeleton while the image is loading
 * and then fades in the image after it loaded
 *
 * @param src {string} The src of the image
 * @param alt {string} The alt of the image
 * @returns {Element}
 * @constructor
 */
export const ImageWithFade = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Debug logging (remove in production)
  // console.log(`ImageWithFade: src=${src}, alt=${alt}, loaded=${loaded}, error=${error}`);

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: 100,
          backgroundColor: "#ffebee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c62828",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        Image failed to load:
        <br />
        {src?.substring(0, 50)}...
      </div>
    );
  }

  if (!loaded) {
    return (
      <>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <img
          src={src}
          alt={alt}
          onLoad={() => {
            // console.log(`Image loaded successfully: ${src}`);
            setLoaded(true);
          }}
          onError={(e) => {
            console.error(`Image failed to load: ${src}`, e);
            setError(true);
          }}
          style={{
            display: "none", // Hidden while loading
          }}
        />
      </>
    );
  }

  // Image has loaded successfully
  return (
    <Fade in={true} timeout={500}>
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          display: "block",
        }}
      />
    </Fade>
  );
};
