// webhookHandler.js

const crypto = require('crypto');
const express = require('express');
const config = require('./auth');

const router = express.Router();

function verifyWebhook(signature, timestamp, payload) {
  const message = `v0:${timestamp}:${payload}`;
  const hash = crypto.createHmac('sha256', config.webhookSecret)
                     .update(message)
                     .digest('hex');
  const expectedSignature = `v0=${hash}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

router.post('/', express.raw({type: 'application/json'}), (req, res) => {
  try {
    const signature = req.headers['x-zm-signature'];
    const timestamp = req.headers['x-zm-request-timestamp'];
    const payload = req.body;

    if (verifyWebhook(signature, timestamp, payload)) {
      console.log('Webhook verified and processed');
      // Process the webhook payload here
      // You can add your logic to handle different event types
      res.status(200).send('Webhook received');
    } else {
      console.log('Webhook verification failed');
      res.status(401).send('Webhook verification failed');
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal server error');
  }
});
module.exports = router;
