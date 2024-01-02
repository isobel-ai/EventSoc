import {
  defaultDate,
  endOfUniYear,
  setDate,
  setTime,
  toDateRangeString
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

describe("defaultDate", () => {
  test("it should return a date with 0 seconds and milliseconds", () => {
    const date = defaultDate();

    expect(date.getSeconds()).toBe(0);
    expect(date.getMilliseconds()).toBe(0);
  });
});

describe("toDateRangeString", () => {
  test("it should return date range strings with appropriate ordinal suffixes", () => {
    const st = new Date(2023, 0, 1);
    const nd = new Date(2023, 0, 2);
    const rd = new Date(2023, 0, 3);
    const th1 = new Date(2023, 0, 4);
    const th2 = new Date(2023, 0, 25);

    expect(toDateRangeString(st, nd)).toBe(
      "1st January 00:00 - 2nd January 00:00"
    );
    expect(toDateRangeString(rd, th1)).toBe(
      "3rd January 00:00 - 4th January 00:00"
    );
    expect(toDateRangeString(th1, th2)).toBe(
      "4th January 00:00 - 25th January 00:00"
    );
  });

  test("it should return an appropriate date range string (range within one day)", () => {
    const start = new Date(2023, 0, 1, 1, 0);
    const end = new Date(2023, 0, 1, 12, 15);

    expect(toDateRangeString(start, end)).toBe("1st January 01:00 - 12:15");
  });

  test("it should return an appropriate date range string (range without one day)", () => {
    const start = new Date(2023, 0, 1, 1, 0);
    const end = new Date(2023, 0, 2, 2, 5);

    expect(toDateRangeString(start, end)).toBe(
      "1st January 01:00 - 2nd January 02:05"
    );
  });
});

describe("endOfYear", () => {
  test("it should return July 31st of this year if the date is currently before then", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 1, 1));

    expect(endOfUniYear()).toEqual(new Date(2000, 6, 31));
  });

  test("it should return July 31st of this year if the date is currently before then (boundary)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 6, 31));

    expect(endOfUniYear()).toEqual(new Date(2000, 6, 31));
  });

  test("it should return July 31st of next year if the date is currently after then", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 9, 1));

    expect(endOfUniYear()).toEqual(new Date(2001, 6, 31));
  });

  test("it should return July 31st of next year if the date is currently after then (boundary)", () => {
    jest.useFakeTimers().setSystemTime(new Date(2000, 7, 1));

    expect(endOfUniYear()).toEqual(new Date(2001, 6, 31));
  });
});
