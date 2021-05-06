import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from "./firebaseConfig";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

/* Google Auth*/
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
