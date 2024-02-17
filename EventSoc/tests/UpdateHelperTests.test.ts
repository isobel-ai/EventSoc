import { cloneDeep } from "lodash";
import {
  ArrayUpdates,
  getArrayUpdates,
  getUpdates
} from "../src/helpers/UpdateHelper";

type TestObject = {
  id: string;
  name: string;
  obj: { prop: string };
  arr: string[];
};

describe("getUpdates", () => {
  test("it should return no updates if there aren't any", () => {
    const before: TestObject = {
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after: TestObject = { ...before };

    expect(getUpdates(before, after)).toEqual(<Partial<TestObject>>{});
  });

  test("it should return updates if there are changes (all changes)", () => {
    const before: TestObject = {
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after: TestObject = {
      id: "2",
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
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after: TestObject = {
      id: "2",
      name: "a",
      obj: { prop: "d" },
      arr: ["c", "d"]
    };

    expect(getUpdates(before, after)).toEqual(<Partial<TestObject>>{
      id: "2",
      obj: { prop: "d" }
    });
  });
});

describe("getArrayUpdates", () => {
  test("it should return an appropriate ArrayUpdates object (no changes)", () => {
    const before: TestObject = {
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after = cloneDeep(before);

    expect(getArrayUpdates([before], [after])).toEqual<
      ArrayUpdates<TestObject>
    >({ createObjs: [], updateObjs: [], deleteObjs: [] });
  });

  test("it should return an appropriate ArrayUpdates object (only creates)", () => {
    const after: TestObject = {
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };

    expect(getArrayUpdates([], [after])).toEqual<ArrayUpdates<TestObject>>({
      createObjs: [after],
      updateObjs: [],
      deleteObjs: []
    });
  });

  test("it should return an appropriate ArrayUpdates object (only updates)", () => {
    const before: TestObject = {
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const after = { ...cloneDeep(before), arr: [] };

    expect(getArrayUpdates([before], [after])).toEqual<
      ArrayUpdates<TestObject>
    >({
      createObjs: [],
      updateObjs: [{ id: before.id, arr: [] }],
      deleteObjs: []
    });
  });

  test("it should return an appropriate ArrayUpdates object (only deletes)", () => {
    const before: TestObject = {
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };

    expect(getArrayUpdates([before], [])).toEqual<ArrayUpdates<TestObject>>({
      createObjs: [],
      updateObjs: [],
      deleteObjs: [before]
    });
  });

  test("it should return an appropriate ArrayUpdates object (all update types)", () => {
    const create: TestObject = {
      id: "1",
      name: "a",
      obj: { prop: "b" },
      arr: ["c", "d"]
    };
    const deleteObj: TestObject = {
      id: "2",
      name: "a",
      obj: { prop: "d" },
      arr: ["c", "d"]
    };
    const updateBefore: TestObject = {
      id: "3",
      name: "a",
      obj: { prop: "d" },
      arr: ["c", "d"]
    };
    const updateAfter = { ...cloneDeep(updateBefore), name: "b" };

    expect(
      getArrayUpdates([deleteObj, updateBefore], [updateAfter, create])
    ).toEqual<ArrayUpdates<TestObject>>({
      createObjs: [create],
      updateObjs: [{ id: updateBefore.id, name: "b" }],
      deleteObjs: [deleteObj]
    });

    expect(
      getArrayUpdates([deleteObj, updateBefore], [create, updateAfter])
    ).toEqual<ArrayUpdates<TestObject>>({
      createObjs: [create],
      updateObjs: [{ id: updateBefore.id, name: "b" }],
      deleteObjs: [deleteObj]
    });
  });
});
