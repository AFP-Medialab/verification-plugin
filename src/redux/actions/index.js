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