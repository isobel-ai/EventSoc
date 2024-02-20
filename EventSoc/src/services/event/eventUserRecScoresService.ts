import { doc, getDoc } from "firebase/firestore";
import { eventUserRecScoresCol } from "../../config/firebaseConfig";
import { docToModel } from "../../mappers/docToModel";
import { UserRecScore } from "../../../../Shared/models/User";

export function retrieveEventUserRecScore(eventId: string, userId: string) {
  return getDoc(doc(eventUserRecScoresCol(eventId), userId))
    .then(docToModel<UserRecScore>)
    .then(
      (userRecScore) => userRecScore.tagScore + userRecScore.organiserScore
    );
}
