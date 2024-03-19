import {
  getUpdates,
  haveEventDetailsBeenUpdated
} from "../src/helpers/UpdateHelper";
import { EventData, defaultEventData } from "../../Shared/models/Event";

type TestObject = {
  id: string;
  name: string;
  obj: { prop: string };
  arr: string[];
};

describe("haveEventDetailsBeenUpdated", () => {
  test("it should return true if an event detail has been updated", () => {
    const before: EventData = defaultEventData();
    const after = { ...before, name: "new name" };

    expect(haveEventDetailsBeenUpdated(before, after)).toEqual(true);
  });

  test("it should return true if multiple event details have been updated", () => {
    const before: EventData = defaultEventData();
    const after = { ...before, name: "new name", location: "new location" };

    expect(haveEventDetailsBeenUpdated(before, after)).toEqual(true);
  });

  test("it should return true if event details and event non-details have been updated", () => {
    const before: EventData = defaultEventData();
    const after = { ...before, name: "new name", capacity: 100 };

    expect(haveEventDetailsBeenUpdated(before, after)).toEqual(true);
  });

  test("it should return false if event has not been updated", () => {
    const before: EventData = defaultEventData();
    const after = { ...before };

    expect(haveEventDetailsBeenUpdated(before, after)).toEqual(false);
  });

  test("it should return false if event non-details have been updated", () => {
    const before: EventData = defaultEventData();
    const after = { ...before, capacity: 100 };

    expect(haveEventDetailsBeenUpdated(before, after)).toEqual(false);
  });
});

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
