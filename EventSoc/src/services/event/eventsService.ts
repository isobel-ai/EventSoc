export function retrieveEventImage(eventId: string) {
  return downloadImage(eventPicturesRef, eventId);
}
