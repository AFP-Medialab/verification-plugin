import moment from "moment-timezone";
export const convertMomentToGMT = (datetime) => {
  let date = datetime.format("YYYY-MM-DDTHH:mm:ss").toString();
  console.log("date ", date);
  return moment.tz(date, "UTC");
};
