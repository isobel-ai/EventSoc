export function searchFilter<O>(
  searchFor: string,
  searchIn: O[],
  searchKeys: string[]
) {
  const formattedSearchFor = searchFor.toUpperCase();
  const filteredSearchIn = searchIn.filter((item) =>
    searchKeys.some((key) => {
      const formattedItem = (item[key as keyof O] as string).toUpperCase();
      return formattedItem.includes(formattedSearchFor);
    })
  );
  return filteredSearchIn;
}

export function sortByString<O>(o1: O, o2: O, sortKey: string) {
  const formattedO1 = (o1[sortKey as keyof O] as string).toUpperCase();
  const formattedO2 = (o2[sortKey as keyof O] as string).toUpperCase();
  if (formattedO1 < formattedO2) {
    return -1;
  }
  if (formattedO1 === formattedO2) {
    return 0;
  }
  return 1;
}
