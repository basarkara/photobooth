const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // Klasik giriş kontrolü
const admin = require('../middleware/admin'); // Yeni yazdığımız admin kontrolü

// Sadece adminlerin erişebildiği istatistik rotası
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        
        // Tüm kullanıcıları çekip fotoğraflarını sayıyoruz
        const users = await User.find();
        const totalPhotos = users.reduce((acc, user) => acc + user.photos.length, 0);

        res.status(200).json({ 
            userCount, 
            totalPhotos,
            message: "Sistemin kontrolü sende, patron!" 
        });
    } catch (err) {
        console.error("İstatistik hatası:", err);
        res.status(500).json({ message: "Veriler alınırken hata oluştu." });
    }
});

module.exports = router;