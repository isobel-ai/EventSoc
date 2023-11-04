import { getDocs } from "firebase/firestore";
import { eventsCol } from "../config/firebaseConfig";
import SocEvent from "../models/SocEvent";

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
