// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Countdown functionality
var countDownDate = new Date("Mar 15, 2025 6:00:00").getTime();
var countdownFunction = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (distance < 0) {
    clearInterval(countdownFunction);
    document.getElementById("countdown").innerHTML = "EXPIRED";
  }
}, 1000);

// Chat functionality
const messagesDiv = document.getElementById('messages');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function displayMessage(name, message, time) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message-box';
  if (name.toLowerCase() === nameInput.value.trim().toLowerCase()) {
    messageDiv.classList.add('sent');
  }
  messageDiv.innerHTML = `
    <div class="message-info">
      <span class="message-name">${name}</span>
      <span class="message-time">${new Date(time).toLocaleString()}</span>
    </div>
    <div class="message-text">${message}</div>
  `;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (name && message) {
    const now = new Date().getTime();
    const messageData = {
      name: name,
      message: message,
      time: now
    };
    firebase.database().ref('messages').push(messageData);
    messageInput.value = '';
  }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

firebase.database().ref('messages').on('child_added', function(snapshot) {
  const message = snapshot.val();
  displayMessage(message.name, message.message, message.time);
});

document.addEventListener('DOMContentLoaded', displayMessages);
