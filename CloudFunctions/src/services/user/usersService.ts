import { UserInterests } from "../../../../Shared/models/User";
import { usersCol } from "../../firestoreConfig";
import { docToUserOverview } from "../../narrowMappers/toNarrowUser";

export function retrieveUserOverview(userId: string) {
  return usersCol.doc(userId).get().then(docToUserOverview);
}

export function retrieveUsersInterests(): Promise<UserInterests[]> {
  return usersCol
    .select("interests")
    .get()
    .then((usersSnapshot) =>
      usersSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          interests: doc.data().interests
        };
      })
    );
}
