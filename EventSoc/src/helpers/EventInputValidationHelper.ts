import { SocEvent } from "../models/SocEvent";

/**
 * Returns whether the event is valid
 * If the event is invalid, sets the error message and alert dialog states
 */
export function validEvent(
  socEvent: SocEvent,
  setInputErrMsg: React.Dispatch<React.SetStateAction<string>>,
  setShowAlertDialog: React.Dispatch<React.SetStateAction<boolean>>
) {
  const errMsg = getEventErrMsg(
    socEvent.name,
    socEvent.location,
    socEvent.startDate,
    socEvent.endDate
  );
  setInputErrMsg(errMsg);

  const valid = errMsg ? false : true;
  setShowAlertDialog(!valid);
  return valid;
}

/**
 * Returns an empty string if the event is valid, and an appropriate error message otherwise
 */
function getEventErrMsg(
  name: string,
  location: string,
  startDate: Date,
  endDate: Date
) {
  let errMsg = "";

  const validDate = startDate >= new Date() && startDate <= endDate;

  if (name && location && validDate) {
    return errMsg;
  }

  if (!name) {
    errMsg = "Your event must have a name.\n";
  }

  if (!location) {
    errMsg += "Your event must have a location.\n";
  }

  if (!validDate) {
    errMsg += "Your event must start in the future and end after it starts.";
  }

  // If there's a trailing newline character, remove it
  return errMsg.endsWith("\n") ? errMsg.slice(0, -1) : errMsg;
}
