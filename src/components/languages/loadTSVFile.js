import {setDictionary} from "../../actions";
import tsv from "./InVIDTraductions.tsv";

/**
 * @func transform array in json representation of translation (access this way: json[global_language][id_translate])
 * @array the array representation of the csv
 * @return the json representation of the csv
 */
function array_to_json(array)
{
    var json = {};
    for( var i = 1; i < array[0].length; ++i ) {
        var lang = array[0][i].replace( "\r", "" );
        json[lang] = {};
        for( var j = 1; j < array.length; ++j ) {
            if( array[j] && array[j][i] && typeof array[j][i] !== undefined ) {
                json[lang][array[j][0]] = array[j][i].replace( "\r", "" );
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
function csv_to_array(csv)
{
    let rows = csv.split( "\n" );
    return rows.map( function( row ) {
        return row.split( "\t" );
    });
}

/**
 * @func get the google spreadsheet or csv file localy and stores its content as an array in lang_array_csv
 * @path url to google spreadsheet or path to csv local file
 */
function translate_csv(text) {
    let lang_array_csv = csv_to_array(text);
    return  array_to_json(lang_array_csv);
}




const loadTSVFile = (dispatch) => {
    let path = tsv;//(navigator.onLine) ? "https://raw.githubusercontent.com/AFP-Medialab/InVID-Translations/v0.71/InVIDTraductions.tsv" : "InVIDTraductions.tsv";
    let file = new XMLHttpRequest();
    file.open('GET', path, false);
    file.onreadystatechange = ()  =>{
        if (file.readyState === 4 && (file.status === 200 ||file.status === 0)){
            dispatch(setDictionary(translate_csv(file.responseText)));
        }
    };
    file.send(null);
};
export default loadTSVFile;