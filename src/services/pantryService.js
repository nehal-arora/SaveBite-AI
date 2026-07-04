import { db } from "./firebase";
import {
  collection,
 addDoc,
 getDocs,
 query,
 where,
 serverTimestamp,
 deleteDoc,
 doc,
 updateDoc
} from "firebase/firestore";

export async function addPantryItem(item,userId){

    const docRef=await addDoc(
        collection(db,"pantry"),
        {
            ...item,
            userId,
            createdAt:serverTimestamp()
        }
    );

    return docRef.id;
}

export async function getPantryItems(userId){

    const q=query(
        collection(db,"pantry"),
        where("userId","==",userId)
    );

    const snapshot=await getDocs(q);

    return snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
    }));
}

export async function deletePantryItem(id){

    await deleteDoc(doc(db,"pantry",id));

}

export async function updatePantryItem(id,data){

    await updateDoc(
        doc(db,"pantry",id),
        data
    );

}