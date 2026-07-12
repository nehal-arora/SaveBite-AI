import { db } from "./firebase";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export async function saveDonation(donation) {

  try {

    await addDoc(

      collection(db, "donations"),

      {
        ...donation,
        createdAt: serverTimestamp()
      }

    );

    return true;

  } catch (error) {

    console.error(error);

    return false;

  }

}