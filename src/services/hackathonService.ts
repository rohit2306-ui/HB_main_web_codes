import { db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export type NewHackathon = {
  name: string;
  description: string;
  theme?: string;
  place?: string;
  city?: string;
  thumbnail?: string;
  date?: string;
  isOnline?: boolean;
  price?: string;
  createdBy: string;
};

export async function createHackathon(data: NewHackathon) {
  const docRef = await addDoc(collection(db, "hackathons"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export default { createHackathon };
