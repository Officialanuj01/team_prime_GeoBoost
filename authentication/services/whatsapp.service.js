const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const clients = {};
const statuses = {};
const qrs = {};

const sanitizeId = (userId) => {
  if (!userId) return 'guest_user';
  return userId.replace(/[^\w-]/g, '_');
};

const initClientForUser = (rawUserId) => {
  const userId = sanitizeId(rawUserId);
  
  if (clients[userId]) {
    return;
  }

  console.log(`Initializing WhatsApp Client for User: ${userId}`);
  statuses[userId] = 'loading';
  qrs[userId] = null;

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    }
  });

  client.on('qr', (qr) => {
    console.log(`QR Code generated for User ${userId}`);
    qrs[userId] = qr;
    statuses[userId] = 'qr_ready';
    qrcodeTerminal.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log(`WhatsApp Client is ready for User ${userId}!`);
    statuses[userId] = 'ready';
    qrs[userId] = null;
  });

  client.on('auth_failure', (msg) => {
    console.error(`Auth failure for User ${userId}:`, msg);
    statuses[userId] = 'disconnected';
    qrs[userId] = null;
    delete clients[userId];
  });

  client.on('disconnected', (reason) => {
    console.log(`WhatsApp Client disconnected for User ${userId}:`, reason);
    statuses[userId] = 'disconnected';
    qrs[userId] = null;
    delete clients[userId];
  });

  clients[userId] = client;
  client.initialize();
};

const sendWhatsAppMessageForUser = async (rawUserId, toPhone, body) => {
  const userId = sanitizeId(rawUserId);
  const client = clients[userId];
  
  if (!client || statuses[userId] !== 'ready') {
    throw new Error('WhatsApp client is not ready. Please connect it first.');
  }

  const formattedNumber = toPhone.replace(/[^\d]/g, '').trim();
  const chatId = `${formattedNumber}@c.us`;

  console.log(`Sending message from User ${userId} to: ${chatId}`);
  const response = await client.sendMessage(chatId, body);
  return response;
};

const disconnectUser = async (rawUserId) => {
  const userId = sanitizeId(rawUserId);
  const client = clients[userId];
  
  if (client) {
    try {
      await client.destroy();
    } catch (e) {
      console.error(`Error destroying client for user ${userId}:`, e);
    }
    delete clients[userId];
  }
  
  // Clean up session folder to force a new QR scan
  const sessionFolder = path.join(__dirname, '..', '.wwebjs_auth', `session-${userId}`);
  try {
    if (fs.existsSync(sessionFolder)) {
      fs.rmSync(sessionFolder, { recursive: true, force: true });
      console.log(`Cleaned up session folder for user ${userId}`);
    }
  } catch (err) {
    console.error(`Failed to clean session folder for user ${userId}:`, err);
  }

  statuses[userId] = 'disconnected';
  qrs[userId] = null;
};

const getStatusForUser = (rawUserId) => {
  const userId = sanitizeId(rawUserId);
  return statuses[userId] || 'disconnected';
};

const getQrForUser = (rawUserId) => {
  const userId = sanitizeId(rawUserId);
  return qrs[userId];
};

const initExistingSessions = () => {
  const sessionPath = path.join(__dirname, '..', '.wwebjs_auth');
  if (!fs.existsSync(sessionPath)) return;

  const files = fs.readdirSync(sessionPath);
  files.forEach(file => {
    if (file.startsWith('session-')) {
      const userId = file.substring(8);
      console.log(`Found existing session for user: ${userId}. Restoring...`);
      initClientForUser(userId);
    }
  });
};

const closeAllClients = async () => {
  console.log('Cleaning up active WhatsApp Puppeteer client browsers...');
  const activeIds = Object.keys(clients);
  await Promise.all(
    activeIds.map(async (id) => {
      try {
        await clients[id].destroy();
        console.log(`Destroyed WhatsApp client browser for: ${id}`);
      } catch (err) {
        console.error(`Failed to close client browser for: ${id}`, err);
      }
    })
  );
};

// Clean up processes on exit, reload, or crash
process.once('SIGINT', async () => {
  await closeAllClients();
  process.exit(0);
});

process.once('SIGTERM', async () => {
  await closeAllClients();
  process.exit(0);
});

process.once('USR2', async () => {
  await closeAllClients();
  process.kill(process.pid, 'SIGUSR2');
});

module.exports = {
  initClientForUser,
  sendWhatsAppMessageForUser,
  disconnectUser,
  getStatusForUser,
  getQrForUser,
  initExistingSessions
};
