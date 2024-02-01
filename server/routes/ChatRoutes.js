const express = require('express')
const multer = require("multer")

const router = express.Router();
const {
    getAllUsers,
    sendChatMessage,
    getChatMessages,
    // sendMediaMessage
} = require("../controllers/ChatControllers");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null, "../uploads/recordings")
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}-${file.name}`)
    }
})

const upload = multer({storage})

router.get('/getallusers',getAllUsers)
router.post('/sendchatmessage',upload.single("audiofile"),sendChatMessage)
router.get("/getchatmessages/:senderid/:receiverid",getChatMessages)
// router.post("/sendmediamessage",sendMediaMessage);

module.exports = router