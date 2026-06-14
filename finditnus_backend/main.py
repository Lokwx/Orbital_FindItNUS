import os
import logging
import random
import hashlib
import time
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime, timedelta, timezone
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update, BotCommand, WebAppInfo
from telegram.ext import Application, CallbackQueryHandler, CommandHandler, MessageHandler, ContextTypes, filters

# Importing the various modules
from finditnus_backend import config
from finditnus_backend import database
from finditnus_backend import storage

# Debug checker for later use
logging.basicConfig(
    format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Fetch Telegram Bot token and Web App URL from config.py
TELEGRAM_TOKEN = config.TELEGRAM_TOKEN
WEB_APP_BASE_URL = config.WEB_APP_BASE_URL

# Store campus locations 
CAMPUS_COORDINATE_REGISTRY = {
    "zone_engineering": (1.300464654452748, 103.77080066819191), 
    "spot_techno_edge": (1.2980991986064525, 103.77154054302451),
    "spot_ea_hub": (1.3006493751404242, 103.77065569135439),
    "spot_e4_benches": (1.298437820984263, 103.77233259667462),
    "spot_lt6": (1.2987471536778021, 103.77197981766065),
    
    "zone_computing": (1.2943, 103.7738),
    "spot_com1": (1.2948931706572595, 103.77386879078871),
    "spot_com2": (1.2943727053320002, 103.7741047239335),
    "spot_com3": (1.2948069848481898, 103.77459349168278),
    "spot_terrace": (1.2944005019524578, 103.77434307291819),

    "zone_business": (1.292844015682483, 103.77419977979312),
    "spot_biz1": (1.2925363984421667, 103.77421148121704),

    "zone_science": (1.2968164587218356, 103.78092394913134),
    "spot_frontier": (1.2964549345402392, 103.78035954946932),
    "spot_sciencelibrary": (1.2952869792157986, 103.78013282412947),
    "spot_lt27": (1.297095324659124, 103.78087527196372),

    "zone_law": (1.3074247609986471, 103.77259410113955),
    "spot_lawlibrary": (1.3071780620066633, 103.77255655020328),

    "zone_fass": (1.2949965895632567, 103.77172175545422),
    "spot_deck": (1.294491975874027, 103.77255177658623),
    "spot_coffeeroaster": (1.2961346572397314, 103.77207544170305),

    "zone_med": (1.2965266733862095, 103.78176871850219),
    "spot_medlibrary": (1.296978806630783, 103.78138339443284),

    "zone_utown": (1.305917567933719, 103.77288746206092),
    "spot_finefood": (1.3040508472368986, 103.77354394644871),
    "spot_create": (1.303783701360224, 103.77451725304554),
    "spot_flavours": (1.3044266501292086, 103.7729823165373),
    "spot_stephen": (1.3044906219250914, 103.77246017948534),
    "spot_erc": (1.3057491221599453, 103.77265788949713),
    "spot_nusc": (1.3065405907879206, 103.77206702936482),

    "zone_clb": (1.2965936261945619, 103.77316236890708),
    "spot_clb_main": (1.2965936261945619, 103.77316236890708),

    "zone_bus_stops": (1.293658432902112, 103.78469973747785),
    "spot_bus_it": (1.2973230777764908, 103.77267768050574),
    "spot_bus_clb": (1.2966613610071784, 103.77254217619988),
    "spot_bus_yih": (1.2990466665263536, 103.77419236320775),
    "spot_bus_oppyih": (1.2989683691240685, 103.77440120996332),
    "spot_bus_utown": (1.3036898961490944, 103.77475505542886),
    "spot_bus_museum": (1.3013602813534615, 103.77368295262559),
    "spot_bus_com3": (1.2947482978520548, 103.77458862422284),
    "spot_bus_pgr": (1.291807182425412, 103.78042831341313),
    "spot_bus_lt27": (1.297365120941682, 103.78095525640651),
    "spot_bus_s17": (1.2975650312784508, 103.78073041420151),
    "spot_bus_oppuhc": (1.298842830808766, 103.77562777187813),
    "spot_bus_uhc": (1.2989514145276917, 103.77611652418129),
    "spot_bus_oppuhall": (1.2976463773113778, 103.77814751560426),
    "spot_bus_uhall": (1.297399677359566, 103.77791148120465),
}

# Create buttons for sub-menus for Telegram interface
# 'Macro_zone' buttons for Telegram interface
ZONE_NAME_MAP = {
    "zone_engineering": "Engineering", "zone_computing": "Computing", "zone_business": "Business",
    "zone_science": "Science", "zone_law": "Law Faculty", "zone_fass": "Arts & FASS",
    "zone_med": "Medicine / YLL", "zone_utown": "UTown", "zone_clb": "Central Library", "zone_bus_stops": "Bus Stops"
}

MACRO_ZONE_KEYBOARD = [
    [InlineKeyboardButton("💻 Computing", callback_data="zone_computing"), InlineKeyboardButton("🔬 Science", callback_data="zone_science")],
    [InlineKeyboardButton("🏗️ Engineering", callback_data="zone_engineering"), InlineKeyboardButton("📈 Business", callback_data="zone_business")],
    [InlineKeyboardButton("🎭 Arts & FASS", callback_data="zone_fass"), InlineKeyboardButton("🎓 UTown", callback_data="zone_utown")],
    [InlineKeyboardButton("🏛️ Law Faculty", callback_data="zone_law"), InlineKeyboardButton("🩺 Medicine / YLL", callback_data="zone_med")],
    [InlineKeyboardButton("📚 Central Library (CLB)", callback_data="zone_clb"), InlineKeyboardButton("🚌 Shuttle Bus Stops", callback_data="zone_bus_stops")],
    [InlineKeyboardButton("❌ Cancel Report", callback_data="action_cancel")]
]

# 'Micro_zone' buttons for Telegram interface
ZONE_KEYBOARD_MAP = {
    "zone_engineering": [
        [InlineKeyboardButton("🥪 Techno Edge", callback_data="spot_techno_edge"), InlineKeyboardButton("🏢 EA Hub Area", callback_data="spot_ea_hub")],
        [InlineKeyboardButton("🪵 E4 Study Benches", callback_data="spot_e4_benches"), InlineKeyboardButton("📚 Lecture Theatre 6", callback_data="spot_lt6")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_computing": [
        [InlineKeyboardButton("🏢 COM 1", callback_data="spot_com1"), InlineKeyboardButton("🏢 COM 2", callback_data="spot_com2")],
        [InlineKeyboardButton("🏢 COM 3", callback_data="spot_com3"), InlineKeyboardButton("🍛 The Terrace", callback_data="spot_terrace")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_business": [
        [InlineKeyboardButton("💼 BIZ 1 (Mochtar Riady)", callback_data="spot_biz1")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_science": [
        [InlineKeyboardButton("🍛 The Frontier", callback_data="spot_frontier"), InlineKeyboardButton("📚 Science Library", callback_data="spot_sciencelibrary")],
        [InlineKeyboardButton("🎤 LT 27 Benches", callback_data="spot_lt27")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_law": [
        [InlineKeyboardButton("🏛️ C J Koh Law Library", callback_data="spot_lawlibrary")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_fass": [
        [InlineKeyboardButton("🍛 The Deck", callback_data="spot_deck"), InlineKeyboardButton("☕ Macaw Coffee", callback_data="spot_coffeeroaster")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_med": [
        [InlineKeyboardButton("📚 Medical Library", callback_data="spot_medlibrary")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_utown": [
        [InlineKeyboardButton("🍕 Fine Food", callback_data="spot_finefood"), InlineKeyboardButton("🏢 CREATE Tower Hub", callback_data="spot_create")],
        [InlineKeyboardButton("🍛 Flavours Food Court", callback_data="spot_flavours"), InlineKeyboardButton("🪵 Stephen Riady Centre", callback_data="spot_stephen")],
        [InlineKeyboardButton("📚 ERC", callback_data="spot_erc"), InlineKeyboardButton("🏰 NUS College Area", callback_data="spot_nusc")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_clb": [
        [InlineKeyboardButton("📍 Main Building", callback_data="spot_clb_main")],
        [InlineKeyboardButton("🖊️ Specify Room or Level", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ],
    "zone_bus_stops": [
        [InlineKeyboardButton("🚏 IT Stop", callback_data="spot_bus_it"), InlineKeyboardButton("🚏 CLB Stop", callback_data="spot_bus_clb")],
        [InlineKeyboardButton("𚚏 YIH Stop", callback_data="spot_bus_yih"), InlineKeyboardButton("𚚏 Opp YIH Stop", callback_data="spot_bus_oppyih")],
        [InlineKeyboardButton("𚚏 UTown Stop", callback_data="spot_bus_utown"), InlineKeyboardButton("𚚏 Museum Stop", callback_data="spot_bus_museum")],
        [InlineKeyboardButton("𚚏 COM 3 Stop", callback_data="spot_bus_com3"), InlineKeyboardButton("𚚏 PGP Terminal", callback_data="spot_bus_pgr")],
        [InlineKeyboardButton("𚚏 LT 27 Stop", callback_data="spot_bus_lt27"), InlineKeyboardButton("𚚏 S17 Stop", callback_data="spot_bus_s17")],
        [InlineKeyboardButton("𚚏 UHC Stop", callback_data="spot_bus_uhc"), InlineKeyboardButton("𚚏 Opp UHC Stop", callback_data="spot_bus_oppuhc")],
        [InlineKeyboardButton("𚚏 Univ Hall", callback_data="spot_bus_uhall"), InlineKeyboardButton("𚚏 Opp Univ Hall", callback_data="spot_bus_oppuhall")],
        [InlineKeyboardButton("🖊️ Custom Spot", callback_data="spot_custom_input"), InlineKeyboardButton("⬅️ Back", callback_data="back_to_macro")]
    ]
}

# 'Categories' Button for Telegram interface
CATEGORY_KEYBOARD = [
    [InlineKeyboardButton("📱 Electronics", callback_data="cat_electronics"), InlineKeyboardButton("🔑 Keys / Access Cards", callback_data="cat_keys")],
    [InlineKeyboardButton("💼 Wallets & Bags", callback_data="cat_wallets"), InlineKeyboardButton("🍼 Bottles / Umbrellas", callback_data="cat_bottles")],
    [InlineKeyboardButton("📦 Others / Miscellaneous", callback_data="cat_others")],
    [InlineKeyboardButton("❌ Cancel Report", callback_data="action_cancel")]
]

# 'Macro_zone' Button for Loser's status
LOSER_MACRO_ZONE_KEYBOARD = [
    [InlineKeyboardButton("🌍 Entire Campus / Unsure", callback_data="zone_all_campus")],
    [InlineKeyboardButton("💻 Computing", callback_data="zone_computing"), InlineKeyboardButton("🔬 Science", callback_data="zone_science")],
    [InlineKeyboardButton("🏗️ Engineering", callback_data="zone_engineering"), InlineKeyboardButton("📈 Business", callback_data="zone_business")],
    [InlineKeyboardButton("🎭 Arts & FASS", callback_data="zone_fass"), InlineKeyboardButton("🎓 UTown", callback_data="zone_utown")],
    [InlineKeyboardButton("🏛️ Law Faculty", callback_data="zone_law"), InlineKeyboardButton("🩺 Medicine / YLL", callback_data="zone_med")],
    [InlineKeyboardButton("📚 Central Library (CLB)", callback_data="zone_clb"), InlineKeyboardButton("🚌 Shuttle Bus Stops", callback_data="zone_bus_stops")],
    [InlineKeyboardButton("❌ Cancel Search", callback_data="action_cancel")]
]

def get_coordinates(location_key: str, apply_jitter: bool = False) -> tuple:
    """
    Retrieves coordinates for a location key from CAMPUS_COORDINATE_REGISTRY. 
    If apply_jitter is True, add a small random offset to keep map markers from stacking together.
    """
    # If key is missing, default to center of NUS
    base_coords = CAMPUS_COORDINATE_REGISTRY.get(location_key, (1.2966, 103.7731))

    if apply_jitter:
        lat_jitter = random.uniform(-0.000055, 0.000055)
        long_jitter = random.uniform(-0.000055, 0.000055)
        return (base_coords[0] + lat_jitter, base_coords[1] + long_jitter)
    else:
        lat_jitter = random.uniform(-0.00010, 0.00010)
        long_jitter = random.uniform(-0.00010, 0.00010)
        return (base_coords[0] + lat_jitter, base_coords[1] + long_jitter)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handler for /start command. 
    """
    context.user_data.clear()  

    first_name = update.effective_user.first_name
    welcome_message = (
        f"Hi {first_name}! 👋 Welcome to <b>FinditNUS</b> \n\n"
        "Let's look for your campus belongings!\n\n" 
        "Are you reporting an item you found, or searching for something you lost?"
        )
    
    # Assign a role to the user, either a Finder/ Spotter/ Loser
    keyboard = [
            [InlineKeyboardButton("📦 I Found an Item", callback_data = "flow_finder")],
            [InlineKeyboardButton("🔍 I Spotted an Item", callback_data = "flow_spotted")],
            [InlineKeyboardButton("❓ I Lost an Item", callback_data = "flow_loser")]
    ]

    # Display the message on chat
    await update.message.reply_text(
        text = welcome_message, 
        reply_markup = InlineKeyboardMarkup(keyboard), 
        parse_mode = "HTML"
    )

async def handle_button_clicks(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handles the button clicks to route user interactions accordingly.
    """
    # Receive and extract the callback_data from the user
    query = update.callback_query
    await query.answer()
    data = query.data

    user_flow = context.user_data.get("user_flow", "info")

    if user_flow == "finder":
        prefix = "🟢 Finder"
    elif user_flow == "spotted":
        prefix = "🟡 Spotter"
    else:
        prefix = "🔵 Loser"

    # Handles role selection for Finder or Loser
    if data in ["flow_finder", "flow_spotted", "flow_loser"]:
        if data == "flow_finder":
            context.user_data["user_flow"] = "finder"
            text = "<b>🟢 Finder Mode</b>\n\nSelect the faculty zone:"
            target_keyboard = MACRO_ZONE_KEYBOARD
        elif data == "flow_spotted":
            context.user_data["user_flow"] = "spotted"
            text = "<b>🟡 Spotter Mode</b>\n\nSelect the faculty zone:"
            target_keyboard = MACRO_ZONE_KEYBOARD
        else:
            context.user_data["user_flow"] = "loser"
            text = "<b>🔵 Loser Mode</b>\n\nSelect the faculty zone:"
            target_keyboard = LOSER_MACRO_ZONE_KEYBOARD

        # Edit existing message instead of sending the a new message
        await query.edit_message_text(
            text = text,
            reply_markup = InlineKeyboardMarkup(target_keyboard),
            parse_mode = "HTML"
        )

    # Handles macro location selection
    elif data in ZONE_KEYBOARD_MAP:
        context.user_data["active_macro_key"] = data

        # Save the name of specific macro locations
        fac_name = ZONE_NAME_MAP.get(data, "Campus Facility")

        # Checks user's role before printing specific menu
        if user_flow in ["finder", "spotted"]:
            header = f"<b>{prefix}</b> ➔ <b>{fac_name}</b>\n\nSelect a primary landmark spot:"
        else:
            header = f"<b>🔵 Loser</b> ➔ <b>{fac_name}</b>\n\nSelect a primary landmark spot:"

        await query.edit_message_text(
        text = header,
        reply_markup = InlineKeyboardMarkup(ZONE_KEYBOARD_MAP[data]),
        parse_mode = "HTML"
    )

    # Handles custom input selection
    elif data == "spot_custom_input":
        context.user_data["state"] = "AWAITING_CUSTOM_SPOT"
        await query.edit_message_text(
            text = f"<b>{prefix}</b> ➔ <b>Custom Location</b>\n\nPlease type a specific description of where the item is located.",
            reply_markup = None,
            parse_mode = "HTML"
        )

    # Handles micro location selection
    elif data.startswith("spot_"):
        context.user_data["active_micro_key"] = data

        text = f"<b>{prefix}</b> ➔ <b>Spot Selected</b>\n\nWhat category does this item fall into?"

        await query.edit_message_text(
            text = text,
            reply_markup = InlineKeyboardMarkup(CATEGORY_KEYBOARD),
            parse_mode = "HTML"
    )
        
    # Handles category selection
    elif data.startswith("cat_"):
        context.user_data["active_category_key"] = data
        user_flow = context.user_data.get("user_flow")

        if user_flow in ["finder", "spotted"]:
            context.user_data["state"] = "AWAITING_PHOTO"
            action = "found" if user_flow == "finder" else "spotted"
            text = (
                f"<b>{prefix}</b> ➔ <b>Category confirmed</b>\n\n"
                f"📸 Please upload an image of the item you {action}.\n"
                f"This image will be used to identify the item."
            )
        else:
            text = f"<b>{prefix}</b> ➔ <b>Category confirmed</b>\n\n"

        await query.edit_message_text(
            text = text,
            reply_markup = None,
            parse_mode = "HTML"
        )

    elif data == "back_to_macro":
        if user_flow == "loser":
            text = "<b>🔵 Loser Mode</b>\n\nSelect the faculty zone:"
            target_keyboard = LOSER_MACRO_ZONE_KEYBOARD
        elif user_flow == "spotted":
            text = "<b>🟡 Spotter Mode</b>\n\nSelect the faculty zone:"
            target_keyboard = MACRO_ZONE_KEYBOARD
        else:
            text = "<b>🟢 Finder Mode</b>\n\nSelect the faculty zone:"
            target_keyboard = MACRO_ZONE_KEYBOARD

        await query.edit_message_text(
            text = text,
            reply_markup = InlineKeyboardMarkup(target_keyboard),
            parse_mode = "HTML"
        )

    elif data == "action_cancel":
        context.user_data.clear()

        await query.edit_message_text(
            text = "<b>❌ Session Aborted.</b>\n\nIf you wish to submit another report, please type or click /start.",
            reply_markup = None,
            parse_mode = "HTML"
        )

async def handle_finder_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Saves the image uploaded by Finder and uploads it to Cloudinary
    """
    user_flow = context.user_data.get("user_flow")

    if context.user_data.get("user_flow") not in ["finder", "spotted"] or "active_category_key" not in context.user_data:
        return
    
    prefix = "🟢 Finder" if user_flow == "finder" else "🟡 Spotter"
    action = "found" if user_flow == "finder" else "spotted"
    example = "Found" if user_flow == "finder" else "Spotted"

    # Saves the uploaded image
    image = update.message.photo[-1]
    image_file = await image.get_file()

    # Provides a status update to user
    status_text = await update.message.reply_text(
        text = "<b>⏳Processing the image...</b>",
        parse_mode = "HTML"
    )

    try:
        # Download the image file into memory bytes
        image_bytes = await image_file.download_as_bytearray()
        # Send the image bytes to storage.py and get back secure_url and public_url tuple
        secure_url, public_id = storage.upload_image(bytes(image_bytes))

        if secure_url and public_id:
            context.user_data["temp_img_url"] = secure_url
            context.user_data["temp_public_id"] = public_id
            context.user_data["state"] = "AWAITING_DESCRIPTION"

            # Ask Finder for a short description of the uploaded image
            await update.message.reply_text(
                text = (
                    f"<b>{prefix} Mode</b> ➔ <b>Image Saved Successfully!</b> ✅\n\n"
                    f"<b>✍️ Please type a short description of the item you {action}.</b>\n"
                    f"Example: {example} a black iPhone at COM1 basement study area"
                ),
                    parse_mode = "HTML"
            )
        else:
            await update.message.reply_text("Error!")

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        await update.message.reply_text(
            text = (
                "❌ Something went wrong while saving the image. Please try again!"
                ),
                parse_mode = "HTML"
        )

    finally:
        await status_text.delete()

async def handle_user_description(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Collects and saves image description
    """
    # Guardrail in case user types something in the chat that is not for the item description
    if context.user_data.get("state") != "AWAITING_DESCRIPTION":
        return
    
    chat_id = update.effective_chat.id
    description_text = update.message.text
    user_flow = context.user_data.get("user_flow")

    try:
        # Pass the saved parameters to the database function
        database_saver(context.user_data, chat_id, description_text)

        # Send status update to user
        prefix = "🟢 Finder" if user_flow == "finder" else "🟡 Spotter"
        await update.message.reply_text(
            text = (
                f"<b>{prefix} Mode</b> ➔ <b>Listing Published Live!</b> 🎉\n\n"
                "Thank you! Your listing has been saved successfully!\n"
                "Students can access this on the map now."
            ),
            parse_mode = "HTML"
        )
        # Clear the current saved parameters in the chat
        context.user_data.clear()
    
    except Exception as e:
        logger.error(f"Posting failure: {e}")
        await update.message.reply_text("Failed to publish listing. Try again!")

def database_saver(user_data: dict, chat_id: int, description_text: str) -> None:
    """
    Process chat parameters and package it for database upload
    """
    # Unpack chat parameters into new variables
    user_flow = user_data.get("user_flow")
    macro_key = user_data.get("active_macro_key")
    micro_key = user_data.get("active_micro_key")

    macro_name = ZONE_NAME_MAP.get(macro_key, "Custom/Unspecified")

    # Check if location is a custom spot
    if user_data.get("state") == "AWAITING_CUSTOM_SPOT" or micro_key == "spot_custom_input":
        micro_name = user_data.get("custom_spot_text", "Custom Location")
        # Set custom spot's location as macro location coordinates
        lat, long = get_coordinates(macro_key, apply_jitter = False)
    else:
        # If user clicked a micro location, convert it to a proper string, spot_com1 becomes Com 1
        micro_name = micro_key.replace("spot_", "").replace("_", " ").title()
        lat, long = get_coordinates(micro_key, apply_jitter = False)

    # Build the database payload dictionary
    payload = {
        "chatId": chat_id,
        "userRole": user_flow,
        "category": user_data.get("active_category_key", "cat_others").replace("cat_", ""),
        "macro_location": macro_name,
        "micro_locaton": micro_name,
        "description": description_text.strip(),
        "imageUrl": user_data.get("temp_img_url"),
        "cloudinaryPublicId": user_data.get("temp_public_id"),
        "status": "active",
        "timestamp": datetime.now(timezone.utc),
        "coordinates": {"lat": lat, "long": long}
    }
    # Establish connection to Firebase and look for 'listings'
    success = database.add_item_listing(payload)

    if not success:
        raise RuntimeError("Database is offline!")

def main() -> None:
    # Initilize Telegram framework using the necessary config details
    app = Application.builder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    app.add_handler(CallbackQueryHandler(handle_button_clicks))

    app.add_handler(MessageHandler(filters.PHOTO, handle_finder_photo))

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_user_description))

    # Check if Telegram bot starts successfully
    print("FindItNUS Bot is running successfully")
    app.run_polling()

if __name__ == "__main__":
    main()