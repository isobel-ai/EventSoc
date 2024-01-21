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
  const end = new Date(thisYear, 6, 31, 23, 59, 59, 999);

  const thisMonth = new Date().getMonth();
  if (thisMonth > 6) {
    end.setFullYear(thisYear + 1);
  }

  return end;
}
export function dateInRange(date: Date, rangeStart?: Date, rangeEnd?: Date) {
  if (!rangeStart) {
    // No range
    return true;
  }

  const normalizedRangeStart = new Date(rangeStart);
  normalizedRangeStart.setHours(0, 0, 0, 0);

  if (date >= normalizedRangeStart) {
    const normalizedRangeEnd = rangeEnd
      ? new Date(rangeEnd)
      : new Date(rangeStart);
    normalizedRangeEnd.setHours(23, 59, 59, 999);

    return date <= normalizedRangeEnd;
  }

  return false;
}

export function toTimeAgoString(timestamp: Date) {
  const secondsSince = (new Date().getTime() - timestamp.getTime()) / 1000;

  if (secondsSince < 60) {
    return `${Math.floor(secondsSince)}s`;
  }
  if (secondsSince < 60 * 60) {
    return `${Math.floor(secondsSince / 60)}m`;
  }
  if (secondsSince < 60 * 60 * 24) {
    return `${Math.floor(secondsSince / (60 * 60))}h`;
  }
  if (secondsSince <= 60 * 60 * 24 * 6) {
    return `${Math.floor(secondsSince / (60 * 60 * 24))}d`;
  }
  return timestamp.toLocaleString("default", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  });
}
