import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDm1tq9FEmOYRA_hPcq1Gc7DTiBm07aiMQ",
  authDomain: "finditnus-7a17d.firebaseapp.com",
  projectId: "finditnus-7a17d",
  storageBucket: "finditnus-7a17d.firebasestorage.app",
  messagingSenderId: "465881690353",
  appId: "1:465881690353:web:b2e5c6541d394b72aa7950"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getItemData = async () => {
    const docRef = doc(db, "ItemData", "Current");
    const docSnap = await getDoc(docRef);
 
    return {
        ItemName: docSnap.data().ItemName,
        Location: docSnap.data().Location,
        ContactNumber: docSnap.data().ContactNumber
    }
}

export {getItemData}