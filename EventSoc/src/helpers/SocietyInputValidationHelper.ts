import { Society } from "../models/Society";

/**
 * Returns whether the society is valid
 * If the society is invalid, sets the error message and alert dialog states
 */
export function validSociety(
  society: Society,
  setInputErrMsg: React.Dispatch<React.SetStateAction<string>>,
  setShowAlertDialog: React.Dispatch<React.SetStateAction<boolean>>
) {
  const errMsg = getSocietyErrMsg(society.name, society.exec);
  setInputErrMsg(errMsg);

  const valid = errMsg ? false : true;
  setShowAlertDialog(!valid);
  return valid;
}

/**
 * Returns an empty string if the society is valid, and an appropriate error message otherwise
 */
function getSocietyErrMsg(name: string, exec: string[]) {
  let errMsg = "";

  if (name && exec.length > 0) {
    return errMsg;
  }

  if (!name) {
    errMsg = "Your society must have a name.\n";
  }

  if (exec.length === 0) {
    errMsg += "Your society must have at least one exec member.\n";
  }

  // If there's a trailing newline character, remove it
  return errMsg.endsWith("\n") ? errMsg.slice(0, -1) : errMsg;
}
