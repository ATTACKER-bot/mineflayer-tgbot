const TelegramBot = require('node-telegram-bot-api');

// Siz bergan token va ID
const token = '7438666273:AAE2e9VukSVXaWy7XLHETMRcgximjzwwiQc';
const chatId = '824319716';

const bot = new TelegramBot(token, { polling: true });

function sendToTelegram(message) {
  bot.sendMessage(chatId, message).catch(console.error);
}

function onCommand(callback) {
  bot.on('message', msg => {
    const username = msg.from.username;
    const text = msg.text?.trim();
    if (!text) return;
    callback(username, text);
  });
}

module.exports = {
  sendToTelegram,
  onCommand
};
