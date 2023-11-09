/**
 * Return Date with 'dayMonthYear' day month and year and 'date' time
 */
export function setDate(date: Date, dayMonthYear: Date) {
  const newDate = date;
  newDate.setFullYear(
    dayMonthYear.getFullYear(),
    dayMonthYear.getMonth(),
    dayMonthYear.getDate()
  );
  return newDate;
}

/**
 * Return Date with 'date' day month and year and 'time' time
 */
export function setTime(date: Date, time: Date) {
  const newDate = date;
  newDate.setHours(time.getHours(), time.getMinutes(), 0);
  return newDate;
}

export function equalDate(d1: Date, d2: Date) {
  return (
    d1.toDateString() === d2.toDateString() &&
    d1.toTimeString() === d2.toTimeString()
  );
}

export const defaultDate = () => {
  const date = new Date();
  date.setSeconds(0, 0);
  return date;
};
