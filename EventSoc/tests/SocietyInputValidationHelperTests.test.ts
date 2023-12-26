import { validSociety } from "../src/helpers/SocietyInputValidationHelper";
import { Society, defaultSociety } from "../src/models/Society";

describe("validSociety", () => {
  const mockSetState = () => {};

  test("it should return true if society is valid", () => {
    const soc: Society = {
      ...defaultSociety(),
      name: "name",
      exec: ["a"]
    };

    expect(validSociety(soc, mockSetState, mockSetState)).toBe(true);
  });

  test("it should return false if the society's name is empty", () => {
    const soc: Society = {
      ...defaultSociety(),
      exec: ["a"]
    };

    expect(validSociety(soc, mockSetState, mockSetState)).toBe(false);
  });

  test("it should return false if society has no exec members", () => {
    const soc: Society = {
      ...defaultSociety(),
      name: "name"
    };

    expect(validSociety(soc, mockSetState, mockSetState)).toBe(false);
  });
});
