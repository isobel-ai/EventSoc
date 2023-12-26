import { validEmail } from "../src/helpers/AuthInputValidationHelper";

describe("validEmail", () => {
  test("it should return true if the email is valid", () => {
    const email = "valid@warwick.ac.uk";

    expect(validEmail(email)).toBe(true);
  });

  test("it should return false if the email is invalid", () => {
    const email = "in@valid@warwick.ac.uk";

    expect(validEmail(email)).toBe(false);
  });

  test("it should return false if the email is invalid (not warwick email)", () => {
    const email = "in@valid@gmail.com";

    expect(validEmail(email)).toBe(false);
  });
});
