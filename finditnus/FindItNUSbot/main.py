import os
from typing import Final
import firebase_admin

from dotenv import load_dotenv
from firebase_admin import credentials, firestore

from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Update,
)

from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)

from datetime import datetime
from zoneinfo import ZoneInfo

# Load environment variables

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")

# Firebase
TOKEN: Final = BOT_TOKEN
BOT_USERNAME: Final = "FindItNUSbot"

# Use service account
cred = credentials.Certificate("finditnus/FindItNUSbot/serviceAccountKey.json")

firebase_app = firebase_admin.initialize_app(cred)
firebase_db = firestore.client()

(
    REPORT_TYPE,
    ITEM_NAME,
    ITEM_CATEGORY,
    ITEM_DESCRIPTION,
    ITEM_LOCATION_INPUT,
    ITEM_LOCATION_AREA,
    ITEM_LOCATION_DETAIL
) = range(7)


# Commands
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hello! Welcome to the FindItNUS bot. Use /report to start.")

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("start - Start the bot\nhelp - Show help\nreport - Create a lost-and-found listing\ncancel - Cancel the current listing flow\nstatus - Check listing status\nmylistings - View your submitted listings")

async def report_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    menu = [
        [InlineKeyboardButton("I lost something", callback_data="lost")],
        [InlineKeyboardButton("I found something", callback_data="found")],
        [InlineKeyboardButton("I saw something left behind", callback_data="spotted")],
    ]

    await update.message.reply_text(
        "Are you reporting a lost or found item?",
        reply_markup=InlineKeyboardMarkup(menu),
    )

    return REPORT_TYPE

