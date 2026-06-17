import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, collectionGroup, setDoc, getDoc, updateDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

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