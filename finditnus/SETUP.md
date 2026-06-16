# Setup Documentation

This document serves as the deployment for the FindItNUS ecosystem, including integration between Telegram Bot API, Google Firebase and Cloudinary.

---

## 1. Telegram Bot
* `/start` - Boots up the interactive bot interface.
* `/website` - Provides the web app button to launch the live campus layout view.
* `/manage` - Shows the active listings registered by the user's profile for listing management, such as deletion of listings.

---

## 2. Google Firebase
This allows our Telegram Bot and the Next.js web app to be synchronized in real-time.

* Primary Database: Google Firestore
* Collection: `listings`
* Keys: 
    * Project ID: `finditnus`
    * Auth Domain: `finditnus.firebaseapp.com`
    * Storage Bucket: `finditnus.firebasestorage.app`

---

## 3. Cloudinary 
This allows us to store the images submitted by the users.

* Cloudinary Cloud Name: `dy7cf8d3m`
* Cloudinary Upload Preset: `FindItNUS`
* Cloudinary API Key: `717616377814218`
