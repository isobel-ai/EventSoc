export function createSocietyExec(
  socId: string,
  socName: string,
  exec: UserOverview[],
  batch: WriteBatch
) {
  exec.forEach((member) => {
    const { id, ...data } = member;
    batch.set(doc(societyExecCol(socId), id), data);
    batch.set(doc(userExecMemberSocieties(id), socId), {
      id: socId,
      name: socName
    });
  });
}

export function retrieveSocietyExec(socId: string) {
  return getDocs(societyExecCol(socId)).then((execSnapshot) =>
    execSnapshot.docs.map(docToModel<UserOverview>)
  );
}
export function updateSocietyExec(
  socName: Name,
  updates: ArrayUpdates<UserOverview>,
  transaction: Transaction
) {
  const { id: socId, ...nameData } = socName;

  updates.createObjs.forEach((createdMember) => {
    const { id: memberId, ...data } = createdMember;
    transaction.set(doc(societyExecCol(socId), memberId), data);
    transaction.set(doc(userExecMemberSocieties(memberId), socId), nameData);
  });

  updates.updateObjs.forEach((updatedMember) => {
    const { id: memberId, ...data } = updatedMember;
    transaction.update(doc(societyExecCol(socId), memberId), data);
  });

  updates.deleteObjs.forEach((deletedMember) => {
    transaction.delete(doc(societyExecCol(socId), deletedMember.id));
    transaction.delete(doc(userExecMemberSocieties(deletedMember.id), socId));
  });
}
