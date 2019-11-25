export const setError = (string) => {
    return {
        type : "SET_ERROR",
        payload : string
    }
};

export const cleanError = () => {
    return {
        type : "CLEAN_ERROR",
    }
};