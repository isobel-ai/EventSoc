export function retrieveDoesSocietyNameExist(name: string) {
  return getCountFromServer(
    query(societyNamesCol, where("name", "==", name))
  ).then((result) => Boolean(result.data().count));
}
