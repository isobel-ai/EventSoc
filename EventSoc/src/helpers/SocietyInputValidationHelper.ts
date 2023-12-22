import { Society } from "../models/Society";

/**
 * Returns whether the society is valid
 * If the event is invalid, sets the error message and alert dialog states
 */
export function validSociety(
  society: Society,
  setInputErrMsg: React.Dispatch<React.SetStateAction<string>>,
  setShowAlertDialog: React.Dispatch<React.SetStateAction<boolean>>
) {
  const errMsg = society.name ? "" : "Your society must have a name.";
  setInputErrMsg(errMsg);

  const valid = errMsg ? false : true;
  setShowAlertDialog(!valid);
  return valid;
}
