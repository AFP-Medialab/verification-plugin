import {useEffect, useState} from "react";
import axios from "axios"
import {useSelector} from "react-redux";

export const useAnalysisWrapper = (url, reprocess) => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const handleError = (error) => {
            setError(error);
            setLoading(false);
        };

        const getReport = (id => {
            axios.get("http://mever.iti.gr/caa/api/v4/videos/reports/" + id)
                .then(response => setData(response.data))
                .catch(errors => handleError(errors));
        });

        const handleJob = (data) => {
            if (keyword("table_error_" + data["status"]) !== undefined) {
                handleError(keyword("table_error_" + data["status"]));
            }
            else {
                let job = null;
                const interval = setInterval(() => {
                    if (job  && keyword("table_error_" + job.status) !== undefined) {
                        handleError(keyword("table_error_" + job.status));
                        clearInterval(interval);
                    }
                    else if (job && (job.status === "done" || job.status === "unavailable")) {

                        setLoading(false);
                        clearInterval(interval);
                    }
                    else {
                        axios.get("http://mever.iti.gr/caa/api/v4/videos/jobs/" + data.id)
                            .then(response => {
                                job = response.data;
                                getReport(job.media_id);
                            })
                            .catch(errors => {
                                handleError(errors);
                                clearInterval(interval);
                            });
                    }
                }, 2000)
            }
        };

        if (!url)
            return;
        if (url === "") {
            handleError(keyword("table_error_empty_url"));
        }
        else if (url.includes(" ")){
            handleError(keyword("table_error_unavailable"));
        }
        else {
            let analysis_url = "http://mever.iti.gr/caa/api/v4/videos/jobs?url=" + url.replace("&", "%26");
            if (reprocess)
                analysis_url += "&reprocess=1";
            setLoading(true);
            axios.post(analysis_url)
                .then(response => handleJob(response["data"]))
                .catch(error => handleError(error))
        }

    }, [url, reprocess]);

    return [data, error, isLoading];
};