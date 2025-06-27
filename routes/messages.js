const express = require("express");
const { getChatHistory } = require("../chatManager.js");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const history = getChatHistory(user1, user2);
    res.json(history);
  } catch (err) {
    console.error(`[REST Error] ${err.message}`);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

module.exports = router;
