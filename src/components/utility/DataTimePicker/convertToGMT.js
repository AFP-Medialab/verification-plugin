const convertToGMT = (date) => {
    let result = new Date(date);
    return new Date(Date.UTC(
        result.getFullYear(),
        result.getMonth(),
        result.getDate(),
        result.getHours(),
        result.getMinutes()
    ));
};
export default convertToGMT;