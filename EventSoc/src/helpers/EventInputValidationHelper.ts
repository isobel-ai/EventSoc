import { EventData } from "../../../Shared/models/Event";

/**
 * Returns an empty string if the event is valid, and an appropriate error message otherwise
 */
export function getEventErrMsg(event: EventData) {
  let errMsg = "";

  const validDate =
    event.startDate >= new Date() && event.startDate <= event.endDate;

  if (event.name && event.location && validDate) {
    return errMsg;
  }

  if (!event.name) {
    errMsg = "Your event must have a name.\n";
  }

  if (!event.location) {
    errMsg += "Your event must have a location.\n";
  }

  if (!validDate) {
    errMsg += "Your event must start in the future and end after it starts.";
  }

  // If there's a trailing newline character, remove it
  return errMsg.endsWith("\n") ? errMsg.slice(0, -1) : errMsg;
}
