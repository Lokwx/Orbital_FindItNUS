import os
from pathlib import Path

# Root Directory of the Repository
ROOT_DIR = Path(__file__).resolve().parent.parent

# Map to the Firebase Key
FIREBASE_KEY_PATH = str(ROOT_DIR / "serviceAccountKey.json")

# Load the various Application Tokens from Environment Variables
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN", "8999290550:AAFnq_Ecsd2V51NlAHYkNd2tQZhVMf0BrWU")

# Cloudinary Details
CLOUDINARY_NAME = os.environ.get("CLOUDINARY_NAME", "dy7cf8d3m")
CLOUDINARY_API_KEY = os.environ.get("CLOUDINARY_API_KEY", "717616377814218")
CLOUDINARY_API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "FSmd68stuZoG5wOqldNg-Pr1vHk")

