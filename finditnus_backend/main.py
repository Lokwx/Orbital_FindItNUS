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
if os.environ.get("WEB_APP_BASE_URL"):
    config.WEB_APP_BASE_URL = os.environ.get("WEB_APP_BASE_URL")

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
        [InlineKeyboardButton("🚏 YIH Stop", callback_data="spot_bus_yih"), InlineKeyboardButton("🚏 Opp YIH Stop", callback_data="spot_bus_oppyih")],
        [InlineKeyboardButton("🚏 UTown Stop", callback_data="spot_bus_utown"), InlineKeyboardButton("🚏 Museum Stop", callback_data="spot_bus_museum")],
        [InlineKeyboardButton("🚏 COM 3 Stop", callback_data="spot_bus_com3"), InlineKeyboardButton("🚏 PGP Terminal", callback_data="spot_bus_pgr")],
        [InlineKeyboardButton("🚏 LT 27 Stop", callback_data="spot_bus_lt27"), InlineKeyboardButton("🚏 S17 Stop", callback_data="spot_bus_s17")],
        [InlineKeyboardButton("🚏 UHC Stop", callback_data="spot_bus_uhc"), InlineKeyboardButton("🚏 Opp UHC Stop", callback_data="spot_bus_oppuhc")],
        [InlineKeyboardButton("🚏 Univ Hall", callback_data="spot_bus_uhall"), InlineKeyboardButton("🚏 Opp Univ Hall", callback_data="spot_bus_oppuhall")],
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

class HealthCheckHandler(BaseHTTPRequestHandler):
    """
    Used to allow Render to ping the bot so it is running at all times.
    """
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"FindItNUS Bot is running!")

    def log_message(self, format, *args):
        return 

def run_health_check():
    port = int(os.environ.get("PORT", 10000))
    server = HTTPServer(("0.0.0.0", port), HealthCheckHandler)
    server.serve_forever()

