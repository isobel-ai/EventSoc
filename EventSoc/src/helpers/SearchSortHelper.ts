/**
 * @param searchKeys An array of keys of O that correspond to string([]) values.
 *
 * Use dot notation for multi-dimensional keys, e.g. obj.key
 */
export function searchFilter<O>(
  searchFor: string,
  searchIn: O[],
  searchKeys: string[]
) {
  const formattedSearchFor = searchFor.toUpperCase();
  const filteredSearchIn = searchIn.filter((item) =>
    searchKeys.some((key) => {
      const itemProp = getObjectProperty(item, key);
      if (Array.isArray(itemProp)) {
        return itemProp.some((prop) => {
          const formattedProp = String(prop).toUpperCase();
          return formattedProp.includes(formattedSearchFor);
        });
      }
      const formattedItem = String(itemProp).toUpperCase();
      return formattedItem.includes(formattedSearchFor);
    })
  );
  return filteredSearchIn;
}

function getObjectProperty<O>(obj: O, key: string) {
  const keys = key.split(".");
  let property: any = obj[keys[0] as keyof O];
  for (let i = 1; i < keys.length; i++) {
    property = property[keys[i] as keyof typeof property];
  }
  return property;
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
