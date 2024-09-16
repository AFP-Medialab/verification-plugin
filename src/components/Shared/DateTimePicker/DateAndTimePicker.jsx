import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment-timezone";

const DateAndTimePicker = ({
  time,
  disabled,
  keywordFromDate,
  keywordUntilDate,
  fromValue,
  untilValue,
  handleSinceChange,
  handleUntilChange,
}) => {
  const checkIfDateSince = (e) => {
    // console.log(e);
    // console.log("check if date since: " + e);
    // moment.locale("en-gb");
    // if (moment.isMoment(e)) {
    //   console.log("is moment");
    //   handleSinceChange(e);
    // } else handleSinceChange(null);
    handleSinceChange(e);
  };

  const checkIfDateUntil = (e) => {
    // moment.locale("en-gb");
    // if (moment.isMoment(e)) {
    //   handleUntilChange(e);
    // } else handleUntilChange(null);
    handleUntilChange(e);
  };

  const pastDate = (currentDate) => {
    const itemDate = currentDate.toDate();
    if (fromValue) return fromValue > itemDate;
    return false;
  };

  const futureDate = (currentDate) => {
    const itemDate = currentDate.toDate();
    if (untilValue) return untilValue < itemDate;
    return false;
  };

  return (
    <>
      {time ? (
        <>
          <DateTimePicker
            onChange={checkIfDateSince}
            disbled={disabled}
            input={true}
            label={"*  " + keywordFromDate}
            dateFormat={"YYYY-MM-DD"}
            timeFormat={"HH:mm:ss"}
            value={fromValue}
            ampm={false}
            shouldDisableDate={futureDate}
          />
          <DateTimePicker
            onChange={checkIfDateUntil}
            disbled={disabled}
            input={true}
            label={"*  " + keywordUntilDate}
            dateFormat={"YYYY-MM-DD"}
            timeFormat={"HH:mm:ss"}
            value={untilValue}
            ampm={false}
            shouldDisableDate={pastDate}
          />
        </>
      ) : (
        <>
          <DatePicker
            label={"*  " + keywordFromDate}
            value={fromValue}
            onChange={checkIfDateSince}
            slotProps={{
              field: { clearable: true },
            }}
            disabled={disabled}
            shouldDisableDate={futureDate}
          />
          <DatePicker
            label={"*  " + keywordUntilDate}
            value={untilValue}
            onChange={checkIfDateUntil}
            slotProps={{
              field: { clearable: true },
            }}
            disabled={disabled}
            shouldDisableDate={pastDate}
          />
        </>
      )}
    </>
  );
};

export default DateAndTimePicker;
