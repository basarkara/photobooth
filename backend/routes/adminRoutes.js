const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Photo = require('../models/Photo');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

router.get('/stats', auth, adminAuth, async (req, res) => {
    const userCount = await User.countDocuments();
    const photoCount = await Photo.countDocuments();
    res.json({ userCount, photoCount });
});

module.exports = router;