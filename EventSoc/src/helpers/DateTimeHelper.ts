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
  newDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
  return newDate;
}
