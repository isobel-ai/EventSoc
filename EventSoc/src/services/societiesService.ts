import { doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { societiesCol, societyPicturesRef } from "../config/firebaseConfig";
import { CreateSociety, RetrieveSociety } from "../models/Society";
import { retrieveUser } from "./usersService";
import { uploadImage } from "./cloudService";
import { sortByString } from "../helpers/SearchSortHelper";
import { RetrieveSocEvent } from "../models/SocEvent";
import { retrieveEvent } from "./eventsService";

export function retrieveSocieties(
  setSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>
) {
  getDocs(societiesCol)
    .then((societiesSnapshot) => {
      const societyList = societiesSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as RetrieveSociety;
      });
      societyList.sort((s1, s2) => sortByString(s1, s2, "name"));
      setSocieties(societyList);
    })
    .catch((err) => console.log("Error: ", err));
}

export function retrieveExecSocieties(
  setExecSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>
) {
  retrieveUser()
    .then((user) => user.name)
    .then((name) =>
      getDocs(query(societiesCol, where("exec", "array-contains", name)))
        .then((societiesSnapshot) => {
          const societyList = societiesSnapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as RetrieveSociety;
          });
          societyList.sort((s1, s2) => sortByString(s1, s2, "name"));
          setExecSocieties(societyList);
        })
        .catch((err) => console.log("Error: ", err))
    );
}

export function createSociety(createSociety: CreateSociety) {
  const socRef = doc(societiesCol);

  const { localPictureUrl: localPictureURL, ...soc } = createSociety;

  if (localPictureURL) {
    return uploadImage(societyPicturesRef, localPictureURL, socRef.id)
      .then((url) => setDoc(socRef, { ...soc, pictureUrl: url }))
      .catch((err) => console.log(err));
  }

  return setDoc(socRef, soc).catch((err) => console.log(err));
}

export function retrieveSocEvents(
  socId: string,
  setEvents: React.Dispatch<React.SetStateAction<RetrieveSocEvent[]>>
) {
  setEvents([]);

  getDoc(doc(societiesCol, socId))
    .then((socSnapshot) => {
      const { eventRefs } = socSnapshot.data() as RetrieveSociety;
      const events: RetrieveSocEvent[] = [];
      eventRefs.forEach((ref) =>
        retrieveEvent(ref).then((event) => event && events.push(event))
      );
      setEvents(events);
    })
    .catch((err) => console.log("Error: ", err));
}
