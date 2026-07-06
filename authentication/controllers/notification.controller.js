const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_PHONE = process.env.TWILIO_FROM_PHONE;

exports.sendNotifications = async (req, res) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_PHONE) {
    return res.status(500).json({
      error: 'Twilio configuration is missing. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_PHONE in your environment.',
    });
  }

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Request body must include a non-empty messages array.' });
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

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
        const sentMessage = await client.messages.create({
          body: message.message,
          from: TWILIO_FROM_PHONE,
          to: message.phone,
        });

        return {
          customer: message.customer || message.phone,
          phone: message.phone,
          success: true,
          sid: sentMessage.sid,
          status: sentMessage.status,
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