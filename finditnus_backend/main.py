import os
import logging
import random
import hashlib
import time
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime, timedelta
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
    [InlineKeyboardButton("❌ Cancel", callback_data="action_cancel")]
]

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
        "Let's look for your campus belongings!\n" "Are you reporting an item you found, or searching for something you lost?"
        )
    
    # Assign a role to the user, either a Finder or Loser
    keyboard = [
        [
            InlineKeyboardButton("📦 I Found an Item", callback_data="flow_finder"),
            InlineKeyboardButton("🔍 I Lost an Item", callback_data="flow_loser")
        ]
    ]

    # Display the message on chat
    await update.message.reply_text(
        text = welcome_message, 
        reply_markup = InlineKeyboardMarkup(keyboard), 
        parse_mode = "HTML"
    )

def main() -> None:
    # Initilize Telegram framework using the necessary config details
    app = Application.builder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    # Check if Telegram bot starts successfully
    print("FindItNUS Bot is running successfully")
    app.run_polling()

if __name__ == "__main__":
    main()