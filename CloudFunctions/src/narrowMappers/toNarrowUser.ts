import { UserData, UserOverview } from "../../../Shared/models/User";
import { isUndefined } from "lodash";

export function userToOverviewUpdates(userDataUpdates: Partial<UserData>) {
  const userOverviewUpdates: Partial<UserOverview> = {};
  if (!isUndefined(userDataUpdates.name)) {
    userOverviewUpdates.name = userDataUpdates.name;
  }
  if (!isUndefined(userDataUpdates.notificationTokens)) {
    userOverviewUpdates.notificationTokens = userDataUpdates.notificationTokens;
  }
  return userOverviewUpdates;
}

export function userToOverview(userId: string, userData: UserData) {
  const userOverview: UserOverview = {
    id: userId,
    name: userData.name,
    notificationTokens: userData.notificationTokens
  };
  return userOverview;
}

export function docToUserOverview(
  doc: FirebaseFirestore.DocumentSnapshot<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Couldn't retrieve ${doc.ref.path} data`);
  }

  const userOverview: UserOverview = {
    id: doc.id,
    name: data.name,
    notificationTokens: data.notificationTokens
  };
  return userOverview;
}
