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