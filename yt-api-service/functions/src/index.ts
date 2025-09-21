import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const createUser = functions.auth.user().onCreate(async (user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  await db.collection("users").doc(user.uid).set(userInfo);
  console.log(`✅ User created: ${JSON.stringify(userInfo)}`);
});
