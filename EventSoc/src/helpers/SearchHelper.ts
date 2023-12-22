export function searchFilter<O>(
  searchFor: string,
  searchIn: O[],
  searchKey: string
) {
  const formattedSearchFor = searchFor.toUpperCase();
  const filteredSearchIn = searchIn.filter((item) => {
    const formattedItem = (item[searchKey as keyof O] as string).toUpperCase();
    return formattedItem.includes(formattedSearchFor);
  });
  return filteredSearchIn;
}
