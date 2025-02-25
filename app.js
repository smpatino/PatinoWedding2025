const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
});

const db = admin.database();
const messagesRef = db.ref('messages');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use static files from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get messages
app.get('/api/messages', (req, res) => {
  messagesRef.once('value', (snapshot) => {
    res.json(snapshot.val());
  });
});

// Endpoint to add a new message (if needed)
app.post('/api/messages', (req, res) => {
  const { name, message } = req.body;
  const now = new Date().getTime();
  const messageData = { name, message, time: now };

  messagesRef.push(messageData, (error) => {
    if (error) {
      res.status(500).json({ error: 'Message could not be saved.' });
    } else {
      res.status(200).json({ success: 'Message sent successfully.' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
