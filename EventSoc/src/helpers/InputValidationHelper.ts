import { CreateSocEvent } from "../models/SocEvent";

/**
 * Returns whether the event is valid
 * If the event is invalid, sets the error message and alert dialog states
 */
export function validEvent(
  createSocEvent: CreateSocEvent,
  setInputErrMsg: React.Dispatch<React.SetStateAction<string>>,
  setShowAlertDialog: React.Dispatch<React.SetStateAction<boolean>>
) {
  const errMsg = getEventErrMsg(
    createSocEvent.socEvent.name,
    createSocEvent.socEvent.startDate,
    createSocEvent.socEvent.endDate
  );
  setInputErrMsg(errMsg);

  const valid = errMsg ? false : true;
  setShowAlertDialog(!valid);
  return valid;
}

/**
 * Returns an empty string if the event is valid, and an appropriate error message otherwise
 */
function getEventErrMsg(name: string, startDate: Date, endDate: Date) {
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
