const users = [];

// Join user into room and chat
const joinUser = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

// Get the user
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// User Left room
const userLeft = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0];
  }
};

// Get User Room
const getUserRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { joinUser, getUser, userLeft, getUserRoom };
