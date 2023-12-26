import { searchFilter, sortByString } from "../src/helpers/SearchSortHelper";

interface TestObject {
  id: number;
  name: string;
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

    expect(searchFilter(searchFor, searchIn, searchKey)).toEqual(
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

    expect(searchFilter(searchFor, searchIn, searchKey)).toEqual(searchIn);
  });

  test("it should return an array of the matching elements if any exist", () => {
    const searchFor = "a";
    const searchIn: TestObject[] = [
      { id: 1, name: "ab" },
      { id: 2, name: "b" },
      { id: 3, name: "cA" }
    ];
    const searchKey = "name";

    expect(searchFilter(searchFor, searchIn, searchKey)).toEqual(<TestObject[]>[
      { id: 1, name: "ab" },
      { id: 3, name: "cA" }
    ]);
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
