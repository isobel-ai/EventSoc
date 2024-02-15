export function retrieveUserOverview(
  userId: string,
  transaction?: Transaction
) {
  return isUndefined(transaction)
    ? getDoc(doc(usersCol, userId)).then(docToUserOverviewNarrow)
    : transaction.get(doc(usersCol, userId)).then(docToUserOverviewNarrow);
}
