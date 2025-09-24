import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 * Reformats a duration to prevent modulo operations done by dayjs when formatting duration values
 * i.e. print 61 minutes instead of 1 hour 61 minutes
 *
 * @param {number} duration - The duration in milliseconds
 * @returns {string} Formatted duration string in "Xm Ys" format
 *
 * @example
 * ```javascript
 * printDurationInMinutesWithoutModulo(125000) // Returns "2m 5s"
 * printDurationInMinutesWithoutModulo(3661000) // Returns "61m 1s" (not "1h 1m 1s")
 * ```
 */
export const printDurationInMinutesWithoutModulo = (duration) => {
  const minutes = Math.floor(duration / 60000).toString();
  const seconds = Math.floor((duration - minutes * 60000) / 1000).toString();

  return `${minutes}m ${seconds}s`;
};

/**
 * Converts dayjs duration object to total seconds
 *
 * @param {dayjs.Duration} durationObj - A dayjs duration object
 * @returns {number} Total duration in seconds
 *
 * @example
 * ```javascript
 * const dur = dayjs.duration({ minutes: 2, seconds: 30 });
 * durationToSeconds(dur) // Returns 150
 * ```
 */
export const durationToSeconds = (durationObj) => {
  return durationObj.asSeconds();
};

/**
 * Creates a dayjs duration object from time string or milliseconds
 *
 * @param {string|number} timeValue - Time value as string or milliseconds
 * @returns {dayjs.Duration} Dayjs duration object
 *
 * @example
 * ```javascript
 * createDuration(125000) // Returns dayjs duration for 2m 5s
 * createDuration("PT2M5S") // Returns dayjs duration for 2m 5s (ISO format)
 * ```
 */
export const createDuration = (timeValue) => {
  return dayjs.duration(timeValue);
};
