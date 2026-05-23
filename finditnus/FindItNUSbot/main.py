from typing import Final

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

TOKEN: Final = "8810540711:AAHjABPwTJ8iWIc3Kfa3U1YLPMVlCLHAANs"
BOT_USERNAME: Final = "FindItNUSbot"

REPORT_TYPE, ITEM_NAME, ITEM_CATEGORY, ITEM_LOCATION, CONTACT_NUMBER = range(5)

# Commands
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Hello! Welcome to the FindItNUS bot. Use /report to create a listing."
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "start - Start the bot\n"
        "help - Show help\n"
        "report - Create a lost-and-found listing\n"
        "cancel - Cancel the current listing flow\n"
        "status - Check listing status\n"
        "mylistings - View your submitted listings"
    )


# Reporting

async def report_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    menu = [
        [
            InlineKeyboardButton("Lost", callback_data="Lost"),
            InlineKeyboardButton("Found", callback_data="Found"),
        ]
    ]

    await update.message.reply_text(
        "Are you reporting a lost or found item?",
        reply_markup=InlineKeyboardMarkup(menu),
    )

    return REPORT_TYPE


async def report_type(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive data
    query = update.callback_query
    await query.answer()

    # Save data
    context.user_data["report_type"] = query.data

    # Ask for item name
    await query.message.reply_text("What is the item's name?")

    return ITEM_NAME


async def item_name(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Receive data
    context.user_data["item_name"] = update.message.text

    menu = [
        [
            InlineKeyboardButton("Electronics", callback_data="Electronics"),
            InlineKeyboardButton("Accessories", callback_data="Accessories"),
        ],
        [
            InlineKeyboardButton("Clothing", callback_data="Clothing"),
            InlineKeyboardButton("Documents", callback_data="Documents"),
        ],
        [InlineKeyboardButton("Other", callback_data="Other")],
    ]

    await update.message.reply_text(
        "What is the item's category?", reply_markup=InlineKeyboardMarkup(menu)
    )

    return ITEM_CATEGORY


async def item_category(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    context.user_data["item_category"] = query.data

    await query.message.reply_text(
        f"Where was it {context.user_data['report_type'].lower()}?"
    )

    return ITEM_LOCATION


async def item_location(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["item_location"] = update.message.text

    await update.message.reply_text("What is the contact number?")

    return CONTACT_NUMBER


async def contact_number(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["contact_number"] = update.message.text

    report = {
        "report_type": context.user_data["report_type"],
        "item_name": context.user_data["item_name"],
        "item_category": context.user_data["item_category"],
        "item_location": context.user_data["item_location"],
        "contact_number": context.user_data["contact_number"],
    }

    await update.message.reply_text(
        "Report Submitted\n"
        "Report Type: " + report["report_type"] + "\n"
        "Item Name: " + report["item_name"] + "\n"
        "Item Category: " + report["item_category"] + "\n"
        "Item Location: " + report["item_location"] + "\n"
        "Contact Number: " + report["contact_number"] + "\n"
    )
    context.user_data.clear()

    return ConversationHandler.END


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
            ITEM_LOCATION: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, item_location)
            ],
            CONTACT_NUMBER: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, contact_number)
            ],
        },
        fallbacks=[CommandHandler("cancel", cancel_command)],
    )

    # Commands
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
