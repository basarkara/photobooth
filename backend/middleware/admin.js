const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // req.user.id, bir önceki 'auth' middleware'inden geliyor
        const user = await User.findById(req.user.id);
        
        if (user && user.role === 'admin') {
            next(); // Sen adminsen kapıyı aç
        } else {
            res.status(403).json({ message: "Erişim engellendi: Sadece yetkili yöneticiler girebilir." });
        }
    } catch (error) {
        console.error("Admin kontrol hatası:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
};