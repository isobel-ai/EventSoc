import { defaultDate, setDate, setTime } from "../src/helpers/DateTimeHelper";

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
