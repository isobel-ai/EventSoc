import { doc, getDocs, setDoc } from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import { CreateSocEvent, RetrieveSocEvent } from "../models/SocEvent";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export function retrieveManagedEvents(
  setManagedEvents: React.Dispatch<React.SetStateAction<RetrieveSocEvent[]>>
) {
  getDocs(eventsCol)
    .then((eventsSnapshot) => {
      const eventList = eventsSnapshot.docs.map((doc) => {
        return { id: doc.id, socEvent: doc.data() } as RetrieveSocEvent;
      });
      setManagedEvents(eventList);
    })
    .catch((err) => console.log("Error: ", err));
}

export function retrieveEventPicture(
  picUrl: string,
  setImgUrl: React.Dispatch<React.SetStateAction<string>>
) {
  getDownloadURL(ref(eventPicturesRef, picUrl))
    .then((url) => setImgUrl(url))
    .catch((err) => console.log(err));
}

function uploadEventImage(srcUrl: string, destUrl: string) {
  const destRef = ref(eventPicturesRef, destUrl);
  fetch(srcUrl)
    .then((res) => res.blob())
    .then((blob) => uploadBytes(destRef, blob))
    .catch((err) => console.log(err));
}

export function createEvent(createSocEvent: CreateSocEvent) {
  const eventRef = doc(eventsCol);

  if (createSocEvent.socEvent.hasPicture) {
    uploadEventImage(createSocEvent.pictureURL, eventRef.id);
  }

  setDoc(eventRef, createSocEvent.socEvent).catch((err) => console.log(err));
}