def run_deletion() -> None:
    """
    Wakes up periodically to remove expired listings from Firestore and Cloudinary. 
    Acts as our TTL since Firestore TTL needs paid subscription.
    """
    while True:
        try:
            if database.db is None:
                database.initialize_database()
            
            now = datetime.now(timezone.utc)
            logger.info("Initializing TTL deletion")

            expired_listings = database.db.collection("listings")\
                .where("expireAt", "<=", now)\
                .stream()
            
            for doc in expired_listings:
                data = doc.to_dict()
                public_id = data.get("cloudinaryPublicId")

                if public_id:
                    try:
                        storage.delete_image(public_id)
                    except Exception as e:
                        logger.error(f"Failed to delete image {public_id}: {e}")

                database.db.collection("listings").document(doc.id).delete()
                logger.info(f"Deleted expired listing {doc.id}")
            
            expired_tickets = database.db.collection("lost_tickets")\
                .where("expireAt", "<=", now)\
                .stream()
            
            for doc in expired_tickets:
                database.db.collection("lost_tickets").document(doc.id).delete()
                logger.info(f"Deleted expired lost ticket {doc.id}")
        
        except Exception as e:
            logger.error(f"Error during TTL deletion: {e}")

        time.sleep(86400)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handler for /start command. 
    """
    context.user_data.clear()  
    chat_id = update.effective_chat.id

    # If user claimed item from the web map and wants to open a chat
    if context.args and context.args[0].startswith("claim_"):
        try:
            parts = context.args[0].split("_")
            target_doc_id = parts[1]
            loser_chat_id = update.effective_chat.id
            loser_user = update.effective_user

            if loser_user.username:
                loser_mention = f"@{loser_user.username}"
                privacy_notice = ""
            else:
                full_name = loser_user.first_name
                if loser_user.last_name:
                    full_name += f" {loser_user.last_name}"
                loser_mention = f"<b>{full_name}</b>"
                privacy_notice = "\n\n⚠️ <b>Privacy Notice:</b> This user does not have a public Telegram username. Use the button below to talk to them!"
            
            if database.db is None:
                database.initialize_database()

            doc_ref = database.db.collection("listings").document(target_doc_id).get()
            if not doc_ref.exists:
                await update.message.reply_text("❌ This item listing does not exist")
                return

            listing_data = doc_ref.to_dict()
            finder_chat_id = listing_data.get("UserID")
            item_desc = listing_data.get("ItemDescription", "Unknown Item")

            if not finder_chat_id:
                await update.message.reply_text("❌ This item listing does not have a valid Finder ID")
                return

            handshake_keyboard = [
                [
                    InlineKeyboardButton("✅ Yes, Handed Over", callback_data=f"hs_approve_{target_doc_id}_{loser_chat_id}"),
                    InlineKeyboardButton("❌ No / Fake Claim", callback_data=f"hs_reject_{target_doc_id}")
                ],
                [
                    InlineKeyboardButton("💬 Message Claimant via Bot", callback_data=f"msg_relay_prompt_{loser_chat_id}")
                ]
            ]

            await context.bot.send_message(
                chat_id = finder_chat_id,
                text = (
                    f"🛎️ <b>Handshake Claim Notification!</b>\n\n"
                    f"Student {loser_mention} is attempting to reclaim your found listing:\n"
                    f"📦 <b>Item:</b> {item_desc}{privacy_notice}\n\n"
                    f"Have you safely met up on campus and returned this item to them?"
                ),
                reply_markup = InlineKeyboardMarkup(handshake_keyboard),
                parse_mode = "HTML"
            )
            
            await update.message.reply_text(
                "📬 <b>Claim Request Transmitted!</b>\n\n"
                "We have pinged the finder to confirm the physical handoff. If they verify it, "
                "your open lost tickets matching this space will resolve instantly.",
                parse_mode = "HTML"
            )
            return
            
        except Exception as err:
            logger.error(f"DParsing fault: {err}")
            await update.message.reply_text("❌ Invalid verification.")
            return

    # Standard /start command
    first_name = update.effective_user.first_name
    welcome_message = (
        f"Hi {first_name}! 👋 Welcome to <b>FindItNUS</b> \n\n"
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

async def website(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handler for /website command.
    Provides a direct, clickable link to launch the web map.
    """
    context.user_data.clear()

    # Create the button
    keyboard = [
        [InlineKeyboardButton(text = "🗺️ Open Live Map Portal", web_app = WebAppInfo(url = WEB_APP_BASE_URL))]
    ]

    text = (
        f"🌐 <b>FindItNUS Interactive Map Portal</b>\n\n"
        f"Tap the button below to launch the live campus map:"
    )

    await update.message.reply_text(
        text=text, 
        reply_markup=InlineKeyboardMarkup(keyboard), 
        parse_mode="HTML"
    )

