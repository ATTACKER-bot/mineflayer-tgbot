const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = '7438666273:AAE2e9VukSVXaWy7XLHETMRcgximjzwwiQc';
const chatId = '824319716';
const url = 'https://YOUR-RENDER-URL.onrender.com'; // 👈 Bu yerga o‘z Render URL’ingizni yozing

const bot = new TelegramBot(token, {
  webHook: {
    port: false
  }
});

bot.setWebHook(`${url}/telegram-webhook`);
console.log('📬 Telegram webhook ulandi:', `${url}/telegram-webhook`);

let commandCallback = null;

bot.on('message', (msg) => {
  const username = msg.from.username;
  const text = msg.text?.trim();
  if (text && commandCallback) {
    commandCallback(username, text);
  }
});

function sendToTelegram(message) {
  bot.sendMessage(chatId, message).catch(console.error);
}

function setCommandCallback(callback) {
  commandCallback = callback;
}

function webhookHandler(req, res) {
  bot.processUpdate(req.body);
  res.sendStatus(200);
}

module.exports = {
  sendToTelegram,
  setCommandCallback,
  webhookHandler
};
