// script.js

// Countdown functionality
var countDownDate = new Date("Mar 15, 2025 6:00:00").getTime();
var countdownFunction = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

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
// Updated reset button selector to a valid button ID
const resetButton = document.querySelector('.reset-link button');

function displayMessages() {
  messagesDiv.innerHTML = '';
  messages.forEach(message => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-box';
    messageDiv.classList.add(message.name === "You" ? "sent" : ""); // Apply sent class if message is sent by "You"
    messageDiv.innerHTML = `
      <div class="message-info">
        <span class="message-name">${message.name}</span>
        <span class="message-time">${new Date(message.time).toLocaleString()}</span>
      </div>
      <div class="message-text">${message.message}</div>
    `;
    messagesDiv.appendChild(messageDiv);
  });
}

function sendMessage() {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (name && message) {
    const now = new Date();
    messages.push({ name, message, time: now });
    localStorage.setItem('messages', JSON.stringify(messages));
    nameInput.value = '';
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

resetButton.addEventListener('click', () => {
  localStorage.removeItem('messages');
  messages = [];
  displayMessages();
  localStorage.setItem('messagesUpdated', Date.now());
});

displayMessages();

// Event listener to detect changes in localStorage
window.addEventListener('storage', function(e) {
  if (e.key === 'messagesUpdated') {
    messages = JSON.parse(localStorage.getItem('messages')) || [];
    displayMessages();
  }
});

// Photo upload functionality
document.getElementById('take-photo').onclick = function () {
  document.getElementById('file-input').click();
};

document.getElementById('upload-photo').onclick = function () {
  document.getElementById('file-input').click();
};

document.getElementById('view-gallery').onclick = function () {
  window.location.href = 'gallery.html';
};

document.getElementById('file-input').addEventListener('change', function (event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      let galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos')) || [];
      galleryPhotos.push(e.target.result);
      localStorage.setItem('galleryPhotos', JSON.stringify(galleryPhotos));
      window.location.href = 'gallery.html';
    };
    reader.readAsDataURL(file);
  }
});

// Gallery functionality
const galleryDiv = document.getElementById('gallery');
let galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos')) || [];

function displayGallery() {
  galleryDiv.innerHTML = '';
  galleryPhotos.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'gallery-photo';
    img.dataset.index = index;
    galleryDiv.appendChild(img);
  });
}

displayGallery();

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const close = document.querySelector('.lightbox .close');
const prev = document.querySelector('.lightbox .prev');
const next = document.querySelector('.lightbox .next');

function openLightbox(index) {
  lightboxImg.src = galleryPhotos[index];
  lightbox.style.display = 'flex';
  lightboxImg.dataset.index = index;
}

function closeLightbox() {
  lightbox.style.display = 'none';
}

function changeImage(step) {
  let index = (parseInt(lightboxImg.dataset.index) + step + galleryPhotos.length) % galleryPhotos.length;
  lightboxImg.src = galleryPhotos[index];
  lightboxImg.dataset.index = index;
}

document.querySelectorAll('.gallery-photo').forEach(photo => {
  photo.addEventListener('click', () => {
    openLightbox(photo.dataset.index);
  });
});

close.addEventListener('click', closeLightbox);
prev.addEventListener('click', () => changeImage(-1));
next.addEventListener('click', () => changeImage(1));

lightbox.addEventListener('click', event => {
  if (event.target === lightbox || event.target === close) {
    closeLightbox();
  }
});
