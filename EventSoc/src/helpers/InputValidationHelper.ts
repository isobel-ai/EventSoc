/**
 * Returns an empty string if the event is valid, and an appropriate error message otherwise
 */
export function validateEvent(name: string, startDate: Date, endDate: Date) {
  let errMsg = "";

  const validDate = startDate >= new Date() && startDate <= endDate;

  if (name && validDate) {
    return errMsg;
  }

  if (!name) {
    errMsg = "Your event must have a name.";
    if (!validDate) {
      errMsg +=
        "\n" + "Your event must start in the future and end after it starts.";
    }
  } else {
    errMsg = "An event must start in the future and end after it starts.";
  }
  return errMsg;
}
