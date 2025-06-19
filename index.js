const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');
const express = require('express');
const telegram = require('./telegram');

const app = express();
app.get('/', (req, res) => res.send('✅ Bot tirik!'));
app.listen(3000, () => console.log('🌐 Web server ishga tushdi (port 3000)'));

const options = {
  host: 'hypixel.uz',
  port: 25565,
  username: 'rotaAKXMADOV',
  version: false
};

let bot;
let lastResponseTime = 0;
const RESPONSE_COOLDOWN = 15 * 60 * 1000;
const allowedUsername = "shokxpm";
const offensiveWords = [/fuck/i, /suka/i, /bitch/i, /xotin/i, /jins/i, /sex/i, /21\+/i, /18\+/i];

function createBot() {
  bot = mineflayer.createBot(options);
  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('[BOT] Ulandi.');
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);

    bot.chat('/register werifyC12 werifyC12');
    bot.chat('/login werifyC12');

    setInterval(() => {
      const nearest = Object.values(bot.entities).find(e =>
        e.type === 'mob' &&
        !['villager', 'iron_golem', 'cat', 'wolf', 'sheep', 'cow', 'horse'].includes(e.name)
      );
      if (nearest && bot.entity) {
        bot.lookAt(nearest.position.offset(0, 1.6, 0), true, () => bot.attack(nearest));
      }
    }, 500);

    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 7000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    telegram.sendToTelegram(`<${username}> ${message}`);

    if (message.toLowerCase().includes(bot.username.toLowerCase())) {
      const now = Date.now();
      if (now - lastResponseTime > RESPONSE_COOLDOWN) {
        bot.chat('Agar men bilan aloqaga chiqmoqchi bo‘lsangiz Telegram: @shokxpm yoki Instagram: @shokxpubg');
        lastResponseTime = now;
      }
    }
  });

  telegram.onCommand((username, text) => {
    const hasOffensive = offensiveWords.some(word => word.test(text));
    if (username !== allowedUsername || hasOffensive) return;

    if (text === 'tprota') {
      bot.chat('/tpa AKXMADOV');
    } else if (text === 'tphrota') {
      bot.chat('/tphere AKXMADOV');
    } else {
      bot.chat(text);
    }
  });

  bot.on('error', err => console.log('[ERROR]', err.message));
  bot.on('end', () => {
    console.log('[BOT] Uzildi. 5 soniyadan so‘ng qayta ulanadi...');
    setTimeout(createBot, 5000);
  });
}

createBot();
