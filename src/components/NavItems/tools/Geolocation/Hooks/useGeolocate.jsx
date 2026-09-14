import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setError } from "@/redux/reducers/errorReducer";
import {
  setGeolocationLoading,
  setGeolocationResult,
} from "@/redux/reducers/tools/geolocationReducer";
import axios from "axios";

import {
  extractMetadataFromFile,
  extractMetadataFromUrl,
} from "../../Metadata/api/imageMetadataApi";

const caa_localtion_base_url = import.meta.env.VITE_CAA_LOCATION_URL;

export const handleError = (e, keyword, dispatch) => {
  if (keyword(e) !== "") dispatch(setError(keyword(e)));
  else dispatch(setError(keyword("please_give_a_correct_link")));
  dispatch(setGeolocationLoading(false));
};

export const useGeolocate = (url, processURL, keyword) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (processURL && url !== "") {
      dispatch(setGeolocationLoading(true));
      const fetchGeolocationData = async () => {
        try {
          const [geoResponse, metadataRaw] = await Promise.all([
            axios.get(
              `${caa_localtion_base_url}?image_url=${url}&use_gradcam=0`,
            ),
            extractMetadataFromUrl(url),
          ]);

          const gpsMetadata = metadataRaw
            ? filterMetadataToGetGeolocationMetadata(metadataRaw)
            : null;

          if (geoResponse.data != null) {
            dispatch(
              setGeolocationResult({
                urlImage: url,
                result: geoResponse.data.predictions,
                metadata: gpsMetadata,
                loading: false,
              }),
            );
          } else {
            handleError(
              `geo_error_${geoResponse.data?.status}`,
              keyword,
              dispatch,
            );
          }
        } catch (error) {
          handleError("geo_error_" + error.response.status, keyword, dispatch);
        }
      };
      fetchGeolocationData();
    }
  }, [processURL, url]);
};

export const geolocateLocalFile = async (file) => {
  if (!file) {
    throw new Error("File is missing");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const [metadataRaw, response] = await Promise.all([
      extractMetadataFromFile(file),
      fetch(caa_localtion_base_url, { method: "POST", body: formData }),
    ]);

    const gpsMetadata = metadataRaw
      ? filterMetadataToGetGeolocationMetadata(metadataRaw)
      : null;

    if (response.ok) {
      const data = await response.json();
      return { predictions: data.predictions, gpsMetadata };
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const filterMetadataToGetGeolocationMetadata = (metadata) => {
  if (!metadata.GPS?.longitude || !metadata.GPS?.latitude) {
    return null;
  }

  const latitude = metadata.GPS.latitude;
  const longitude = metadata.GPS.longitude;

  return { latitude: latitude, longitude: longitude };
};
