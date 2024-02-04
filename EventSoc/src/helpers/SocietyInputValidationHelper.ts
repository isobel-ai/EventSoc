import { SocietyData } from "../../../Models/src/Society";
import { UserOverview } from "../../../Models/src/User";

/**
 * Returns an empty string if the society is valid, and an appropriate error message otherwise
 */
export function getSocietyErrMsg(society: SocietyData, exec: UserOverview[]) {
  let errMsg = "";

  if (society.name && exec.length > 0) {
    return errMsg;
  }

  if (!society.name) {
    errMsg = "Your society must have a name.\n";
  }

  if (exec.length === 0) {
    errMsg += "Your society must have at least one exec member.\n";
  }

  // If there's a trailing newline character, remove it
  return errMsg.endsWith("\n") ? errMsg.slice(0, -1) : errMsg;
}
