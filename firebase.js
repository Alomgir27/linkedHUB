import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS_1U-rdTreZdoTTldJj_iGcmTWkzL574",
  authDomain: "linkedhub-9b776.firebaseapp.com",
  databaseURL: "https://linkedhub-9b776-default-rtdb.firebaseio.com",
  projectId: "linkedhub-9b776",
  storageBucket: "linkedhub-9b776.appspot.com",
  messagingSenderId: "509910380583",
  appId: "1:509910380583:web:cb421228128d11ea0c1e02",
  measurementId: "G-XX5M2TTBM2"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = firebase.firestore();
const fs = firebase.firestore;
const auth = firebase.auth();
//const storage = firebase.storage();

export { db, auth, fs };
export default firebase;
