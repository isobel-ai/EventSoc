import { getDocs } from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import SocEvent from "../models/SocEvent";
import { getDownloadURL, ref } from "firebase/storage";

export function getManagedEvents(
  setManagedEvents: React.Dispatch<React.SetStateAction<SocEvent[]>>
) {
  getDocs(eventsCol)
    .then((eventsSnapshot) => {
      const eventList = eventsSnapshot.docs.map(
        (doc) => doc.data() as SocEvent
      );
      setManagedEvents(eventList);
    })
    .catch((err) => console.log("Error: ", err));
}

export function getEventPicture(
  picUrl: string,
  setImgUrl: React.Dispatch<React.SetStateAction<string>>
) {
  getDownloadURL(ref(eventPicturesRef, picUrl))
    .then((url) => {
      setImgUrl(url);
    })
    .catch((err) => {
      console.log(err);
    });
}
