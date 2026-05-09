import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import type { User, Match } from "@/types";

/**
 * Crea un documento de usuario en Firestore al registrarse.
 */
export async function createUserDocument(
  uid: string,
  name: string,
  email: string
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado. Verificá la configuración de Firebase.");
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    name,
    email,
    plan: "free",
    createdAt: serverTimestamp(),
  });
}

/**
 * Obtiene el perfil de usuario desde Firestore.
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  if (!db) return null;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
}

/**
 * Crea un documento de partido en Firestore después de subir un video.
 */
export async function createMatchDocument(
  userId: string,
  title: string,
  sport: string,
  videoUrl: string
): Promise<string> {
  if (!db) throw new Error("Firestore no está inicializado. Verificá la configuración de Firebase.");
  const matchesRef = collection(db, "matches");
  const docRef = await addDoc(matchesRef, {
    userId,
    title,
    sport,
    videoUrl,
    status: "uploaded",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Obtiene los partidos de un usuario ordenados por fecha.
 */
export async function getUserMatches(userId: string): Promise<Match[]> {
  if (!db) return [];
  const matchesRef = collection(db, "matches");
  const q = query(matchesRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Match[];
}
