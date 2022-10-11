import { createAction } from "@reduxjs/toolkit"


//export const changeLanguage = createAction('CHANGE')


/*export const changeDefaultLanguage = (lang) => {
    return {
        type : 'CHANGE_DEFAULT',
        payload : lang
    };
};*/

export const setDictionary = (text) => {
    return {
        type : "SET",
        payload : text
    };
};

export const addDictionary = (label, json) => {
    return {
        type : "ADD_DICO",
        payload : {
            label: label,
            json: json
        }
    };
};

//DEPRECATED
//export const selectPage = createAction("SELECT_PAGE")

//DEPRECATED
//export const selectTool = createAction("SELECT_TOOL")
/*export const selectTool = (number) => {
    return {
        type : "SELECT_TOOL",
        payload : number,
    }
};*/

export const toggleHumanRightsCheckBox = createAction("TOGGLE_HUMAN_RIGHTS_CHECKBOX")

/*export const toggleHumanRightsCheckBox = () => {
    return {
        type : "TOGGLE_HUMAN_RIGHTS_CHECKBOX"
    }
};*/

export const toggleUnlockExplanationCheckBox = createAction("TOGGLE_INTERACTIVE_EXPLANATION_CHECKBOX");

/*export const toggleUnlockExplanationCheckBox = () => {
    return {
        type : "TOGGLE_INTERACTIVE_EXPLANATION_CHECKBOX"
    }
};*/

export const toggleGACheckBox = () => {
    return {
        type : "TOGGLE_GA_STATE"
    }
    
}
