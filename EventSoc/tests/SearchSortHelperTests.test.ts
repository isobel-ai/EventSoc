import {
  dateInRange,
  searchFilter,
  sortByString
} from "../src/helpers/SearchSortHelper";

interface TestObject {
  id: number;
  name: string;
  obj?: { prop: string };
  arr?: string[];
}

describe("searchFilter", () => {
  test("it should return an empty array if there are no matches", () => {
    const searchFor = "d";
    const searchIn: TestObject[] = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "c" }
    ];
    const searchKey = "name";

    expect(searchFilter(searchFor, searchIn, [searchKey])).toEqual(
      <TestObject[]>[]
    );
  });

  test("it should return the searchIn array if all its elements match", () => {
    const searchFor = "";
    const searchIn: TestObject[] = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "c" }
    ];
    const searchKey = "name";

    expect(searchFilter(searchFor, searchIn, [searchKey])).toEqual(searchIn);
  });

  test("it should return an array of the matching elements if any exist", () => {
    const searchFor = "a";
    const searchIn: TestObject[] = [
      { id: 1, name: "ab" },
      { id: 2, name: "b" },
      { id: 3, name: "cA" }
    ];
    const searchKey = "name";

    expect(searchFilter(searchFor, searchIn, [searchKey])).toEqual(<
      TestObject[]
    >[
      { id: 1, name: "ab" },
      { id: 3, name: "cA" }
    ]);
  });

  test("it should return an array of the matching elements if any exist (2d key)", () => {
    const searchFor = "a";
    const searchIn: TestObject[] = [
      { id: 1, name: "x", obj: { prop: "a" } },
      { id: 2, name: "y", obj: { prop: "b" } },
      { id: 3, name: "z", obj: { prop: "AA" } }
    ];
    const searchKey = "obj.prop";

    expect(searchFilter(searchFor, searchIn, [searchKey])).toEqual(<
      TestObject[]
    >[
      { id: 1, name: "x", obj: { prop: "a" } },
      { id: 3, name: "z", obj: { prop: "AA" } }
    ]);
  });

  test("it should return an array of the matching elements if any exist (array key)", () => {
    const searchFor = "a";
    const searchIn: TestObject[] = [
      { id: 1, name: "x", arr: ["a"] },
      { id: 2, name: "y", arr: ["b", "aS"] },
      { id: 3, name: "z", arr: ["g", "S"] }
    ];
    const searchKey = "arr";

    expect(searchFilter(searchFor, searchIn, [searchKey])).toEqual(<
      TestObject[]
    >[
      { id: 1, name: "x", arr: ["a"] },
      { id: 2, name: "y", arr: ["b", "aS"] }
    ]);
  });

  test("it should return an array of the matching elements if any exist (multiple keys)", () => {
    const searchFor = "a";
    const searchIn: TestObject[] = [
      { id: 1, name: "x", obj: { prop: "a" } },
      { id: 2, name: "y", obj: { prop: "b" } },
      { id: 3, name: "a", obj: { prop: "c" } }
    ];
    const searchKeys = ["name", "obj.prop"];

    expect(searchFilter(searchFor, searchIn, searchKeys)).toEqual(<
      TestObject[]
    >[
      { id: 1, name: "x", obj: { prop: "a" } },
      { id: 3, name: "a", obj: { prop: "c" } }
    ]);
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

describe("sortByString", () => {
  test("it should return 1 if the first object is lesser than the other", () => {
    const o1: TestObject = { id: 1, name: "b" };
    const o2: TestObject = { id: 2, name: "a" };
    const sortKey = "name";

    expect(sortByString(o1, o2, sortKey)).toBe(1);
  });

  test("it should return 0 if the first object is equal to the other", () => {
    const o1: TestObject = { id: 1, name: "a" };
    const o2: TestObject = { id: 2, name: "A" };
    const sortKey = "name";

    expect(sortByString(o1, o2, sortKey)).toBe(0);
  });

  test("it should return -1 if the first object is greater than the other", () => {
    const o1: TestObject = { id: 1, name: "a" };
    const o2: TestObject = { id: 2, name: "b" };
    const sortKey = "name";

    expect(sortByString(o1, o2, sortKey)).toBe(-1);
  });
});
