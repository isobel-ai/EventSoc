export function retrieveEventData(eventId: string) {
  return getDoc(doc(eventsCol, eventId)).then(docToEventData);
}

export function retrieveEventOverview(
  eventId: string,
  transaction: Transaction
) {
  return transaction
    .get(doc(eventsCol, eventId))
    .then(docToEventOverviewNarrow);
}

export function retrieveUpcomingEvents() {
  return getDocs(
    query(eventsCol, where("endDate", ">", new Date()), orderBy("endDate"))
  ).then((eventsSnapshot) =>
    eventsSnapshot.docs
      .map(docToEventDoc)
      .sort((a, b) => a.data.startDate.getTime() - b.data.startDate.getTime())
  );
}

export function retrieveEventImage(eventId: string) {
  return downloadImage(eventPicturesRef, eventId);
}

export async function updateEvent(
  eventId: string,
  updates: Partial<EventData>,
  newImage?: string
) {
  if (!isUndefined(newImage)) {
    await updateImage(eventPicturesRef, eventId, newImage);
  }
  await updateDoc(doc(eventsCol, eventId), updates);
}
