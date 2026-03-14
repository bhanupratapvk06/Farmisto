const express = require('express');
const {FarmerRegister , FarmerLogin, getProfile, updateProfile, editPassword, GetDashboard, GetFarmerLocation} = require('../controllers/FarmerController');
const { getPaymentSettings, updatePaymentSettings, submitFeedback } = require('../controllers/FarmerSettingsController');
const Authentication = require('../middleware/Authentication');
const router = express.Router();
const upload = require('../config/multer')

router.post("/register", FarmerRegister);
router.post("/login", FarmerLogin);

router.get("/settings/profile-data",Authentication,getProfile) 
router.patch("/settings/update-profile",Authentication,upload.single("profilePhoto"),updateProfile)
// router.patch("/settings/logout",Authentication,loggedOut)
router.patch("/settings/changePassword",Authentication,editPassword)
router.get("/dashboard",Authentication,GetDashboard)
router.get('/location',Authentication,GetFarmerLocation)


router.get("/settings/payment-data", Authentication, getPaymentSettings);
router.patch("/settings/update-payment", Authentication, updatePaymentSettings);
router.post("/support/feedback", Authentication, submitFeedback);

module.exports = router;
