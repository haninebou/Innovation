const express = require('express');
const { signup, login, getUserProfile, changePassword, updateUserProfile } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile/:id', getUserProfile);
router.post('/change-password', changePassword);
router.put('/update-profile/:id', updateUserProfile); 

module.exports = router;
