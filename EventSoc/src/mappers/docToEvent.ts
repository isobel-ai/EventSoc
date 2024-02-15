export function docToEventOverviewNarrow(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  const eventOverview: EventOverview = {
    id: doc.id,
    name: data.name,
    organiserId: data.organiser.id,
    startDate: data.startDate.toDate(),
    endDate: data.endDate.toDate()
  };

  return eventOverview;
}
