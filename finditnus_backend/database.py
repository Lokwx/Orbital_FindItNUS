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
    
if __name__ == "__main__":
    # Check if the connection to Firebase is successful
    logging.basicConfig(level=logging.INFO)
    print("--- Starting Standalone Database Connection Test ---")
    initialize_database()