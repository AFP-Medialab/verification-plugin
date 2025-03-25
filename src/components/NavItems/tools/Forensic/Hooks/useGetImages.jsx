import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { setError } from "redux/reducers/errorReducer";

import {
  setForensicDisplayItem,
  setForensicsLoading,
  setForensicsResult,
} from "../../../../../redux/actions/tools/forensicActions";

const useGetImages = async (url, type, keyword) => {
  const forensic_base_url = process.env.REACT_APP_CAA_FORENSICS_URL;

  const link2dataURL = async (imgLink) => {
    let resp = await fetch(imgLink);
    let blob = await resp.blob();
    let read = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    return read;
  };

  const transformObjectLinks = async (obj) => {
    const ret = await Promise.all(
      Object.entries(obj).map(async ([k, v]) => {
        if (v == null) {
          return [k, v];
        }
        if (
          Array.isArray(v) &&
          typeof v[0] == "string" &&
          v[0].includes("http")
        ) {
          let links = await Promise.all(
            v.map(async (l) => await link2dataURL(l)),
          );
          return [k, links];
        }
        if (!Array.isArray(v) && typeof v == "object") {
          let nestedObj = await transformObjectLinks(v);
          return [k, nestedObj];
        }
        if (typeof v == "string" && v.includes("http")) {
          let link = await link2dataURL(v);
          return [k, link];
        } else {
          return [k, v];
        }
      }),
    );
    return Object.fromEntries(ret);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const handleError = (e) => {
      //console.log("error key", e)
      if (keyword(e) !== "") dispatch(setError(keyword(e)));
      else dispatch(setError(keyword("please_give_a_correct_link")));
      dispatch(setForensicsLoading(false));
    };

    const getResult = async (reportId) => {
      axios
        .get(forensic_base_url + "images/reports/" + reportId)
        .then(async (response) => {
          if (response.data != null) {
            const results = Object.entries(response.data).slice(3);
            const intro = Object.entries(response.data).slice(0, 3);
            const noLinks = await Promise.all(
              results.map(async (x) => [
                x[0],
                await transformObjectLinks(x[1]),
              ]),
            );
            const concat = Object.assign(
              {},
              Object.fromEntries(intro),
              Object.fromEntries(noLinks),
            );

            dispatch(
              setForensicsResult({
                url: type === "local" ? response.data.displayItem : url,
                result: concat,
                notification: false,
                loading: false,
                gifAnimation: false,
              }),
            );
          } else {
            handleError("forensic_error_" + response.data.status);
          }
        })
        .catch((error) => {
          //console.log("ERROR 1");
          handleError("forensic_error_" + error.status);
        });
    };

    const waitUntilFinish = (id) => {
      axios
        .get(forensic_base_url + "images/jobs/" + id)
        .then((response) => {
          if (response.data.status === "PROCESSING") {
            setTimeout(function () {
              waitUntilFinish(id);
            }, 3000);
          } else if (response.data.status === "COMPLETED") {
            getResult(response.data.itemHash);
            dispatch(
              setForensicDisplayItem(
                type === "local" ? response.data.displayItem : url,
              ),
            );
            //getResult(id);
          } else {
            handleError("forensic_error_" + response.data.status);
          }
        })
        .catch((error) => {
          handleError("forensic_error_" + error.status);
        });
    };

    const configService = (type) => {
      const services =
        "adq1,blk,cagi,cfa,cmfd,dct,ela,fusion,ghost,laplacian,mantranet,median,rcmfd,splicebuster,wavelet,zero,mmfusion,trufor,omgfuser";

      let bodyFormData;

      switch (type) {
        case "local":
          bodyFormData = new FormData();
          bodyFormData.append("file", url);

          return {
            method: "post",
            url: forensic_base_url + "images/jobs?services=" + services,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
        case "url":
          return {
            method: "post",
            url:
              forensic_base_url +
              "images/jobs?url=" +
              encodeURIComponent(url) +
              "&services=" +
              services,
          };
        default:
          break;
      }
    };

    if (url) {
      dispatch(setForensicsLoading(true));

      axios(configService(type))
        .then((response) => waitUntilFinish(response.data.id))
        .catch((error) => {
          let httpStatus = error.response.status;
          //console.log("error status", httpStatus)
          switch (httpStatus) {
            case 400:
              if (error.response.data) {
                let errorCode = error.response.data.error;
                handleError("forensic_error_" + errorCode.toLowerCase());
              } else handleError("forensic_error_" + httpStatus);
              break;
            default:
              handleError("forensic_error_" + httpStatus);
          }
        });
    }
  }, [url]);
};
export default useGetImages;
