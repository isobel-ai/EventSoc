import {
  dateInRange,
  endOfUniYear,
  setDate,
  setTime,
  toDateRangeString,
  toDateTimeRangeString,
  toTimeAgoString
} from "../src/helpers/DateTimeHelper";

describe("setDate", () => {
  test("it should set the date", () => {
    const date = new Date(2023, 1, 1);
    const dayMonthYear = new Date(2022, 2, 2);

    setDate(date, dayMonthYear);

    expect(date.toDateString()).toBe(dayMonthYear.toDateString());
  });

  test("it shouldn't set the time", () => {
    const beforeDate = new Date(2023, 1, 1, 1, 1);
    const afterDate = new Date(beforeDate);
    const dayMonthYear = new Date(2023, 1, 1, 2, 2);

    setDate(afterDate, dayMonthYear);

    expect(beforeDate.toDateString()).toBe(afterDate.toDateString());
  });
});

describe("setTime", () => {
  test("it should set the time", () => {
    const date = new Date(2023, 1, 1, 1, 1);
    const time = new Date(2023, 1, 1, 2, 2);

    setTime(date, time);

    expect(date.toTimeString()).toBe(time.toTimeString());
  });

  test("it shouldn't set the date", () => {
    const beforeDate = new Date(2023, 1, 1, 1, 1);
    const afterDate = new Date(beforeDate);
    const time = new Date(2023, 2, 2, 1, 1);

    setTime(afterDate, time);

    expect(beforeDate.toTimeString()).toBe(afterDate.toTimeString());
  });
});

describe("toDateTimeRangeString", () => {
  test("it should return date range strings with appropriate ordinal suffixes", () => {
    const st = new Date(2023, 0, 1);
    const nd = new Date(2023, 0, 2);
    const rd = new Date(2023, 0, 3);
    const th1 = new Date(2023, 0, 4);
    const th2 = new Date(2023, 0, 25);

    expect(toDateTimeRangeString(st, nd)).toBe(
      "1st January 00:00 - 2nd January 00:00"
    );
    expect(toDateTimeRangeString(rd, th1)).toBe(
      "3rd January 00:00 - 4th January 00:00"
    );
    expect(toDateTimeRangeString(th1, th2)).toBe(
      "4th January 00:00 - 25th January 00:00"
    );
  });

  test("it should return an appropriate date range string (range within one day)", () => {
    const start = new Date(2023, 0, 1, 1, 0);
    const end = new Date(2023, 0, 1, 12, 15);

    expect(toDateTimeRangeString(start, end)).toBe("1st January 01:00 - 12:15");
  });

  test("it should return an appropriate date range string (range without one day)", () => {
    const start = new Date(2023, 0, 1, 1, 0);
    const end = new Date(2023, 0, 2, 2, 5);

    expect(toDateTimeRangeString(start, end)).toBe(
      "1st January 01:00 - 2nd January 02:05"
    );
  });
});

describe("toDateRangeString", () => {
  test("it should return an empty string if start date is undefined", () => {
    const start: Date | undefined = undefined;
    const end = new Date(2023, 0, 1, 12, 15);

    expect(toDateRangeString(start, end)).toBe("");
  });

  test("it should return the start date's string if end date is undefined", () => {
    const start = new Date(2023, 0, 1, 12, 15);
    const end: Date | undefined = undefined;

    expect(toDateRangeString(start, end)).toBe("1st January");
  });

  test("it should return the start date's string if the start and end date are the same", () => {
    const start = new Date(2023, 0, 1, 12, 15);
    const end = new Date(2023, 0, 1, 19, 8);

    expect(toDateRangeString(start, end)).toBe("1st January");
  });

  test("it should return an appropriate date range string if the start and end dates are different", () => {
    const start = new Date(2023, 0, 1, 1, 0);
    const end = new Date(2023, 0, 2, 2, 5);

    expect(toDateRangeString(start, end)).toBe("1st January - 2nd January");
  });
});

