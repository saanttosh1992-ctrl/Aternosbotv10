const mineflayer = require('mineflayer');

// Apne Aternos server ki details yahan dalein
const CONFIG = {
  host: 'YOUR_SERVER.aternos.me', // Apna IP dalein
  port: 25565,                     // Apna Port dalein
  username: 'KeepAliveBot',
  auth: 'offline',
  version: false,                  // ViaVersion ke saath auto-detect karega
  reconnectDelay: 25000            // 25 second baad dubara try karega
};

let bot = null;
let reconnectTimer = null;
let antiAfkTimer = null;

function scheduleReconnect() {
  if (reconnectTimer) return; // Ek time par ek hi timer chalega
  console.log(`Server offline ya restart ho raha hai. ${CONFIG.reconnectDelay / 1000}s baad dubara join karega...`);
  
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    createBot();
  }, CONFIG.reconnectDelay);
}

function createBot() {
  // Purane timers clean karein
  if (antiAfkTimer) {
    clearInterval(antiAfkTimer);
    antiAfkTimer = null;
  }

  console.log('Server se connect karne ki koshish jaari hai...');

  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    auth: CONFIG.auth,
    version: CONFIG.version,
    checkTimeoutInterval: 60000 // Restart ke time slow response par timeout na ho
  });

  bot.once('spawn', () => {
    console.log('✅ Bot server mein auto-join ho gaya!');

    // Anti-AFK movement: har 45 second mein jump aur thoda ghumega
    antiAfkTimer = setInterval(() => {
      if (!bot || !bot.entity) return;
      bot.setControlState('jump', true);
      bot.look(Math.random() * Math.PI * 2, 0);
      setTimeout(() => {
        if (bot) bot.setControlState('jump', false);
      }, 400);
    }, 45000);
  });

  // Jab server restart ho, kick kare, ya band ho
  bot.on('kicked', (reason) => {
    console.log('⚠️ Server ne kick kiya (Restart/Stop):', reason);
  });

  bot.on('end', () => {
    console.log('🔌 Connection band ho gaya.');
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    console.log('❌ Connection error (Server abhi start ho raha hai):', err.code || err.message);
    scheduleReconnect();
  });
}

// Bot start karein
createBot();
