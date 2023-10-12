export const convertMomentToGMT = (moment) => {
  return new Date(
    Date.UTC(
      moment.toYear(),
      moment.toMonth(),
      moment.toDate(),
      moment.toHours(),
      moment.toMinutes(),
    ),
  );
};
