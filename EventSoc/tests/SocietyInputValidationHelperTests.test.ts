import { getSocietyErrMsg } from "../src/helpers/SocietyInputValidationHelper";
import { SocietyData, defaultSocietyData } from "../../Shared/models/Society";
import { UserOverview, defaultUserOverview } from "../../Shared/models/User";

describe("getSocietyErrMsg", () => {
  test("it should return an empty string if the society is valid", () => {
    const soc: SocietyData = {
      ...defaultSocietyData(),
      name: "name"
    };

    expect(getSocietyErrMsg(soc)).toBe("");
  });

  test("it should return an appropriate error message if the society's name is empty", () => {
    const soc: SocietyData = {
      ...defaultSocietyData()
    };

    const exec: UserOverview[] = [defaultUserOverview()];

    expect(getSocietyErrMsg(soc, exec)).toBe("Your society must have a name.");
  });

  test("it should return an appropriate error message if society has no exec members", () => {
    const soc: SocietyData = {
      ...defaultSocietyData(),
      name: "name"
    };

    const exec: UserOverview[] = [];

    expect(getSocietyErrMsg(soc, exec)).toBe(
      "Your society must have at least one exec member."
    );
  });

  test("it should return an appropriate message if the society is invalid for multiple reasons", () => {
    const soc: SocietyData = defaultSocietyData();

    const exec: UserOverview[] = [];

    expect(getSocietyErrMsg(soc, exec)).toBe(
      "Your society must have a name.\nYour society must have at least one exec member."
    );
  });
});
