const express = require('express');
const postmark = require('postmark');


const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;
const API_TOKEN = process.env.API_TOKEN || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || '';
const client = new postmark.ServerClient(API_TOKEN);
app.use(express.json());


app.post('/send-email', (req, res) => {
  const recipientEmail = req.body.recipientEmail;
  const senderEmail = SENDER_EMAIL;

  if (!recipientEmail) {
    return res.status(400).send('Recipient email is required');
  }

  client.sendEmailWithTemplate({
    From: senderEmail,
    To: recipientEmail,
    TemplateId: 36189200,
    TemplateModel: {
      name: recipientEmail,
      product_name: 'Awesome Product',
      action_url: 'https://example.com/action',
      login_url: 'https://example.com/login',
      username: recipientEmail,
      trial_length: '30',
      trial_start_date: '2024-06-01',
      trial_end_date: '2024-07-01',
      support_email: 'support@example.com',
      live_chat_url: 'https://example.com/live-chat',
      sender_name: senderEmail,
      help_url: 'https://example.com/help',
    }
  }, function (error, result) {
    if (error) {
      console.error('Unable to send via postmark: ' + error.message);
      res.status(500).send('Error sending email: ' + error.message);
      return;
    }
    console.info('Sent to postmark for delivery: ' + result.To);
    res.send('Email sent successfully to ' + result.To);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
