import { SocietyData } from "../../../Models/Society";
import { societiesCol } from "../firestoreConfig";

export function getExec(socId: string) {
  return societiesCol
    .doc(socId)
    .get()
    .then((socSnapShot) => (<SocietyData>socSnapShot.data()).execIds);
}
