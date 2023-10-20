import moment from "moment-timezone";
export const convertMomentToGMT = (datetime) => {
  let date = datetime.format("YYYY-MM-DDTHH:mm:ss").toString();
  return moment.tz(date, "UTC");
};
