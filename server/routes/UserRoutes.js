const express = require('express');
const router = express.Router();

const {
    login,
    signUp,
    sendotp
} = require('../controllers/AuthControllers')

router.post('/login',login)
router.post('/signup',signUp)
router.post('/sendotp',sendotp)

module.exports = router