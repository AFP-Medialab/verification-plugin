import React, { useState } from "react";

import Fade from "@mui/material/Fade";
import Skeleton from "@mui/material/Skeleton";

/**
 * A component that displays a skeleton while the image is loading
 * and then fades in the image after it loaded
 *
 * @param src {The src of the image}
 * @param alt {The alt of the image}
 * @returns {Element}
 * @constructor
 */
export const ImageWithFade = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton variant="rectangular" width="100%" height={100} />}
      <Fade in={loaded} timeout={500}>
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            display: loaded ? "block" : "none",
          }}
        />
      </Fade>
    </>
  );
};
