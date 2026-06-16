import time
import logging
import hashlib
import requests
from finditnus_backend import config

# Debug checker
logger = logging.getLogger(__name__)

CLOUDINARY_CLOUD_NAME = config.CLOUDINARY_NAME
CLOUDINARY_API_KEY = config.CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET = config.CLOUDINARY_API_SECRET

def upload_image(image_bytes: bytes) -> tuple:
    """
    Takes in a stram of image binary bytes, and streams it directly to Cloudinary.
    
    Returns:
        tuple: (image_url, public_id) if successful, (None, None) otherwise.
    """
    url = f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CLOUD_NAME}/image/upload"
    
    # Generate a unique timestamp 
    timestamp = str(int(time.time()))

    string_to_sign = f"timestamp={timestamp}{CLOUDINARY_API_SECRET}"

    # Create the cryptographic signature using the API secret, timestamp
    signature = hashlib.sha1(string_to_sign.encode('utf-8')).hexdigest()

    # Put the data parameters together
    data_payload = {
        "api_key": CLOUDINARY_API_KEY,
        "timestamp": timestamp,
        "signature": signature
    }

    # Use form-data to send the image bytes
    file_payload = {
        "file": ("item_photo.jpg", image_bytes, "image/jpeg")
    }

    try:
        logger.info("Uploading image to Cloudinary...")
        response = requests.post(url, data=data_payload, files=file_payload, timeout = 15)
        response.raise_for_status()  
        response_data = response.json()
        secure_url = response_data.get("secure_url")
        public_id = response_data.get("public_id")

        logger.info("Image uploaded successfully to Cloudinary!")
        return secure_url, public_id
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to upload image to Cloudinary: {e}")
        return None, None
    
def delete_image(public_id: str) -> bool:
    """
    Takes in a Cloudinary public_id and deletes it from the database
    Returns:
        bool: True if successful, False otherwise.
    """
    url = f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CLOUD_NAME}/image/destroy"

    timestamp = str(int(time.time()))

    # Sort parameters alphabetically else Cloudinary wont accept the signature
    string_to_sign = f"public_id={public_id}&timestamp={timestamp}{CLOUDINARY_API_SECRET}"

    signature = hashlib.sha1(string_to_sign.encode('utf-8')).hexdigest()

    data_payload = {
        "public_id": public_id,
        "api_key": CLOUDINARY_API_KEY,
        "timestamp": timestamp,
        "signature": signature
    }
    
    try:
        logger.info(f"Deleting image with public_id {public_id} from Cloudinary...")
        response = requests.post(url, data=data_payload, timeout = 15)
        response.raise_for_status()  
        response_data = response.json()
        if response_data.get("result") == "ok":
            logger.info(f"Image with public_id {public_id} deleted successfully from Cloudinary!")
            return True
        else:
            logger.error(f"Failed to delete image with public_id {public_id} from Cloudinary: {response_data}")
            return False
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to delete image from Cloudinary: {e}")
        return False
    
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    print("\n--- RUNNING SYSTEM TESTING INTEGRATION CORE ---\n")
    
    # 1. Create a dummy test file byte stream in memory
    mock_bytes = b"GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    
    # 2. Run the upload engine test
    print("Executing Upload Step...")
    uploaded_url, reference_id = upload_image(mock_bytes)
    
    if uploaded_url and reference_id:
        print(f"Upload Success")
        print(f"Captured URL: {uploaded_url}")
        print(f"Captured Barcode Asset ID: {reference_id}\n")
        
        print("Executing Deletion Step")
        delete_success = delete_image(reference_id)
        
        if delete_success:
            print("Deletion Successful")
        else:
            print("eletion Failed")
            
    else:
        print("Upload Phase aborted. Ensure local .env variables are matched.")