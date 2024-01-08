const express = require('express')

const router = express.Router();
const {
    getAllUsers,
    sendChatMessage,
    getChatMessages,
    // sendMediaMessage
} = require("../controllers/ChatControllers");


router.get('/getallusers',getAllUsers)
router.post('/sendchatmessage',sendChatMessage)
router.get("/getchatmessages/:senderid/:receiverid",getChatMessages)
// router.post("/sendmediamessage",sendMediaMessage);

module.exports = router