import { getUpdates } from "../src/helpers/UpdateHelper";

interface TestObject {
  id: number;
  name: string;
  obj: { prop: string };
  arr: string[];
}

describe("getUpdates", () => {
  test("it should return no updates if there aren't any", () => {
    const before: TestObject = {
      id: 1,
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after: TestObject = { ...before };

    expect(getUpdates(before, after)).toEqual(<Partial<TestObject>>{});
  });

  test("it should return updates if there are changes (all changes)", () => {
    const before: TestObject = {
      id: 1,
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after: TestObject = {
      id: 2,
      name: "c",
      obj: { prop: "d" },
      arr: ["c"]
    };

    expect(getUpdates(before, after)).toEqual(<Partial<TestObject>>{
      ...after
    });
  });

  test("it should return updates if there are changes (partial changes)", () => {
    const before: TestObject = {
      id: 1,
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after: TestObject = {
      id: 2,
      name: "a",
      obj: { prop: "d" },
      arr: ["c", "d"]
    };

    expect(getUpdates(before, after)).toEqual(<Partial<TestObject>>{
      id: 2,
      obj: { prop: "d" }
    });
  });
});
