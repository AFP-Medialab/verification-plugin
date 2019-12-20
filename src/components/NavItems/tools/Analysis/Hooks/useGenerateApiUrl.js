import {useEffect, useState} from "react";

const useGenerateApiUrl = (url, reprocess) => {
    const [finalUrl, setFinalUrl] = useState(undefined);
    const [facebookToken, setFacebookToken] = useState(null);
    const [showFacebookIframe, setFacebookIframe] = useState(false);

    useEffect(() => {
        window.addEventListener("message", (e) => {
            if (e.origin === "https://caa.iti.gr") {
                setFacebookToken(e.data[1]);
                setFacebookIframe(false);
            }
        });
        return () => {
            window.removeEventListener("message", (e) => {
                if (e.origin === "https://caa.iti.gr") {
                    setFacebookToken(e.data[1]);
                    setFacebookIframe(false);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!url || url === "") {
            setFinalUrl(undefined);
            setFacebookIframe(false);
            return;
        }

        let analysis_url = "http://mever.iti.gr/caa/api/v4/videos/jobs?url=" + url.replace("&", "%26");
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
    }, [url, facebookToken, reprocess]);


    return [finalUrl, showFacebookIframe]
};
export default useGenerateApiUrl;