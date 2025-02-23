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
var messages = JSON.parse(localStorage.getItem('messages')) || [];
const messagesDiv = document.getElementById('messages');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function displayMessages() {
  messagesDiv.innerHTML = '';
  messages.forEach((message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-box';
    if (message.name.toLowerCase() === nameInput.value.trim().toLowerCase()) {
      messageDiv.classList.add('sent');
    }
    messageDiv.innerHTML = `
      <div class="message-info">
        <span class="message-name">${message.name}</span>
        <span class="message-time">${new Date(message.time).toLocaleString()}</span>
      </div>
      <div class="message-text">${message.message}</div>
    `;
    messagesDiv.appendChild(messageDiv);
  });
  // Auto-scroll to the bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (name && message) {
    const now = new Date();
    messages.push({ name, message, time: now });
    localStorage.setItem('messages', JSON.stringify(messages));
    messageInput.value = '';
    displayMessages();
    // Trigger storage event manually to sync across devices/tabs
    localStorage.setItem('messagesUpdated', Date.now());
  }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

// Ensure updates are reflected across all tabs/devices
window.addEventListener('storage', function (e) {
  if (e.key === 'messages' || e.key === 'messagesUpdated') {
    messages = JSON.parse(localStorage.getItem('messages')) || [];
    displayMessages();
  }
});

// Initial call to display messages
document.addEventListener('DOMContentLoaded', displayMessages);
