
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2FRmS_yNP1s5LKQ3oyk6jxa-SVNTXgEM",
  authDomain: "dntgiuaky.firebaseapp.com",
  projectId: "dntgiuaky",
  storageBucket: "dntgiuaky.appspot.com",
  messagingSenderId: "946057583315",
  appId: "1:946057583315:web:329ffb61e6af609378d226",
};
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
