import { searchFilter } from "../src/helpers/SearchHelper";

type TestObject = {
  id: number;
  name: string;
  obj?: { prop: string };
  arr?: string[];
};

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
