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

**Endpoint:**  
`GET /messages?user1=<USER_A>&user2=<USER_B>`

**Example:**  
`/messages?user1=alice&user2=bob`

**Response:**
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

## Deployment

This project can be deployed on Render or any other Node-compatible hosting platform. Static client files will be served from the `public/` folder.

Ensure that the `PORT` environment variable is set appropriately in deployment environments.

---

## License

This project is for educational use. No license included.
