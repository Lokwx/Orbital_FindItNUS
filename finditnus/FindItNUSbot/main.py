import os
from typing import Final

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Update,
    KeyboardButton,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
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
    ITEM_LOCATION, 
    ITEM_LOCATION_INPUT, 
    ITEM_LOCATION_COORDINATES, 
    ITEM_LOCATION_DETAIL,
    CREATE_LISTING,
) = range(9)


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
            InlineKeyboardButton("Cards / IDs", callback_data="cards_ids"),
            InlineKeyboardButton("Electronics", callback_data="electronics"),
        ],
        [
            InlineKeyboardButton("Bags", callback_data="bags"),
            InlineKeyboardButton("Personal Items", callback_data="personal_items"),
        ],
        [
            InlineKeyboardButton("Study Materials", callback_data="study_materials"),
            InlineKeyboardButton("Other", callback_data="other"),
        ],
    ]

    await update.message.reply_text("Choose a category:\n", reply_markup=InlineKeyboardMarkup(menu))

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
        [InlineKeyboardButton("Share Current Location", callback_data="share_location")],
        [InlineKeyboardButton("Choose NUS Area", callback_data="choose_nus_area")],
        [InlineKeyboardButton("Type Location Manually", callback_data="type_location_manually")],
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

    if context.user_data["item_location_input"] == "share_location":
        location_keyboard = [[KeyboardButton(text="Share Location", request_location=True)]]
        await query.message.reply_text("Share your current location only if you are near the item", reply_markup=ReplyKeyboardMarkup(location_keyboard, resize_keyboard=True, one_time_keyboard=True))

    if context.user_data["item_location_input"] == "choose_nus_area":
        await query.message.reply_text("Choose a NUS area:\n", reply_markup=InlineKeyboardMarkup(menu))

    if context.user_data["item_location_input"] == "type_location_manually":
        await query.message.reply_text("Type the location manually")

    return ITEM_LOCATION

async def item_location(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.user_data["item_location_input"] == "choose_nus_area":
        query = update.callback_query
        await query.answer()
        context.user_data["item_location"] = query.data
    else:
        context.user_data["item_location"] = update.message.text

    return ITEM_LOCATION_DETAIL

async def item_location_coordinates(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    location = update.message.location

    context.user_data["latitude"] = location.latitude
    context.user_data["longitude"] = location.longitude

    await update.message.reply_text(
        "Location saved. Please type a short location detail, e.g. COM1 Level 2 benches.",
        reply_markup=ReplyKeyboardRemove(),
    )

    return ITEM_LOCATION_DETAIL

async def item_location_detail(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive Data
    context.user_data["item_location_detail"] = update.message.text

    await generate_report(update, context)
    update_database(update, context)

    return ConversationHandler.END

async def generate_report(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Report Submitted\
    \nReport Type: " + context.user_data["report_type"] + \
    "\nItem Name: " + context.user_data["item_name"] + \
    "\nItem Category: " + context.user_data["item_category"] + \
    "\nItem Location: " + context.user_data["item_location"] + \
    "\nContact Number: " + context.user_data["contact_number"] + "\n")


def update_database(update: Update, context: ContextTypes.DEFAULT_TYPE):

    # python-tele-api
    UserID = update.effective_user.id
    UserName = update.effective_user.username

    ReportType = context.user_data["report_type"]
    ItemName = context.user_data["item_name"]
    ItemCategory = context.user_data["item_category"]
    ItemLocation = context.user_data["item_location"]
    ContactNumber = context.user_data["contact_number"]

    # Set data in Firebase
    data = {
        "UserID": UserID,
        "UserName": UserName,
        "ReportType": ReportType,
        "ItemName": ItemName,
        "ItemCategory": ItemCategory,
        "ItemLocation": ItemLocation,
        "ContactNumber": ContactNumber,
    }

    if ReportType == "Lost":
        firebase_db.collection("LostItemData").document(str(UserID)).collection("Reports").add(data)
    else:
        firebase_db.collection("FoundItemData").document(str(UserID)).collection("Reports").add(data)

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


# Run the bot
if __name__ == "__main__":
    print("Starting Bot....")
    app = Application.builder().token(TOKEN).build()

    report_handler = ConversationHandler(
        entry_points=[CommandHandler("report", report_command)],
        states={
            REPORT_TYPE: [CallbackQueryHandler(report_type)],
            ITEM_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, item_name)],
            ITEM_CATEGORY: [CallbackQueryHandler(item_category)],
            ITEM_LOCATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, item_location)],
            #TODO fill in the rest of the new commands
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
