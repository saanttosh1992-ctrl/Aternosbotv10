const mineflayer = require('mineflayer');

function startBot() {
  const bot = mineflayer.createBot({
    host: 'YOUR_SERVER.aternos.me',
    port: 25565,
    username: 'KeepAliveBot',
    auth: 'offline',
    version: false
  });

  bot.on('spawn', () => {
    console.log('Bot server mein join ho gaya.');
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      }
    }, 60000);
  });

  bot.on('end', () => {
    console.log('Disconnect ho gaya, 15s baad dobara try karega...');
    setTimeout(startBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

startBot();
