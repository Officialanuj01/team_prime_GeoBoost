const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.post('/send', notificationController.sendNotifications);
router.post('/connect', notificationController.connectWhatsApp);
router.get('/qr', notificationController.getWhatsAppQr);
router.get('/status', notificationController.getWhatsAppStatus);
router.post('/disconnect', notificationController.disconnectWhatsApp);

module.exports = router;
