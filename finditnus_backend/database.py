import logging
import firebase_admin
from firebase_admin import credentials, firestore
from finditnus_backend.config import FIREBASE_KEY_PATH

# Debug checker
logger = logging.getLogger(__name__)
# Initialize db container
db = None

def initialize_database():
    """
    Initializes the Firebase Admin SDK using config.py.
    Authenticate once to avoid crashes.
    """
    global db

    # Guard against multiple initializations
    if db is not None:
        logger.debug("Firebase already initialized.")
        return db
    
    # Log into Firebase
    try: 
        cred = credentials.Certificate(FIREBASE_KEY_PATH)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        logger.info("Firebase initialized successfully.")
        return db
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")
        db = None
        return None
    
def add_item_listing(payload: dict) -> bool:
    """
    Saves a new item listing into the 'listings' collection.
    Returns True if successful, False otherwise.
    """
    global db
    try:
        # If db is not initialized yet
        if db is None:
            initialize_database()

        # If db is still offline
        if db is None:
            logger.error("Database not initialized. Cannot add item listing.")
            return False
        
        # Else, add listing
        db.collection("listings").add(payload)
        logger.info("Successfully added a new item listing to Firestore!")
        return True
    
    except Exception as e:
        logger.error(f"Error adding item listing to Firestore: {e}")
        return False

def add_lost_ticket(payload: dict) -> bool:
    """
    Saves a new active search ticket into the 'lost_tickets' collection
    Returns True if successful, False otherwise.
    """
    global db
    try: 
        # Safety checks
        if db is None:
            initialize_database()

        if db is None:
            logger.error("Database not initialized. Cannot add lost ticket.")
            return False

        db.collection("lost_tickets").add(payload)
        logger.info("Successfully added a new lost ticket to Firestore!")
        return True
    
    except Exception as e:
        logger.error(f"Error adding lost ticket to Firestore: {e}")
        return False

def get_user_listings(chat_id: int) -> list:
    """
    Fetches active or reclaimed item listings for a given user.
    Used for /manage on Telegram Bot
    Returns a list if successful, or an empty list.
    """
    global db
    try: 
        # Safety checks
        if db is None:
            initialize_database()

        if db is None:
            logger.error("Cannot fetch user listings.")
            return []
        
        # Retrieve from Firestore by user's Telegram chat_id
        query_ref = db.collection("listings").where("finderChatId", "==", chat_id).stream()

        # Return a list of objects containing all the data elements inside the document
        # so that we can update or delete easily
        user_listings = [
            doc for doc in query_ref
            if doc.to_dict().get("status") in ["active", "reclaimed", "spotted"]
        ]

        logger.info(f"Fetched {len(user_listings)} listings for user with chat_id {chat_id}.")
        return user_listings
    
    except Exception as e:
        logger.error(f"Error fetching user listings from Firestore: {e}")
        return [] 

def update_listing_status(doc_id: str, new_status: str) -> bool:
    """
    Modifies an item's status flag (eg from 'active' to 'reclaimed').
    Returns True if successful, False otherwise.
    """
    global db
    try:
        # Safety checks
        if db is None:
            initialize_database()

        if db is None:
            logger.error("Cannot update listing status.")
            return False
        
        # Find the specific listing using the doc_id and update the 'status' field
        db.collection("listings").document(doc_id).update({"status": new_status})

        logger.info(f"Successfully updated listing {doc_id} to status '{new_status}'.")
        return True
    
    except Exception as e:
        logger.error(f"Error updating listing status in Firestore: {e}")
        return False

def delete_listing(doc_id: str) -> bool:
    """
    Completely deletes a listing entirely from the database.
    Returns True if successful, False otherwise.
    """
    global db
    try:
        # Safety checks
        if db is None:
            initialize_database()

        if db is None:
            logger.error("Cannot delete listing.")
            return False
        
        # Find the specific listing using the doc_id and delete it
        db.collection("listings").document(doc_id).delete()

        logger.info(f"Successfully deleted listing {doc_id}.")
        return True
    
    except Exception as e:
        logger.error(f"Error deleting listing from Firestore: {e}")
        return False
    

if __name__ == "__main__":
    # Check if the connection to Firebase is successful
    logging.basicConfig(level=logging.INFO)
    print("--- Starting Standalone Database Connection Test ---")
    initialize_database()