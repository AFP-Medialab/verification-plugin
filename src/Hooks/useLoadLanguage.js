import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {addDictionary} from "../redux/actions";

/**
 * @func transform array in json representation of translation (access this way: json[global_language][id_translate])
 * @array the array representation of the csv
 * @return the json representation of the csv
 */
function array_to_json(array) {
    let json = {};
    for (let i = 1; i < array[0].length; ++i) {
        let lang = array[0][i].replace("\r", "");
        json[lang] = {};
        for (let j = 1; j < array.length; ++j) {
            if (array[j] && array[j][i] && typeof array[j][i] !== undefined) {
                json[lang][array[j][0]] = array[j][i].replace("\r", "");
            } else {
                json[lang][array[j][0]] = "";
            }
        }
    }
    return json;
}

/**
 * @func transform csv string to its array representation
 * @csv csv string
 * @return array representation of csv string
 */
function csv_to_array(csv) {
    let rows = csv.split("\n");
    return rows.map(function (row) {
        return row.split("\t");
    });
}

/**
 * @func get the google spreadsheet or csv file localy and stores its content as an array in lang_array_csv
 * @path url to google spreadsheet or path to csv local file
 */
function translate_csv(text) {
    let lang_array_csv = csv_to_array(text);
    return array_to_json(lang_array_csv);
}

const useLoadLanguage = (onlineTsv, localTsv) => {
    const gitHubFullUrl = process.env.REACT_APP_TRANSLATION_GITHUB + onlineTsv;
    const lang = useSelector(state => state.language);
    const dictionary = useSelector(state => state.dictionary[gitHubFullUrl]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (dictionary)
            return;

        const backUpLocal = () => {
            axios.get(localTsv)
                .then(result => {
                    dispatch(addDictionary(gitHubFullUrl, translate_csv(result.data)));
                })
                .catch(error => console.error(error))
        };

        axios.get(gitHubFullUrl)
            .then(result => {
                if (result.data === "")
                    backUpLocal();
                else
                    dispatch(addDictionary(gitHubFullUrl, translate_csv(result.data)));
            })
            .catch(() => {
                backUpLocal();
            })
    }, [gitHubFullUrl, localTsv, dictionary]);

    return (key) => {
        return (dictionary && dictionary[lang] && dictionary[lang][key]) ? dictionary[lang][key] : "";
    };
};
export default useLoadLanguage;