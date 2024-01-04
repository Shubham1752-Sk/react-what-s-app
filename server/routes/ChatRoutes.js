const express = require('express')

const router = express.Router();
const {
    getAllUsers,
    sendChatMessage,
} = require("../controllers/ChatControllers")

router.get('/getallusers',getAllUsers)
router.post('/sendchatmessage',sendChatMessage)

module.exports = router