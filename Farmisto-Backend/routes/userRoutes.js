const express = require('express');
const { UserRegister, UserLogin, BuyItem, GetUser, GetItemsByFarmerEmail } = require('../controllers/UserController');
const Authentication = require('../middleware/Authentication');
const { fetchNearbyFarmers } = require('../controllers/GeoController');

const router = express.Router();

router.post('/register', UserRegister);
router.post('/login', UserLogin);
router.post('/buy-item', Authentication, BuyItem);
router.get('/get-user/:id', GetUser);
router.get('/fetch-nearby-farmers', Authentication, fetchNearbyFarmers);
router.post('/get-items-by-farmerId', Authentication, GetItemsByFarmerEmail);

module.exports = router;
