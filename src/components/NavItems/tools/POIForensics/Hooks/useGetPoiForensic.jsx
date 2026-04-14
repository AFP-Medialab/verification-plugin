import {
  setPoiForensicsLoading,
  setPoiForensicsResult,
} from "@/redux/actions/tools/poiForensicsActions";
import { setError } from "@/redux/reducers/errorReducer";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import axios from "axios";

async function useGetPoiForensics(
  selectedPoi,
  keyword,
  url,
  processURL,
  dispatch,
  role,
  errorMsg,
  type,
  mediaFile,
) {
  if (!processURL || (!url && !mediaFile)) {
    return;
  }

  console.log("selected poi :", selectedPoi);
  console.log("url :", url);
}

export default useGetPoiForensics;
