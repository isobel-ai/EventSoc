import { usersCol } from "../firestoreConfig";
import { UserData } from "../../../Models/User";

function retrieveUserData(id: string) {
  return usersCol
    .doc(id)
    .get()
    .then((userSnapshot) => <UserData>userSnapshot.data())
    .catch(() => {
      throw Error("User couldn't be retrieved. Try again later.");
    });
}

export function getNotificationTokens(userIds: string[]) {
  const getUsers = userIds.map((uid) =>
    retrieveUserData(uid).catch(() => {
      return Error();
    })
  );

  return Promise.all(getUsers).then((results) => {
    const users = <UserData[]>(
      results.filter((result) => !(result instanceof Error))
    );
    return users.flatMap((user) => user.notificationTokens);
  });
}

export function getUserName(userId: string) {
  return retrieveUserData(userId).then((userData) => userData.name);
}
