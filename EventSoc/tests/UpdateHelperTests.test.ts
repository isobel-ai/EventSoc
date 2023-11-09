import { getEventUpdates } from "../src/helpers/UpdateHelper";
import { CreateSocEvent, defaultCreateSocEvent } from "../src/models/SocEvent";

describe("getEventUpdates", () => {
  test("it should return no updates if there aren't any", () => {
    const id = "1";
    const event = defaultCreateSocEvent;

    expect(getEventUpdates(id, event, event)).toEqual({ id: id });
  });

  test("it should return updates if there are changes (all changes)", () => {
    const id = "1";

    const before: CreateSocEvent = defaultCreateSocEvent;

    const after: CreateSocEvent = {
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

    const before: CreateSocEvent = defaultCreateSocEvent;

    const after: CreateSocEvent = {
      ...defaultCreateSocEvent,
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
