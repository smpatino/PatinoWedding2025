document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const messagesDiv = document.getElementById('messages');
  const nameInput = document.getElementById('name-input');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  function displayMessage(message) {
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
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  sendButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (name && message) {
      const now = new Date();
      socket.emit('new message', { name, message, time: now });
      messageInput.value = '';
    }
  });

  messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendButton.click();
    }
  });

  socket.on('new message', (message) => {
    displayMessage(message);
  });
});
