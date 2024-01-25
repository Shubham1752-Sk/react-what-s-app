const express = require('express')

const router = express.Router()

const {
    getProfileDetails,
    updateProfile,
    // updateProfilePicture
} = require("../controllers/ProfileControllers")

router.post('/getprofiledetails', getProfileDetails);
router.post('/updateprofile', updateProfile);
// router.post('/updateprofilepicture',updateProfilePicture);

module.exports = router;