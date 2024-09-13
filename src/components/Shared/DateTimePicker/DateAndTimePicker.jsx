import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment-timezone";

const DateAndTimePicker = ({
  time,
  searchFormDisabled,
  keywordFromDate,
  keywordUntilDate,
  fromValue,
  untilValue,
  handleSinceChange,
  handleUntilChange,
}) => {
  const checkIfDateSince = (e) => {
    console.log("check if date since: " + e);
    moment.locale("en-gb");
    if (moment.isMoment(e)) {
      console.log("is moment");
      handleSinceChange(e);
    } else handleSinceChange(null);
  };

  const checkIfDateUntil = (e) => {
    moment.locale("en-gb");
    if (moment.isMoment(e)) {
      handleUntilChange(e);
    } else handleUntilChange(null);
  };

  const pastDate = (currentDate) => {
    const itemDate = currentDate.toDate();
    if (fromValue) return fromValue > itemDate;
    return false;
  };

  return (
    <>
      {time ? (
        <>
          <DateTimePicker
            onChange={checkIfDateSince}
            disbled={searchFormDisabled}
            input={true}
            label={"*  " + keywordFromDate}
            dateFormat={"YYYY-MM-DD"}
            timeFormat={"HH:mm:ss"}
            value={fromValue}
            handleChange={handleSinceChange}
            ampm={false}
          ></DateTimePicker>
          <DateTimePicker
            onChange={checkIfDateUntil}
            disbled={searchFormDisabled}
            input={true}
            label={"*  " + keywordUntilDate}
            dateFormat={"YYYY-MM-DD"}
            timeFormat={"HH:mm:ss"}
            value={untilValue}
            handleChange={handleUntilChange}
            ampm={false}
            shouldDisableDate={pastDate}
          ></DateTimePicker>
        </>
      ) : (
        <>
          <DatePicker></DatePicker>
          <DatePicker></DatePicker>
        </>
      )}
    </>
  );
};

export default DateAndTimePicker;
