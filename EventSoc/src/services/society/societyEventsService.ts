export async function createSocietyEvent(
  societyId: string,
  eventWithoutOrganiser: EventData,
  image: string
) {
  return runTransaction(db, async (transaction) => {
    const eventWithOrganiser = {
      ...eventWithoutOrganiser,
      organiser: await retrieveSocietyOverview(societyId, transaction)
    };

    const eventId = await createEvent(eventWithOrganiser, image, transaction);

    transaction.set(
      doc(societyEventsCol(societyId), eventId),
      eventDataToOverview(eventId, eventWithOrganiser)
    );
  });
}
