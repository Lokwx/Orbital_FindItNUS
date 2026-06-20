import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, collectionGroup, setDoc, getDoc, updateDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfWCokIAFl9cB4YF8iod7z-IgbTA60x0k",
  authDomain: "finditnus.firebaseapp.com",
  projectId: "finditnus",
  storageBucket: "finditnus.firebasestorage.app",
  messagingSenderId: "546796211311",
  appId: "1:546796211311:web:be849a5f789850ed2d119a",
  measurementId: "G-8Q8ET4XXMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const getItemData = async () => {
//     const docRef = doc(db, "ItemData", "Current");
//     const docSnap = await getDoc(docRef);
 
//     return {
//         ItemName: docSnap.data().ItemName,
//         Location: docSnap.data().Location,
//         ContactNumber: docSnap.data().ContactNumber
//     }
// }

const getRecentItemData = async (itemLimit = 50) => {
    const collectionRef = collection(db, "listings");
    const recentItems = query(collectionRef, orderBy("UserSubmitTiming", "desc"), limit(itemLimit));
    const collectionSnap = await getDocs(recentItems);

    const items = [];
    for (const itemDoc of collectionSnap.docs){
        const itemData = itemDoc.data();

        const item = {
            id: itemDoc.id,

            UserID: itemData.UserID,
            UserName: itemData.UserName,

            ReportType: itemData.ReportType,
            ItemName: itemData.ItemName,
            ItemCategory: itemData.ItemCategory,
            ItemDescription: itemData.ItemDescription,

            ItemLocationInput: itemData.ItemLocationInput,
            ItemLocation: itemData.ItemLocation,
            ItemLocationDetail: itemData.ItemLocationDetail,
            Latitude: itemData.Latitude,
            Longitude: itemData.Longitude,

            UserSubmitTiming: itemData.UserSubmitTiming,
            Year: itemData.Year,
            Month: itemData.Month,
            Day: itemData.Day,
            Hour: itemData.Hour,
            Minute: itemData.Minute,
            Second: itemData.Second,

            imageUrl: itemData.imageUrl,
            cloudinaryPublicID: itemData.cloudinaryPublicID,
            status: itemData.Status,
        };

        items.push(item);
    }

    return items;
}

const getAllItemData = async () => {
    const collectionRef = collection(db, "listings");
    const collectionSnap = await getDocs(collectionRef);

    const items = [];
    for (const itemDoc of collectionSnap.docs) {
        const itemData = itemDoc.data();

        const item = {
            id: itemDoc.id,

            UserID: itemData.UserID,
            UserName: itemData.UserName,

            ReportType: itemData.ReportType,
            ItemName: itemData.ItemName,
            ItemCategory: itemData.ItemCategory,
            ItemDescription: itemData.ItemDescription,

            ItemLocationInput: itemData.ItemLocationInput,
            ItemLocation: itemData.ItemLocation,
            ItemLocationDetail: itemData.ItemLocationDetail,
            Latitude: itemData.Latitude,
            Longitude: itemData.Longitude,

            UserSubmitTiming: itemData.UserSubmitTiming,
            Year: itemData.Year,
            Month: itemData.Month,
            Day: itemData.Day,
            Hour: itemData.Hour,
            Minute: itemData.Minute,
            Second: itemData.Second,

            imageUrl: itemData.imageUrl,
            cloudinaryPublicID: itemData.cloudinaryPublicID,
            status: itemData.Status,
        };

        items.push(item);
    }

    return items;
}

export {getRecentItemData, getAllItemData}