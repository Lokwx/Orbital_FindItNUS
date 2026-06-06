import os
from pathlib import Path

# Root Directory of the Repository
ROOT_DIR = Path(__file__).resolve().parent.parent

# Load .env  file to prevent showing keys on config.py
ENV_PATH = ROOT_DIR / ".env"
if ENV_PATH.exists():
    with open(ENV_PATH, "r") as env_file:
        for line in env_file:
            if line.strip() and not line.startswith("#"):
                key, value = line.strip().split("=", 1)
                os.environ[key] = value

# Map to the Firebase Key
FIREBASE_KEY_PATH = str(ROOT_DIR / "serviceAccountKey.json")

# Load the various Application Tokens from Environment Variables
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN", "placeholder_telegram_token")

# Cloudinary Details
CLOUDINARY_NAME = os.environ.get("CLOUDINARY_NAME", "placeholder_cloudinary_name")
CLOUDINARY_API_KEY = os.environ.get("CLOUDINARY_API_KEY", "placeholder_cloudinary_api_key")
CLOUDINARY_API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "placeholder_cloudinary_api_secret")

# Development Mode Toggle
IS_LOCAL_DEVELOPMENT = Path(ROOT_DIR / ".local_dev").exists()

if IS_LOCAL_DEVELOPMENT:
    WEB_APP_BASE_URL = "https://finditnus-testing.vercel.app"  
else:
    WEB_APP_BASE_URL = ""