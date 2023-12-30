const express = require('express')

const router = express.Router();
const {
    getAllUsers,
} = require("../controllers/ChatControllers")

router.get('/getallusers',getAllUsers)

module.exports = router