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

if __name__ == "__main__":
    # Check if the connection to Firebase is successful
    logging.basicConfig(level=logging.INFO)
    print("--- Starting Standalone Database Connection Test ---")
    initialize_database()