async def manage(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handler for /manage command.
    Fetches the user's active/reclaimed items from database and displays them so that user can manage the item's status.
    """
    context.user_data.clear()
    chat_id = update.effective_chat.id

    # Fetch the user's listings using a function in database.py
    user_listings = database.get_user_listings(chat_id)

    # If they have no listings
    if not user_listings:
        await update.message.reply_text("🗄️ You have no active or spotted items registered under your account.")
        return

    # If they have listings
    text_output = "📋 <b>Your Item History Portfolio:</b>\n\nSelect a listing below to manage it:\n"
    manage_keyboard = []

    # Look through database 
    for idx, doc in enumerate(user_listings, 1):
        data = doc.to_dict()

        if data.get("Status") == "active":
            status_flag = "🟢 Active"
        elif data.get("Status") == "spotted":
            status_flag = "🟡 Spotted"
        else:
            status_flag = "✅ Reclaimed"

        # Write a short preview of each listing
        description = data.get("ItemDescription", "No Description")[:25] + "..."
        micro = data.get("ItemLocationDetail", "Unknown Location")

        # Add to text_output
        text_output += f"{idx}. <b>{description}</b> ({status_flag}) ➔ 📍 <i>{micro}</i>\n"

        manage_keyboard.append([InlineKeyboardButton(f"⚙️ Manage Item {idx}", callback_data = f"mng_select_{doc.id}")])
    manage_keyboard.append([InlineKeyboardButton("❌ Close Menu", callback_data = "action_cancel")])

    await update.message.reply_text(
        text = text_output,
        reply_markup = InlineKeyboardMarkup(manage_keyboard),
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
    chat_id = update.effective_chat.id

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

    # Handles "Entire Campus" selection
    elif data == "zone_all_campus":
        context.user_data["active_macro_key"] = "Entire Campus"
        context.user_data["active_micro_key"] = "Anywhere"

        text = f"<b>{prefix}</b> ➔ <b>Entire Campus Search</b>\n\nWhat category does this item fall into?"

        await query.edit_message_text(
            text = text,
            reply_markup = InlineKeyboardMarkup(CATEGORY_KEYBOARD),
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

        # Finder & Spotter Flow
        if user_flow in ["finder", "spotted"]:
            context.user_data["state"] = "AWAITING_ITEM_NAME"
            await query.edit_message_text(
                text = "<b>Give this item a short title?</b> (Example: Black iPhone 15)",
                reply_markup = None,
                parse_mode = "HTML"
            )
        # Loser Flow
        else:
            context.user_data["state"] = "AWAITING_KEYWORD"
            await query.edit_message_text(
                text = "🎟️ <b>Lost Search Ticket Setup</b>\n\nPlease type a single keyword tracking identifier (Example: 'iphone', 'wallet'):",
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

    # Handles /manage 
    elif data.startswith("mng_select_"):
        doc_id = data.replace("mng_select_", "")

        keyboard = [
            [InlineKeyboardButton("✅ Mark as Reclaimed", callback_data = f"mng_reclaim_{doc_id}")],
            [InlineKeyboardButton("🗑️ Delete Entirely", callback_data = f"mng_delete_{doc_id}")],
            [InlineKeyboardButton("⬅️ Back to Portfolio", callback_data = "mng_back")]
        ]

        await query.edit_message_text(
            text = "⚙️ <b>Manage Listing</b>\n\nWhat would you like to do with this item?",
            reply_markup = InlineKeyboardMarkup(keyboard),
            parse_mode = "HTML"
        )

    # Handles 'Mark as Reclaimed' Button
    elif data.startswith("mng_reclaim_"):
        doc_id = data.replace("mng_reclaim_", "")

        # Connect to database.py to update it
        success = database.update_listing_status(doc_id, "reclaimed")

        if success:
            text = "✅ <b>Item Marked as Reclaimed!</b>\n\nThe map pin has been updated. Type /manage to view your portfolio."
        else:
            text = "❌ <b>Database Error:</b> Could not update the listing."

        await query.edit_message_text(text = text, parse_mode = "HTML")

    # Handles 'Delete Entirely' button
    elif data.startswith("mng_delete_"):
        doc_id = data.replace("mng_delete_", "")

        # Delete from both Firestore and Cloudinary
        try:
            if database.db is None:
                database.initialize_database()
            doc_ref = database.db.collection("listings").document(doc_id).get()

            if doc_ref.exists:
                public_id = doc_ref.to_dict().get("cloudinaryPublicId")
                if public_id:
                    storage.delete_image(public_id)
        except Exception as e:
            logger.error(f"Error: {e}")

        success = database.delete_listing(doc_id)

        if success:
            text = "🗑️ <b>Listing Deleted!</b>\n\nThe item has been permanently removed from the map. Type /manage to view your portfolio."
        else:
            text = "❌ <b>Database Error:</b> Could not delete the listing."
            
        await query.edit_message_text(text=text, parse_mode="HTML")

    # Handles 'Back to Portfolio' button
    elif data == "mng_back":
        await query.edit_message_text(
            text="🔙 <b>Menu Closed</b>\n\nPlease type /manage to reload your active listings.",
            parse_mode="HTML"
        )

    # Handles 'Approve' button for handshake
    elif data.startswith("hs_approve_"):
        parts = data.split("_")
        doc_id = parts[2]
        loser_chat_id = int(parts[3]) if len(parts) > 3 else None

        success = database.update_listing_status(doc_id, "reclaimed")

        if success and loser_chat_id:
            try:
                if database.db is None:
                    database.initialize_database()

                active_tickets = database.db.collection("lost_tickets")\
                    .where("telegramChatId", "==", loser_chat_id)\
                    .where("Status", "==", "active")\
                    .stream()
                for ticket in active_tickets:
                    database.db.collection("lost_tickets").document(ticket.id).update({"Status": "resolved"})
            except Exception as e:
                logger.error(f"Error: {e}")

        await query.edit_message_text(
            text = "✅ <b>Handshake Closed Successfully.</b>\n\nThe item has been marked as reclaimed.",
            parse_mode = "HTML"
        )

    # Handles 'Reject' button for handshake
    elif data.startswith("hs_reject_"):
        await query.edit_message_text(
            text = "❌ <b>Handshake Rejected.</b>\n\nThe item remains active on the map.",
            parse_mode = "HTML"
        )
    
    # Handles 'Message Relay' button for handshake
    elif data.startswith("msg_relay_prompt_"):
        loser_chat_id = data.replace("msg_relay_prompt_", "")

        context.user_data["state"] = "AWAITING_RELAY_MSG"
        context.user_data["relay_target_chat_id"] = loser_chat_id

        await context.bot.send_message(
            chat_id = chat_id,
            text = "📝 <b>Anonymous Relay Chat Active</b>\n\nPlease type the coordination message (e.g., meetup time/place) you want to forward to the claimant:",
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
                    f"<b>✍️ Please provide any extra information on the item you {action}.</b>\n"
                    f"Example: {example} it at COM1 basement study area"
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

async def handle_text_inputs(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handles all incoming text messages from users.
    Differentiates behaviours based on the 'state' flag in session memory.
    """
    # Check the current state of the user
    curr_state = context.user_data.get("state")
    user_flow = context.user_data.get("user_flow")

    if user_flow == "finder":
        prefix = "🟢 Finder"
    elif user_flow == "spotted":
        prefix = "🟡 Spotter"
    else:
        prefix = "🔵 Loser"

    # 1. User is at the relay message question
    if curr_state == "AWAITING_RELAY_MSG":
        relay_text = update.message.text
        target_loser_id = int(context.user_data.get("relay_target_chat_id"))

        try:
            await context.bot.send_message(
                chat_id = target_loser_id,
                text = (
                    f"💬 <b>Message from the Finder!</b>\n\n"
                    f"The finder of your item has sent you a coordination message:\n"
                    f"✉️ <i>\"{relay_text}\"</i>\n\n"
                    f"Please respond or arrange to meet up directly."
                ),
                parse_mode="HTML"
            )
            context.user_data.clear()
            await update.message.reply_text("✅ <b>Message Relayed!</b> Your text has been delivered to the claimant.", parse_mode = "HTML")

        except Exception as e:
            logger.error(f"Error: {e}")
            await update.message.reply_text("❌ Failed to relay the message. Please try again.")
        return

    # 2. User is at the custom location description question
    if curr_state == "AWAITING_CUSTOM_SPOT":
        custom_text = update.message.text.strip()
        context.user_data["custom_spot_text"] = custom_text
        context.user_data["active_micro_key"] = "spot_custom_input"
        # Clear the user's state before they move to the next question
        context.user_data["state"] = None

        await update.message.reply_text(
            text = f"<b>{prefix}</b> ➔ <b>Custom Spot Saved:</b> <i>{custom_text}</i>\n\nWhat category does this item fall into?",
            reply_markup = InlineKeyboardMarkup(CATEGORY_KEYBOARD),
            parse_mode = "HTML"
        )

    # 3. User is at the item name question
    elif curr_state == "AWAITING_ITEM_NAME":
        context.user_data["item_name"] = update.message.text.strip()

        if user_flow in ["finder", "spotted"]:
            context.user_data["state"] = "AWAITING_PHOTO"
            action = "found" if user_flow == "finder" else "spotted"
            text = (
                f"<b>{prefix}</b> ➔ <b>Category confirmed</b>\n\n"
                f"📸 Please upload an image of the item you {action}.\n"
                f"This image will be used to identify the item."
            )

            await update.message.reply_text(
                text = text,
                parse_mode = "HTML"
            )

        else:
            context.user_data["state"] = "AWAITING_DESCRIPTION"

            await update.message.reply_text(
                text = "Please describe the item",
                parse_mode = "HTML"
            )
    
    # 4. User is at the Lost Item Keyword question 
    elif curr_state == "AWAITING_KEYWORD" and user_flow == "loser":
        keyword = update.message.text.strip().lower()
        chat_id = update.effective_chat.id

        macro_key = context.user_data.get("active_macro_key")
        macro_name = ZONE_NAME_MAP.get(macro_key, "Custom/ Unspecified")

        micro_key = context.user_data.get("active_micro_key")
        if micro_key == "spot_custom_input":
            micro_name = context.user_data.get("custom_spot_text", "Custom Location")
        else:
            micro_name = micro_key.replace("spot_", "").replace("_", " ").title() if micro_key else "Anywhere"

        now = datetime.now(timezone.utc)

        # Build the database payload for 'lost_ticket'
        ticket_payload = {
            "telegramChatId": chat_id,
            "category": context.user_data.get("active_category_key", "cat_others").replace("cat_", ""),
            "keywords": keyword,
            "macroLocation": macro_name,
            "microLocation": micro_name,
            "Status": "active",
            "timestamp": now,
            "expireAt": now + timedelta(days = 14)
        }

        # Save ticket to the 'lost_ticket'
        database.add_lost_ticket(ticket_payload)

        success_text = (
            f"🎟️ <b>Lost Search Ticket Active!</b>\n\n"
            f"We are now monitoring the database for the keyword: <b>{keyword}</b>\n"
            f"If a finder uploads an item matching this description, we will instantly notify you here.\n\n"
            f"🔗 <b>Click to open the live map dashboard:</b>\n{config.WEB_APP_BASE_URL}"
        )
        
        context.user_data.clear()
        await update.message.reply_text(text = success_text, parse_mode = "HTML")

    # 5. User is at the item description question
    elif curr_state == "AWAITING_DESCRIPTION":
        chat_id = update.effective_user.id
        username = update.effective_user.username
        description_text = update.message.text
        user_flow = context.user_data.get("user_flow")

        try:
            match_alerts = database_saver(context.user_data, chat_id, username, description_text)

            prefix = "🟢 Finder" if user_flow == "finder" else "🟡 Spotter"
            await update.message.reply_text(
                text = (
                    f"<b>{prefix} Mode</b> ➔ <b>Listing Published Live!</b> 🎉\n\n"
                    "Thank you! Your listing has been saved successfully!\n"
                    "Students can access this on the map now."
                ),
                parse_mode = "HTML"
            )
            context.user_data.clear()

            for alert in match_alerts:
                try:
                    await context.bot.send_message(
                        chat_id = alert["chat_id"],
                        text = (
                            f"🔔 <b>FindItNUS Match Alert!</b>\n\n"
                            f"A finder just reported an item matching your open search tracking filters:\n"
                            f"📍 <b>Found At:</b> {alert['micro_name']} ({alert['macro_name']})\n"
                            f"📝 <b>Details:</b> {description_text.strip()}\n\n"
                            f"🔗 <b>View your matching pin live on the Campus Map:</b>\n{alert['view_url']}"
                        ),
                        parse_mode="HTML"
                    )
                except Exception as e:
                    logger.error(f"Failed to send match alert: {e}")
        
        except Exception as e:
            logger.error(f"Posting failure: {e}")
            await update.message.reply_text("Failed to publish listing. Try again!")

def database_saver(user_data: dict, chat_id: int, username: str, description_text: str) -> list:
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
        lat, long = get_coordinates(micro_key, apply_jitter = True)

    if user_flow == "finder":
        report_type = "found"
    elif user_flow == "spotted":
        report_type = "spotted"
    else:
        report_type = "lost"

    now = datetime.now(timezone.utc)
    
    # Build the database payload dictionary
    payload = {
        # Particulars
        "UserID": chat_id,
        "UserName": username,
        
        # ReportType
        "ReportType": report_type,
        "ItemName": user_data.get("item_name"),
        "ItemCategory": user_data.get("active_category_key", "cat_others").replace("cat_", ""),
        "ItemDescription": description_text.strip(),

        # Location
        "ItemLocationInput": "", #TODO
        "ItemLocation": macro_name,
        "ItemLocationDetail": micro_name,
        "Latitude": lat,
        "Longitude": long,

        # Time
        "UserSubmitTiming": now,
        "Year": now.year,
        "Month": now.month,
        "Day": now.day,
        "Hour": now.hour,
        "Minute": now.minute,
        "Second": now.second,
        "expireAt": now + timedelta(days = 14),

        # Image
        "imageUrl": user_data.get("temp_img_url"),
        "cloudinaryPublicId": user_data.get("temp_public_id"),

        # Item Status
        "Status": "spotted" if user_flow == "spotted" else "active",
    }
    # Establish connection to Firebase and look for 'listings'
    doc_id = database.add_item_listing(payload)

    if not doc_id:
        raise RuntimeError("Database is offline!")

    # Matchmaking Portion
    matches_found = []
    try:
        if database.db is None:
            database.initialize_database()

        tickets_ref = database.db.collection("lost_tickets")\
            .where("Status", "==", "active")\
            .stream()
        
        notified_losers = set()

        for ticket_doc in tickets_ref:
            ticket_data = ticket_doc.to_dict()
            ticket_keyword = ticket_data.get("keywords", "").lower().strip()
            loser_chat = ticket_data.get("telegramChatId")
            ticket_macro = ticket_data.get("macroLocation", "Entire Campus")
            
            # Combine the Item Name and Description for easier keyword search 
            item_name_text = user_data.get("item_name", "")
            full_search_text = f"{item_name_text} {description_text}".lower()
            
            # Check if the found item's location matches loser's search zone
            if ticket_macro in [macro_name, "Entire Campus"]:
                if loser_chat and loser_chat not in notified_losers:
                    keyword_words = ticket_keyword.split()

                    # Check if the loser's keywords exist in the found item's description
                    if keyword_words and all(word in full_search_text.lower() for word in keyword_words):
                        clean_base_url = config.WEB_APP_BASE_URL.rstrip('/')
                        view_url = f"{clean_base_url}/Saved?location=NUS&id={doc_id}&latitude={lat}&longitude={long}"

                        matches_found.append({
                            "chat_id": loser_chat,
                            "micro_name": micro_name,
                            "macro_name": macro_name,
                            "view_url": view_url
                        })

                        notified_losers.add(loser_chat)
    
    except Exception as match_err:
        logger.error(f"Matchmaking error: {match_err}")

    return matches_found

def main() -> None:
    # Initilize Telegram framework using the necessary config details
    app = Application.builder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("website", website))
    app.add_handler(CommandHandler("manage", manage))

    app.add_handler(CallbackQueryHandler(handle_button_clicks))

    app.add_handler(MessageHandler(filters.PHOTO, handle_finder_photo))

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text_inputs))

    threading.Thread(target = run_health_check, daemon = True).start()
    threading.Thread(target = run_deletion, daemon = True).start()
    
    # Check if Telegram bot starts successfully
    print("FindItNUS Bot is running successfully")
    app.run_polling()

if __name__ == "__main__":
    main()