describe("endOfYear", () => {
  test("it should return July 31st of this year if the date is currently before then", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 1, 1));

    expect(endOfUniYear()).toEqual(new Date(2000, 6, 31, 23, 59, 59, 999));
  });

  test("it should return July 31st of this year if the date is currently before then (boundary)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 6, 31));

    expect(endOfUniYear()).toEqual(new Date(2000, 6, 31, 23, 59, 59, 999));
  });

  test("it should return July 31st of next year if the date is currently after then", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 9, 1));

    expect(endOfUniYear()).toEqual(new Date(2001, 6, 31, 23, 59, 59, 999));
  });

  test("it should return July 31st of next year if the date is currently after then (boundary)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 7, 1));

    expect(endOfUniYear()).toEqual(new Date(2001, 6, 31, 23, 59, 59, 999));
  });
});

describe("dateInRange", () => {
  test("it should return true if there's no range start", () => {
    const date = new Date(2020, 1, 1, 10, 15);
    const rangeStart: Date | undefined = undefined;
    const rangeEnd = new Date(2020, 1, 3, 12, 15);

    expect(dateInRange(date, rangeStart, rangeEnd)).toBe(true);
  });

  test("it should return false if the date is before range start", () => {
    const date = new Date(2020, 1, 1, 10, 15);
    const rangeStart = new Date(2020, 1, 6, 12, 15);
    const rangeEnd = new Date(2020, 1, 9, 12, 15);

    expect(dateInRange(date, rangeStart, rangeEnd)).toBe(false);
  });

  test("it should return true if the date is in range (end range exists)", () => {
    const date = new Date(2020, 1, 7, 10, 15);
    const rangeStart = new Date(2020, 1, 1, 12, 15);
    const rangeEnd = new Date(2020, 1, 7, 12, 15);

    expect(dateInRange(date, rangeStart, rangeEnd)).toBe(true);
  });

  test("it should return false if the date isn't in range (end range exists)", () => {
    const date = new Date(2020, 1, 8, 10, 15);
    const rangeStart = new Date(2020, 1, 6, 12, 15);
    const rangeEnd = new Date(2020, 1, 7, 12, 15);

    expect(dateInRange(date, rangeStart, rangeEnd)).toBe(false);
  });

  test("it should return true if the date is in range (no range end)", () => {
    const date = new Date(2020, 1, 1, 10, 15);
    const rangeStart = new Date(2020, 1, 1, 12, 15);
    const rangeEnd: Date | undefined = undefined;

    expect(dateInRange(date, rangeStart, rangeEnd)).toBe(true);
  });

  test("it should return false if the date isn't in range (no range end)", () => {
    const date = new Date(2020, 1, 1, 10, 15);
    const rangeStart = new Date(2020, 1, 6, 12, 15);
    const rangeEnd: Date | undefined = undefined;

    expect(dateInRange(date, rangeStart, rangeEnd)).toBe(false);
  });
});

describe("toTimeAgoString", () => {
  test("it should return an appropriate string (seconds ago)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 7, 1, 12, 0, 0));

    expect(toTimeAgoString(new Date(2000, 7, 1, 11, 59, 1))).toBe("59s");
  });

  test("it should return an appropriate string (minutes ago)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 7, 1, 12, 0, 0));

    expect(toTimeAgoString(new Date(2000, 7, 1, 11, 59, 0))).toBe("1m");
    expect(toTimeAgoString(new Date(2000, 7, 1, 11, 0, 1))).toBe("59m");
  });

  test("it should return an appropriate string (hours ago)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 7, 2, 12, 0, 0));

    expect(toTimeAgoString(new Date(2000, 7, 2, 11, 0, 0))).toBe("1h");
    expect(toTimeAgoString(new Date(2000, 7, 1, 12, 0, 1))).toBe("23h");
  });

  test("it should return an appropriate string (up to 6 days ago)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 7, 10, 12, 0, 0));

    expect(toTimeAgoString(new Date(2000, 7, 9, 12, 0, 0))).toBe("1d");
    expect(toTimeAgoString(new Date(2000, 7, 4, 12, 0, 0))).toBe("6d");
  });

  test("it should return an appropriate string (over 6 days ago)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 7, 10, 12, 0, 0));

    expect(toTimeAgoString(new Date(2000, 7, 4, 11, 59, 59))).toBe(
      "04/08/2000"
    );
  });
});
