
# Real-Time Chat Backend

A minimal real-time chat backend built using **Node.js**, **Express**, and **Socket.IO**, designed for two-user communication with offline message support and REST-based chat history retrieval.

**Live Deployment**: [https://real-time-chat-m2fg.onrender.com/](https://real-time-chat-m2fg.onrender.com/)

---

## Features

- Real-time WebSocket communication
- Offline message buffering
- Message acknowledgment with delivery status
- Chat history retrieval via REST API
- In-memory architecture (no external database)
- Minimal frontend to test WebSocket events
- Unit-tested logic

---

## Technologies Used

- Node.js
- Express.js
- Socket.IO
- Jest (Unit Testing)

---

## Folder Structure

```
real-time-chat-backend/
├── public/                 # Static HTML client (served at root)
│   └── client.html
├── routes/
│   └── messages.js         # REST endpoint for history
├── tests/
│   └── chatManager.test.js # Unit tests for core logic
├── chatManager.js          # Chat state manager (user/socket map, buffering)
├── server.js               # Main server logic (REST + WebSocket)
├── package.json
└── README.md
```

---

## Chat UI Preview

<img width="1064" alt="image" src="https://github.com/user-attachments/assets/af572026-d30e-4bd5-a0b5-ae116e639eee" />

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Git

### Installation

```bash
git clone https://github.com/utanish/real-time-chat.git
cd real-time-chat
npm install
```

### Run the Server

```bash
node server.js
```

Visit `http://localhost:3000` to access the test chat client.

---

## REST API Reference

### Get Chat History

Fetch the full chronological conversation between two users.

```
GET /messages?user1=<USER_A>&user2=<USER_B>
```

### Description

Retrieves all chat messages exchanged between two specified users. This is a **read-only** endpoint that queries the server's in-memory message store.

### Query Parameters

| Parameter | Type   | Required | Description                             |
| --------- | ------ | -------- | --------------------------------------- |
| `user1`   | string |   Yes    | ID of the first user (sender/receiver)  |
| `user2`   | string |   Yes    | ID of the second user (sender/receiver) |

> The messages are returned regardless of direction (i.e., both `user1 → user2` and `user2 → user1` messages are included).

### Example Request

```
GET /messages?user1=alice&user2=bob
```

### Response

Returns a JSON array of message objects:

```json
[
  {
    "from": "alice",
    "to": "bob",
    "content": "Hello!",
    "timestamp": 1729210928371
  },
  {
    "from": "bob",
    "to": "alice",
    "content": "Hi!",
    "timestamp": 1729210934123
  }
]
```

### Timestamp Format

UNIX epoch time in milliseconds.

### Status Codes

| Code | Description                |
| ---- | -------------------------- |
| 200  |   Success - Data returned  |
| 400  |   Missing query parameters |
| 500  |   Server error             |


---

## WebSocket Events

| Event              | Triggered By     | Description                                |
|-------------------|------------------|--------------------------------------------|
| `init`            | Client           | Registers user and delivers buffered msgs  |
| `send_message`    | Client           | Sends message from A → B                 |
| `receive_message` | Server           | Emitted to B upon delivery                 |
| `delivered_ack`   | Client           | Acknowledgment of receipt                  |
| `update_status`   | Server           | Notifies A of delivery status              |
| `check_user_status` | Client         | Asks if another user is online            |
| `user_status`     | Server           | Responds with online/offline status       |

---

## Testing

Run the unit tests:

```bash
npm test
```

Tests are written using **Jest** and validate:
- User registration and retrieval
- Message buffering and delivery
- Chat history persistence

---

## Architecture Diagram

![ChatGPT Image Jun 28, 2025, 02_10_48 AM](https://github.com/user-attachments/assets/978bec90-c9ba-4e27-adff-147bbbb8c54b)

## Deployment

This project can be deployed on Render or any other Node-compatible hosting platform. Static client files will be served from the `public/` folder.

Ensure that the `PORT` environment variable is set appropriately in deployment environments.

---

## License

This project is for educational use. No license included.
