import {useEffect, useState} from "react";

const useGenerateApiUrl = (serviceUrl, url, reprocess) => {
    const [finalUrl, setFinalUrl] = useState(undefined);
    const [facebookToken, setFacebookToken] = useState(null);
    const [showFacebookIframe, setFacebookIframe] = useState(false);

    useEffect(() => {
        function facebooktokenChange(e){
            if (e.origin === "https://mever.iti.gr") {
                setFacebookToken(e.data[1]);
                setFacebookIframe(false);
            }
        }
        window.addEventListener("message", facebooktokenChange);
        return () => {
            window.removeEventListener("message", facebooktokenChange);
        }
    }, [facebookToken]);

    useEffect(() => {
        if (!url || url === "") {
            setFinalUrl(undefined);
            setFacebookIframe(false);
            return;
        }

        let analysis_url = serviceUrl+"/jobs?url=" + url.replace("&", "%26");
        if (reprocess)
            analysis_url += "&reprocess=1";

        if (url && url.startsWith("https://www.facebook.com")) {
            if (facebookToken === null) {
                setFacebookIframe(true);
                return;
            }
            else {
                analysis_url += "&fb_access_token="+ facebookToken;
                setFacebookIframe(false);
                setFinalUrl(analysis_url);
            }
        }
        else{
            setFacebookIframe(false);
            setFinalUrl(analysis_url);
        }
        // eslint-disable-next-line
    }, [url, facebookToken, reprocess]);


    return [finalUrl, showFacebookIframe]
};
export default useGenerateApiUrl;