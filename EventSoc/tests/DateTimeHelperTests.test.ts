import {
  defaultDate,
  equalDate,
  setDate,
  setTime
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

describe("equalDate", () => {
  test("it should return true for equal dates", () => {
    const d1 = new Date(2023, 1, 1, 1, 1);
    const d2 = new Date(d1);

    expect(equalDate(d1, d2)).toBe(true);
  });

  test("it should return false for unequal dates (different date and time)", () => {
    const d1 = new Date(2023, 1, 1, 1, 1);
    const d2 = new Date(2022, 1, 1, 2, 1);

    expect(equalDate(d1, d2)).toBe(false);
  });

  test("it should return false for unequal dates (different date)", () => {
    const d1 = new Date(2023, 1, 1, 1, 1);
    const d2 = new Date(2022, 1, 1, 1, 1);

    expect(equalDate(d1, d2)).toBe(false);
  });

  test("it should return false for unequal dates (different time)", () => {
    const d1 = new Date(2023, 1, 1, 1, 1);
    const d2 = new Date(2023, 1, 1, 2, 1);

    expect(equalDate(d1, d2)).toBe(false);
  });
});

describe("defaultDate", () => {
  test("returns a date with 0 seconds and milliseconds", () => {
    const date = defaultDate();

    expect(date.getSeconds()).toBe(0);
    expect(date.getMilliseconds()).toBe(0);
  });
});
