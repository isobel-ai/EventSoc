import { SocietyData } from "../../../Models/Society";

/**
 * Returns an empty string if the society is valid, and an appropriate error message otherwise
 */
export function getSocietyErrMsg(society: SocietyData) {
  let errMsg = "";

  if (society.name && society.execIds.length > 0) {
    return errMsg;
  }

  if (!society.name) {
    errMsg = "Your society must have a name.\n";
  }

  if (society.execIds.length === 0) {
    errMsg += "Your society must have at least one exec member.\n";
  }

  // If there's a trailing newline character, remove it
  return errMsg.endsWith("\n") ? errMsg.slice(0, -1) : errMsg;
}
