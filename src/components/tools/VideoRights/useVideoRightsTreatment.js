import {useEffect, useState} from "react";
import axios from "axios";
import * as querystring from "querystring";

const useVideoRightsTreatment = (url) => {

    const [result, setResult] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (url && url !== "" && url !== undefined) {
            let api_url = "https://rights-api.invid.udl.cat/";
            if (url.startsWith("https://www.youtube.com/"))
                api_url += "youTubeVideos";
            else if (url.startsWith("https://www.facebook.com/"))
                api_url += "facebookVideos";
            else if (url.startsWith("https://twitter.com/"))
                api_url += "twitterVideos";
            else {
                setErrors("table_error_unavailable");
                return;
            }

            axios.post(api_url, {"url" : url},  {headers: {ContentType: 'application/json'}})
                .then(response => {
                    console.log(response)
                })
                .catch(errors => {
                    console.log(errors);
                    setLoading(false);
                });
        }
    }, [url]);
    return [result, isLoading, errors];
};
export default useVideoRightsTreatment