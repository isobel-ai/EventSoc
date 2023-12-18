import { getDocs, query, where } from "firebase/firestore";
import { societiesCol } from "../config/firebaseConfig";
import { RetrieveSociety } from "../models/Society";
import { retrieveUser } from "./usersService";

export function retrieveSocieties(
  setSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>
) {
  getDocs(societiesCol)
    .then((societiesSnapshot) => {
      const societyList = societiesSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as RetrieveSociety;
      });
      setSocieties(societyList);
    })
    .catch((err) => console.log("Error: ", err));
}

export function retrieveAllAndExecSocieties(
  setSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>,
  setExecSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>
) {
  retrieveSocieties(setSocieties);

  // Retrieve societies user is exec of
  retrieveUser()
    .then((user) => user.name)
    .then((name) =>
      getDocs(query(societiesCol, where("exec", "array-contains", name)))
        .then((societiesSnapshot) => {
          const societyList = societiesSnapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as RetrieveSociety;
          });
          setExecSocieties(societyList);
        })
        .catch((err) => console.log("Error: ", err))
    );
}
