export function retrieveSocietyNames() {
  return retrieveNames(societyNamesCol);
}

export function retrieveDoesSocietyNameExist(name: string) {
  return getCountFromServer(
    query(societyNamesCol, where("name", "==", name))
  ).then((result) => Boolean(result.data().count));
}

function retrieveNames(col: CollectionReference<DocumentData, DocumentData>) {
  return getDocs(col).then((namesSnapshot) => {
    const unorderedNames = namesSnapshot.docs.map(docToModel<Name>);
    return unorderedNames.sort((a, b) => a.name.localeCompare(b.name));
  });
}
