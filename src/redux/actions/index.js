export const changeLanguage = (lang) => {
    return {
        type : 'CHANGE',
        payload : lang
    };
};

export const setDictionary = (text) => {
    return {
        type : "SET",
        payload : text
    };
};

export const addDictionary = (label, json) => {
    return {
        type : "ADD",
        payload : {
            label: label,
            json: json
        }
    };
};

export const selectPage = (number) => {
    return {
        type: "SELECT_PAGE",
        payload : number,
    }
};

export const selectTool = (number) => {
    return {
        type : "SELECT_TOOL",
        payload : number,
    }
};

export const toggleHumanRightsCheckBox = () => {
    return {
        type : "TOGGLE_HUMAN_RIGHTS_CHECKBOX"
    }
};

export const toggleUnlockExplanationCheckBox = () => {
    return {
        type : "TOGGLE_INTERACTIVE_EXPLANATION_CHECKBOX"
    }
};












