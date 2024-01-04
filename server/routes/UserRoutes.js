const express = require("express")
const { 
    findUserByToken,
    addToContacts,
    fetchContacts,
    removeFromContacts
} = require("../controllers/UserControllers")

const router = express.Router()

router.get("/getuserinfo/:token",findUserByToken)
router.post("/addtocontacts",addToContacts)
router.post("/removefromcontacts",removeFromContacts)
router.get("/fetchcontacts/:id",fetchContacts)

module.exports = router
