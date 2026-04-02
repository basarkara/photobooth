const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Erişim reddedildi. Lütfen giriş yapın." });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded; // Kullanıcının gerçek veritabanı ID'sini req.user.id içine aldık
        next(); // Güvenlik duvarını geç
    } catch (err) {
        res.status(401).json({ message: "Geçersiz veya süresi dolmuş oturum." });
    }
};