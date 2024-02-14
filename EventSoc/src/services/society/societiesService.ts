export async function createSociety(
  society: SocietyData,
  image: string,
  exec: UserOverview[]
) {
  if (await retrieveDoesSocietyNameExist(society.name)) {
    return Error("Society name taken.");
  }

  const socRef = doc(societiesCol);

  if (image) {
    await uploadImage(image, societyPicturesRef, socRef.id);
  }

  const batch = writeBatch(db);
  batch.set(socRef, society);
  createSocietyExec(socRef.id, society.name, exec, batch);
  await batch.commit();

  return socRef.id;
}