async def report_type(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    query = update.callback_query
    await query.answer()
    context.user_data["report_type"] = query.data

    await query.message.reply_text("What is the item's name?")

    return ITEM_NAME

async def item_name(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    context.user_data["item_name"] = update.message.text

    menu = [
        [
            InlineKeyboardButton("Cards / IDs", callback_data="Cards / IDs"),
            InlineKeyboardButton("Electronics", callback_data="Electronics"),
        ],
        [
            InlineKeyboardButton("Bags", callback_data="Bags"),
            InlineKeyboardButton("Personal Items", callback_data="Personal Items"),
        ],
        [
            InlineKeyboardButton("Study Materials", callback_data="Study Materials"),
            InlineKeyboardButton("Other", callback_data="Other"),
        ],
    ]

    await update.message.reply_text("Choose a category:", reply_markup=InlineKeyboardMarkup(menu))

    return ITEM_CATEGORY

async def item_category(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    query = update.callback_query
    await query.answer()
    context.user_data["item_category"] = query.data

    await query.message.reply_text("Describe the item briefly")

    return ITEM_DESCRIPTION

async def item_description(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    context.user_data["item_description"] = update.message.text

    menu = [
        [InlineKeyboardButton("Choose NUS Area", callback_data="choose_nus_area")],
    ]

    if context.user_data["report_type"] == "lost":
        await update.message.reply_text("Where was it lost?", reply_markup=InlineKeyboardMarkup(menu))
    else:
        await update.message.reply_text("Where was it found?", reply_markup=InlineKeyboardMarkup(menu))

    return ITEM_LOCATION_INPUT

async def item_location_input(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    query = update.callback_query
    await query.answer()
    context.user_data["item_location_input"] = query.data

    menu = [
        [
            InlineKeyboardButton("UTown", callback_data="UTown"),
            InlineKeyboardButton("Central Library", callback_data="Central Library"),
        ],
        [
            InlineKeyboardButton("Engineering", callback_data="Engineering"),
            InlineKeyboardButton("Computing", callback_data="Computing"),
        ],
        [
            InlineKeyboardButton("Science", callback_data="Science"),
            InlineKeyboardButton("Business", callback_data="Business"),
        ],
        [
            InlineKeyboardButton("Arts", callback_data="Arts"),
            InlineKeyboardButton("Medicine", callback_data="Medicine"),
        ],
        [
            InlineKeyboardButton("UHC", callback_data="UHC"),
            InlineKeyboardButton("USC", callback_data="USC"),
        ],
    ]

    if context.user_data["item_location_input"] == "choose_nus_area":
        await query.message.reply_text("Choose a NUS area:\n", reply_markup=InlineKeyboardMarkup(menu))
        return ITEM_LOCATION_AREA

async def item_location_area(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    query = update.callback_query
    await query.answer()
    context.user_data["item_location"] = query.data

    await query.message.reply_text("Location saved.\nPlease type in exact details about the location\ne.g COM3 Level 1 Benches")
    return ITEM_LOCATION_DETAIL

async def item_location_detail(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    context.user_data["item_location_detail"] = update.message.text

    await generate_report(update, context)
    update_database(update, context)

    return ConversationHandler.END

async def generate_report(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Report Submitted!\
    \nReport Type: " + context.user_data["report_type"] + \
    "\nItem Name: " + context.user_data["item_name"] + \
    "\nItem Category: " + context.user_data["item_category"] + \
    "\nItem Description: " + context.user_data["item_description"] + \
    "\nItem Location: " + context.user_data["item_location"] + ", " + context.user_data["item_location_detail"] + \
    "\n")

# Coordinates from Google Maps
# TODO implement NUSMods Location API for future enhancements
NUS_AREA_COORDINATES = {
     "UTown": {
        "latitude": 1.3059176154741567,
        "longitude": 103.7728946675182,
    },
    "Central Library": {
        "latitude": 1.2966294465706647,
        "longitude": 103.77299429635536,
    },
    "Engineering": {
        "latitude": 1.3003535990313602,
        "longitude": 103.77077734424164,
    },
    "Computing": {
        "latitude": 1.2949570151935264,
        "longitude": 103.77399521961179,
    },
    "Science": {
        "latitude": 1.29651282268807,
        "longitude": 103.78035618844802,
    },
    "Business": {
        "latitude": 1.293229761537869,
        "longitude": 103.77401767566921,
    },
    "Arts": {
        "latitude": 1.2948536689943728,
        "longitude": 103.77156813101674,
    },
    "Medicine": {
        "latitude": 1.2965302639504568,
        "longitude": 103.78179213868317,
    },
    "UHC": {
        "latitude": 1.299360824558925,
        "longitude": 103.77635558101099,
    },
    "USC": {
        "latitude": 1.2999118637462117,
        "longitude": 103.77551105402769,
    },
}

def update_database(update: Update, context: ContextTypes.DEFAULT_TYPE):

    # Get submit timing
    UserSubmitTiming = datetime.now(ZoneInfo("Asia/Singapore"))
    Year = UserSubmitTiming.year
    Month = UserSubmitTiming.month
    Day = UserSubmitTiming.day
    Hour = UserSubmitTiming.hour
    Minute = UserSubmitTiming.minute
    Second = UserSubmitTiming.second


    # python-tele-api
    UserID = update.effective_user.id
    UserName = update.effective_user.username

    ReportType = context.user_data["report_type"]
    ItemName = context.user_data["item_name"]
    ItemCategory = context.user_data["item_category"]
    ItemDescription = context.user_data["item_description"]
    ItemLocationInput = context.user_data["item_location_input"]

    ItemLocation = context.user_data["item_location"]
    Latitude = NUS_AREA_COORDINATES[ItemLocation]["latitude"]
    Longitude = NUS_AREA_COORDINATES[ItemLocation]["longitude"]
    ItemLocationDetail = context.user_data["item_location_detail"]

    # Set data in Firebase
    data = {
        "UserID": UserID,
        "UserName": UserName,

        "ReportType": ReportType,
        "ItemName": ItemName,
        "ItemCategory": ItemCategory,
        "ItemDescription": ItemDescription,

        "ItemLocationInput": ItemLocationInput,
        "ItemLocation": ItemLocation,
        "Latitude": Latitude,
        "Longitude": Longitude,
        "ItemLocationDetail": ItemLocationDetail,

        "UserSubmitTiming": UserSubmitTiming,
        "Year": Year,
        "Month": Month,
        "Day": Day,
        "Hour": Hour,
        "Minute": Minute,
        "Second": Second,
    }

    if ReportType == "lost":
        firebase_db.collection("LostItemData").document(str(UserID)).collection("Reports").add(data)
    elif ReportType == "found":
        firebase_db.collection("FoundItemData").document(str(UserID)).collection("Reports").add(data)
    else:
        firebase_db.collection("SeenItemData").document(str(UserID)).collection("Reports").add(data)

    context.user_data.clear()

async def cancel_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    await update.message.reply_text("Report Cancelled")
    return ConversationHandler.END


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Status Command")


async def myListings_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("My Listings Command")


# Responses
def handle_response(text: str) -> str:
    # processed: str = text.lower()
    return "Hello! Use /help if you need help"


# Messages
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text: str = update.message.text

    response: str = handle_response(text)
    print("Bot:", response)

    await update.message.reply_text(response)


# Errors
async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Update {update} caused error {context.error}")


# Run the bot in polling mode
# TODO remove polling mode once the telebot is deployed 
if __name__ == "__main__":
    print("Starting Bot....")
    app = Application.builder().token(TOKEN).build()

    report_handler = ConversationHandler(
        entry_points=[CommandHandler("report", report_command)],
        states={
            REPORT_TYPE: [CallbackQueryHandler(report_type)],
            ITEM_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, item_name)],
            ITEM_CATEGORY: [CallbackQueryHandler(item_category)],
            ITEM_DESCRIPTION: [MessageHandler(filters.TEXT & ~filters.COMMAND, item_description)],
            ITEM_LOCATION_INPUT: [CallbackQueryHandler(item_location_input)],
            ITEM_LOCATION_AREA: [CallbackQueryHandler(item_location_area)],
            ITEM_LOCATION_DETAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, item_location_detail)]
        },
        fallbacks=[CommandHandler("cancel", cancel_command)],
    )

    # Commands
    #TODO fill in the rest of the new commands
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(report_handler)
    app.add_handler(CommandHandler("cancel", cancel_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(CommandHandler("mylistings", myListings_command))

    # Messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Errors
    app.add_error_handler(error)

    # Polls the bot
    print("Polling...")
    app.run_polling(poll_interval=1)
