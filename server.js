const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const {
  registerUser,
  removeUser,
  storeChatHistory,
  bufferMessage,
  deliverBufferedMessages,
  getOnlineSocket,
} = require("./chatManager.js");

const messagesRoute = require("./routes/messages.js");

const app = express();
app.use(express.static("public"));
app.use("/messages", messagesRoute);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  let currentUser = null;
  console.log(`[Socket] Connected: ${socket.id}`);

  socket.on("init", (userId) => {
    try {
      currentUser = userId;
      registerUser(userId, socket);
      console.log(`[Init] ${userId} is now online`);
      deliverBufferedMessages(userId);
      io.emit("user_status", { userId, status: "online" });
    } catch (err) {
      console.error(`[Init Error] ${err.message}`);
    }
  });

  socket.on("send_message", (msg, callback) => {
    try {
      const { from, to } = msg;
      storeChatHistory(from, to, msg);
      const receiverSocket = getOnlineSocket(to);

      if (receiverSocket) {
        receiverSocket.emit("receive_message", msg);
        console.log(`[Message] ${from} → ${to} | Delivered`);
        callback({ status: "delivered", timestamp: msg.timestamp });
      } else {
        bufferMessage(to, msg);
        console.log(`[Message] ${from} → ${to} | Buffered`);
        callback({ status: "sent", timestamp: msg.timestamp });
      }
    } catch (err) {
      console.error(`[Send Error] ${err.message}`);
      callback({ status: "error", error: err.message });
    }
  });

  socket.on("delivered_ack", ({ to, timestamp }) => {
    try {
      const senderSocket = getOnlineSocket(to);
      if (senderSocket) {
        senderSocket.emit("update_status", { timestamp });
        console.log(`[Ack] ${to} received message sent at ${timestamp}`);
      }
    } catch (err) {
      console.error(`[Ack Error] ${err.message}`);
    }
  });

  socket.on("check_user_status", (targetUserId) => {
    try {
      const isOnline = !!getOnlineSocket(targetUserId);
      socket.emit("user_status", {
        userId: targetUserId,
        status: isOnline ? "online" : "offline",
      });
    } catch (err) {
      console.error(`[Status Check Error] ${err.message}`);
    }
  });

  socket.on("disconnect", () => {
    try {
      if (currentUser) {
        removeUser(currentUser);
        console.log(`[Socket] Disconnected: ${currentUser}`);
        io.emit("user_status", { userId: currentUser, status: "offline" });
      }
    } catch (err) {
      console.error(`[Disconnect Error] ${err.message}`);
    }
  });
});

const PORT = 3000;
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/client.html");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
