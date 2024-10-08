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
