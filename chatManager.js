const users = new Map();
const bufferedMessages = new Map();
const chatHistory = new Map();

function registerUser(userId, socket) {
  users.set(userId, socket);
}

function removeUser(userId) {
  users.delete(userId);
}

function getOnlineSocket(userId) {
  return users.get(userId);
}

function bufferMessage(userId, message) {
  if (!bufferedMessages.has(userId)) bufferedMessages.set(userId, []);
  bufferedMessages.get(userId).push(message);
}

function deliverBufferedMessages(userId) {
  const socket = getOnlineSocket(userId);
  const messages = bufferedMessages.get(userId) || [];

  for (const msg of messages) {
    socket.emit("receive_message", msg);
  }

  if (messages.length > 0) {
    console.log(
      `[Buffered Delivery] ${messages.length} messages delivered to ${userId}`
    );
  }

  bufferedMessages.delete(userId);
}

function storeChatHistory(user1, user2, message) {
  const key = [user1, user2].sort().join("-");
  if (!chatHistory.has(key)) chatHistory.set(key, []);
  chatHistory.get(key).push(message);
}

function getChatHistory(user1, user2) {
  const key = [user1, user2].sort().join("-");
  return chatHistory.get(key) || [];
}

function _clearAll() {
  users.clear();
  bufferedMessages.clear();
  chatHistory.clear();
}

module.exports = {
  registerUser,
  removeUser,
  getOnlineSocket,
  bufferMessage,
  deliverBufferedMessages,
  storeChatHistory,
  getChatHistory,
  _clearAll, 
};
