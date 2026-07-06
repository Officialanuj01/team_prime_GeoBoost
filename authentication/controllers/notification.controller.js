const QRCode = require('qrcode');
const { 
  initClientForUser, 
  sendWhatsAppMessageForUser, 
  disconnectUser, 
  getStatusForUser, 
  getQrForUser 
} = require('../services/whatsapp.service');

// Connect a specific user's WhatsApp client
exports.connectWhatsApp = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request body.' });
  }

  try {
    await initClientForUser(userId);
    res.json({ message: `WhatsApp Client session for User ${userId} initialized successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Expose QR code image data URL for a specific user
exports.getWhatsAppQr = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in query parameters.' });
  }

  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });

  const qrString = getQrForUser(userId);
  if (!qrString) {
    const status = getStatusForUser(userId);
    return res.status(404).json({ 
      error: 'No active QR code available.',
      status 
    });
  }

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrString);
    res.json({ qrCodeDataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR Code image: ' + err.message });
  }
};

// Check WhatsApp client readiness status
exports.getWhatsAppStatus = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in query parameters.' });
  }

  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });

  const status = getStatusForUser(userId);
  res.json({ status });
};

// Disconnect/Logout user's WhatsApp client
exports.disconnectWhatsApp = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request body.' });
  }

  try {
    await disconnectUser(userId);
    res.json({ message: `Successfully disconnected WhatsApp session for User ${userId}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dispatch campaign notifications
exports.sendNotifications = async (req, res) => {
  const { userId, messages } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request body.' });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Request body must include a non-empty messages array.' });
  }

  const status = getStatusForUser(userId);
  if (status !== 'ready') {
    return res.status(503).json({
      error: 'Your WhatsApp client is not connected yet. Please connect your WhatsApp account first.',
      status
    });
  }

  const results = await Promise.all(
    messages.map(async (message) => {
      if (!message.phone || !message.message) {
        return {
          customer: message.customer || message.phone || 'unknown',
          phone: message.phone,
          success: false,
          error: 'Missing phone number or message body.',
        };
      }

      try {
        const response = await sendWhatsAppMessageForUser(userId, message.phone, message.message);

        return {
          customer: message.customer || message.phone,
          phone: message.phone,
          success: true,
          id: response.id.id,
          status: 'sent',
        };
      } catch (error) {
        return {
          customer: message.customer || message.phone,
          phone: message.phone,
          success: false,
          error: error.message,
        };
      }
    })
  );

  const failed = results.filter((result) => !result.success);

  return res.json({
    message: failed.length > 0 ? 'Some messages failed to send.' : 'All messages sent successfully.',
    results,
    failedCount: failed.length,
    successCount: results.length - failed.length,
  });
};