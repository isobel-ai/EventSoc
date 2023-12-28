import {
  getEventUpdates,
  getSocietyUpdates
} from "../src/helpers/UpdateHelper";
import { CreateEvent, defaultCreateEvent } from "../src/models/Event";
import {
  CreateSociety,
  UpdateSociety,
  defaultCreateSociety
} from "../src/models/Society";

describe("getEventUpdates", () => {
  test("it should return no updates if there aren't any", () => {
    const id = "1";
    const event = defaultCreateEvent();

    expect(getEventUpdates(id, event, { ...event })).toEqual({ id: id });
  });

  test("it should return updates if there are changes (all changes)", () => {
    const id = "1";

    const before: CreateEvent = defaultCreateEvent();

    const after: CreateEvent = {
      name: "name change",
      location: "location change",
      description: "desc change",
      startDate: new Date(4000, 1, 1),
      endDate: new Date(4000, 1, 2),
      pictureUrl: "picURL change",
      localPictureUrl: "localURL change"
    };

    expect(getEventUpdates(id, before, after)).toEqual(
      Object.assign(after, { id: id })
    );
  });

  test("it should return updates if there are changes (partial changes)", () => {
    const id = "1";

    const before: CreateEvent = defaultCreateEvent();

    const after: CreateEvent = {
      ...before,
      name: "name change",
      location: "location change",
      startDate: new Date(3000, 1, 1)
    };

    const updates = {
      id: id,
      name: after.name,
      location: after.location,
      startDate: after.startDate
    };

    expect(getEventUpdates(id, before, after)).toEqual(updates);
  });
});

describe("getSocietyUpdates", () => {
  test("it should return no updates if there aren't any", () => {
    const id = "1";
    const soc = defaultCreateSociety();

    expect(getSocietyUpdates(id, soc, { ...soc })).toEqual({ id: id });
  });

  test("it should return updates if there are changes (all changes - not eventRefs)", () => {
    const id = "1";

    const before: CreateSociety = defaultCreateSociety();

    const after: CreateSociety = {
      ...before,
      name: "name change",
      description: "desc change",
      pictureUrl: "picURL change",
      localPictureUrl: "localURL change",
      exec: ["a"]
    };

    const { eventRefs, ...expectedUpdates } = after;

    expect(getSocietyUpdates(id, before, after)).toEqual(
      Object.assign(expectedUpdates, { id: id })
    );
  });

  test("it should return updates if there are changes (partial changes)", () => {
    const id = "1";

    const before: CreateSociety = defaultCreateSociety();

    const after: CreateSociety = {
      ...before,
      name: "name change",
      exec: ["a"]
    };

    const updates = {
      id: id,
      name: after.name,
      exec: after.exec
    };

    expect(getSocietyUpdates(id, before, after)).toEqual(updates);
  });
});
