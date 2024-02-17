import { isUndefined } from "lodash";
import { SocietyData } from "../../../Shared/models/Society";
import { UserOverview } from "../../../Shared/models/User";

/**
 * Returns an empty string if the society is valid, and an appropriate error message otherwise
 */
export function getSocietyErrMsg(society: SocietyData, exec?: UserOverview[]) {
  let errMsg = "";

  if (society.name && (isUndefined(exec) || exec.length > 0)) {
    return errMsg;
  }

  if (!society.name) {
    errMsg = "Your society must have a name.\n";
  }

  if (!isUndefined(exec) && exec.length === 0) {
    errMsg += "Your society must have at least one exec member.\n";
  }

  // If there's a trailing newline character, remove it
  return errMsg.endsWith("\n") ? errMsg.slice(0, -1) : errMsg;
}
