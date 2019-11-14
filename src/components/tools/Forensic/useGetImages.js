import {useEffect, useState} from "react";
import axios from "axios"
import imagetracer from "tui-image-editor/src/js/helper/imagetracer";

const useGetImages = (url) => {
    const [result, setResult] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErros] = useState(null);

    useEffect(() => {

        const getResult = (hash) => {
            axios.get("https://reveal-mklab.iti.gr/"+ "imageforensicsv3/getreport?hash=" + hash)
                .then(response => {
                    if (response.data.status === "completed") {
                        setResult(response.data);
                        setLoading(false);
                    }
                    else {
                        setErros("forensic_error_" + response.data.status);
                        setLoading(false)
                    }
                })
                .catch(error => {
                    setErros("forensic_error_" + error.status);
                    setLoading(false)
                })
        };

        const waitUntilFinish = (hash) => {
            axios.get("https://reveal-mklab.iti.gr/" + "imageforensicsv3/generatereport?hash=" + hash)
                .then ((response) => {
                    if (response.data.status === "processing") {
                        setTimeout(function () {
                            waitUntilFinish(hash);
                        }, 2000);
                    } else if (response.data.status === "completed") {
                        getResult(response.data.hash);
                    } else {
                        setErros("forensic_error_" + response.data.status);
                        setLoading(false)
                    }
                })
                .catch(error => {
                    setErros("forensic_error_" + error.status);
                    setLoading(false)
                })
        };


        const newForensicRequest = (data) => {
            if (data.status === "downloaded")
                waitUntilFinish(data.hash);
            else if (data.status === "exist")
                getResult(data.hash);
            else {
                setErros("forensic_error_" + data.status);
                setLoading(false);
            }
        };

        if (url) {
            setLoading(true);
            axios.get("https://reveal-mklab.iti.gr/" + "imageforensicsv3/addurl?url=" + encodeURIComponent(url))
                .then(response => newForensicRequest(response.data))
                .catch(error => {
                    setErros("forensic_error_" + error.status);
                    setLoading(false);
                })
        }
    }, [url]);
    return [result, isLoading, errors]
};
export default useGetImages;