const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// YENİ ÜYE KAYDI
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, message: "Kayıt başarılı!" });
    } catch (err) {
        // İŞTE BURASI BİZE GERÇEK HATAYI SÖYLEYECEK:
        console.error("🔥 KAYIT HATASI DETAYI:", err);
        res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};

// GİRİŞ YAPMA
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Hatalı e-posta veya şifre." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Hatalı e-posta veya şifre." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(200).json({ token, message: "Giriş başarılı!", photoCount: user.photoCount });
    } catch (err) {
        console.error("🔥 GİRİŞ HATASI DETAYI:", err);
        res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};