import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import moment from "moment-timezone";

/**
 * date and time picjer or just date picker, with a first and a second date
 * @param {boolean} time determines wheter or not the user also picks the time
 * @param {boolean} disabled
 * @param {string} keywordFromDate
 * @param {string} keywordUntilDate
 * @param {object} fromValue
 * @param {object} untilValue
 * @param {function} handleSinceChange
 * @param {function} handleUntilChange
 * @returns
 */
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
  const pastDate = (currentDate) => {
    const itemDate = dayjs(currentDate);
    if (fromValue) return itemDate.isBefore(fromValue);
    return false;
  };

  const futureDate = (currentDate) => {
    const itemDate = dayjs(currentDate);
    if (untilValue) return untilValue.isBefore(itemDate);
    return false;
  };

  return (
    <>
      {time ? (
        <>
          <DateTimePicker
            onChange={handleSinceChange}
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
            onChange={handleUntilChange}
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
            onChange={handleSinceChange}
            slotProps={{
              field: { clearable: true },
            }}
            disabled={disabled}
            shouldDisableDate={futureDate}
          />
          <DatePicker
            label={"*  " + keywordUntilDate}
            value={untilValue}
            onChange={handleUntilChange}
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
