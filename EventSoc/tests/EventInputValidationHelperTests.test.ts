import { getEventErrMsg } from "../src/helpers/EventInputValidationHelper";
import { Event, defaultEvent } from "../src/models/Event";

describe("getEventErrMsg", () => {
  test("it should return an empty string if event is valid", () => {
    const event: Event = {
      ...defaultEvent(),
      name: "name",
      location: "location",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(getEventErrMsg(event)).toBe("");
  });

  test("it should return an appropriate message if the event's name is empty", () => {
    const event: Event = {
      ...defaultEvent(),
      location: "location",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(getEventErrMsg(event)).toBe("Your event must have a name.");
  });

  test("it should return an appropriate message if the event's location is empty", () => {
    const event: Event = {
      ...defaultEvent(),
      name: "name",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(getEventErrMsg(event)).toBe("Your event must have a location.");
  });

  test("it should return an appropriate message if the event starts in the past", () => {
    const event: Event = {
      ...defaultEvent(),
      name: "name",
      location: "location",
      startDate: new Date(2000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(getEventErrMsg(event)).toBe(
      "Your event must start in the future and end after it starts."
    );
  });

  test("it should return an appropriate message if the event ends after it starts", () => {
    const event: Event = {
      ...defaultEvent(),
      name: "name",
      location: "location",
      startDate: new Date(3000, 1, 1),
      endDate: new Date(2000, 1, 2)
    };

    expect(getEventErrMsg(event)).toBe(
      "Your event must start in the future and end after it starts."
    );
  });

  test("it should return an appropriate message if the event is invalid for multiple reasons", () => {
    const event: Event = {
      ...defaultEvent(),
      startDate: new Date(3000, 1, 1),
      endDate: new Date(3000, 1, 2)
    };

    expect(getEventErrMsg(event)).toBe(
      "Your event must have a name.\nYour event must have a location."
    );
  });
});
