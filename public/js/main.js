const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const listUsers = document.getElementById('users');

// Get username and room using QueryString
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// User join room
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // New message pop up
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit message
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get message text from input
  const inputMessage = event.target.elements.msg.value;

  // Emit message to server
  socket.emit('inputMessage', inputMessage);

  // Clear input
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

// Output Message to DOM
const outputMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="user-chat">
        ${message.username} <span>${message.time}</span>
    </p>
    <p class="text">
        ${message.text}
    </p>
    `;
  document.querySelector('.chat-messages').appendChild(div);
};

// Output Room
const outputRoom = (room) => {
  roomName.innerText = room;
};

const outputUsers = (users) => {
  listUsers.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
};
