export const setOcrInput = (url) => {
    return {
        type: "SET_OCR_INPUT",
        payload: {
            url: url,
        }
    }
};

export const setOcrResult = (loading, fail, done, result) => {
    return {
        type: "SET_OCR_RESULT",
        payload: {
            loading: loading,
            fail: fail,
            done: done,
            result: result
        }
    }
}

export const cleanOcr = () => {
    return {
        type: "OCR_CLEAN_STATE"
    }
};