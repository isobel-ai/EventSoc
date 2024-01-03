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

export const defaultDate = () => {
  const date = new Date();
  date.setSeconds(0, 0);
  return date;
};

export function toDateTimeRangeString(startDate: Date, endDate: Date) {
  const startString = `${getDateString(startDate)} ${getTimeString(startDate)}`;

  const endString =
    (startDate.toDateString() !== endDate.toDateString()
      ? `${getDateString(endDate)} `
      : "") + getTimeString(endDate);

  return `${startString} - ${endString}`;
}

export function toDateRangeString(startDate?: Date, endDate?: Date) {
  if (!startDate) {
    return "";
  }

  const startString = getDateString(startDate);

  if (endDate && startDate.toDateString() !== endDate.toDateString()) {
    return `${startString} - ${getDateString(endDate)}`;
  }
  return startString;
}

function getDateString(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  return `${day}${getOrdinalSuffix(day)} ${month}`;
}

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function getTimeString(date: Date) {
  return date.toLocaleTimeString("default", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/**
 * @returns the date of the next July 31st
 */
export function endOfUniYear() {
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  return thisMonth > 6
    ? new Date(thisYear + 1, 6, 31)
    : new Date(thisYear, 6, 31);
}
