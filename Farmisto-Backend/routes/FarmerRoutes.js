const express = require('express');
const { getProfile, updateProfile, editPassword, GetDashboard, GetFarmerLocation } = require('../controllers/FarmerController');
const { getPaymentSettings, updatePaymentSettings, submitFeedback } = require('../controllers/FarmerSettingsController.js');
const Authentication = require('../middleware/Authentication');
const router = express.Router();
const upload = require('../config/multer')

// Note: Register and Login are now handled by /user/register and /user/login

router.get("/settings/profile-data", Authentication, getProfile)
router.patch("/settings/update-profile", Authentication, upload.single("profilePhoto"), updateProfile)
router.patch("/settings/changePassword", Authentication, editPassword)
router.get("/dashboard", Authentication, GetDashboard)
router.get('/location', Authentication, GetFarmerLocation)

router.get("/settings/payment-data", Authentication, getPaymentSettings);
router.patch("/settings/update-payment", Authentication, updatePaymentSettings);
router.post("/support/feedback", Authentication, submitFeedback);

module.exports = router;
