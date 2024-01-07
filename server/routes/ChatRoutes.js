const express = require('express')

const router = express.Router();
const {
    getAllUsers,
    sendChatMessage,
    getChatMessages
} = require("../controllers/ChatControllers")

router.get('/getallusers',getAllUsers)
router.post('/sendchatmessage',sendChatMessage)
router.get("/getchatmessages/:senderid/:receiverid",getChatMessages)

module.exports = router