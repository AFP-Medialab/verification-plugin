import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";

import { c2paCurrentImageIdSet } from "@/redux/reducers/tools/c2paReducer";

import C2PaCard from "../components/c2paCard";

/**
 * @param {Object} result - Object containing the parsed C2PA information
 * @param {boolean} hasSimilarAfpResult - whether a similar AFP result was found
 * @param {string} currentImage - optional override for currentImageId (bypasses Redux)
 * @param {string} mainImage - optional override for mainImageId (bypasses Redux)
 * @param {function} setCurrentImageId - optional Redux action override for navigation
 * @param {string} variant - "metadata" for full-width image, default for fixed width
 */
const C2paResults = ({
  result,
  hasSimilarAfpResult,
  currentImage,
  mainImage,
  setCurrentImageId,
  variant,
}) => {
  const currentImageId =
    currentImage || useSelector((state) => state.c2pa.currentImageId);
  const mainImageId =
    mainImage || useSelector((state) => state.c2pa.mainImageId);

  const url = result[currentImageId].url;
  const validationIssues = result[currentImageId].validationIssues;

  const [isImage, setIsImage] = useState(true);

  const dispatch = useDispatch();

  const setImage = (ingredientId) => {
    if (setCurrentImageId) {
      dispatch(setCurrentImageId(ingredientId));
    } else {
      dispatch(c2paCurrentImageIdSet(ingredientId));
    }
  };

  useEffect(() => {
    const testImage = new Image();
    testImage.src = url;
    testImage.onload = () => setIsImage(true);
    testImage.onerror = () => setIsImage(false);
  }, [url]);

  return (
    <>
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          p: 4,
        }}
        data-testid="c2pa-results"
      >
        <Grid
          container
          size={{ md: 12, lg: 6 }}
          sx={{
            justifyContent: "start",
          }}
        >
          {url && (
            <Grid data-testid="c2pa-results-source">
              {isImage ? (
                <img
                  src={url}
                  style={
                    variant === "metadata"
                      ? {
                          width: "100%",
                          maxHeight: "60vh",
                          borderRadius: "10px",
                        }
                      : {
                          width: 345,
                          borderRadius: "10px",
                        }
                  }
                />
              ) : (
                <video
                  style={
                    variant === "metadata"
                      ? {
                          width: "100%",
                          maxHeight: "60vh",
                          borderRadius: "10px",
                        }
                      : {
                          width: 345,
                          borderRadius: "10px",
                        }
                  }
                  controls
                  key={url}
                >
                  <source src={url} />
                </video>
              )}
            </Grid>
          )}
        </Grid>

        <Grid size={{ md: 12, lg: 6 }}>
          <C2PaCard
            result={result}
            currentImageId={currentImageId}
            mainImageId={mainImageId}
            onNavigate={setImage}
            validationIssues={validationIssues}
            hasSimilarAfpResult={hasSimilarAfpResult}
            isImage={isImage}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default C2paResults;
