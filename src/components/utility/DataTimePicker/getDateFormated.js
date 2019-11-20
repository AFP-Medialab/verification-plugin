export const getDateFormated = (date) => {
    let string = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
    string = string.replace(/\//g, ' ');
    string = string.replace(/, /g, ' ');
    let array = string.split(" ");
    string =  array[2] + "-" +  array[1] + "-" +  array[0] + "T" + array[3]
    return string;
}