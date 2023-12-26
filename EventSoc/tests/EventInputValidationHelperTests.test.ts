import { validEvent } from "../src/helpers/EventInputValidationHelper";
import { SocEvent, defaultSocEvent } from "../src/models/SocEvent";

describe("validEvent", () => {
  const mockSetState = () => {};

  test("it should return true if event is valid", () => {
    const socEvent: SocEvent = {
      ...defaultSocEvent(),
      name: "name",
      location: "location",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(validEvent(socEvent, mockSetState, mockSetState)).toBe(true);
  });

  test("it should return false if the event's name is empty", () => {
    const socEvent: SocEvent = {
      ...defaultSocEvent(),
      location: "location",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(validEvent(socEvent, mockSetState, mockSetState)).toBe(false);
  });

  test("it should return false if event's location is empty", () => {
    const socEvent: SocEvent = {
      ...defaultSocEvent(),
      name: "name",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(validEvent(socEvent, mockSetState, mockSetState)).toBe(false);
  });

  test("it should return false if the event starts in the past", () => {
    const socEvent: SocEvent = {
      ...defaultSocEvent(),
      name: "name",
      location: "location",
      startDate: new Date(2000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(validEvent(socEvent, mockSetState, mockSetState)).toBe(false);
  });

  test("it should return false if the event ends after it starts", () => {
    const socEvent: SocEvent = {
      ...defaultSocEvent(),
      name: "name",
      location: "location",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(2000, 1, 2)
    };

    expect(validEvent(socEvent, mockSetState, mockSetState)).toBe(false);
  });
});
