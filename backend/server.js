require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Route dosyalarını içe aktar
const photoRoutes = require('./routes/photoRoutes'); 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // YENİ: Admin rotasını içe aktardık

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// Rotaları kullanıma aç
app.use('/api/auth', authRoutes);
app.use('/api', photoRoutes); 
app.use('/api/admin', adminRoutes); // YENİ: Admin rotasını kullanıma açtık

app.get('/api/status', (req, res) => {
    res.json({ message: "PhotoBooth SaaS API tıkır tıkır çalışıyor 🚀" });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/photobooth')
.then(() => console.log('✅ MongoDB veritabanına başarıyla bağlanıldı!'))
.catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

const path = require('path');

// 1. Frontend klasörünü dışarıya aç
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. KESİN ÇÖZÜM: Parametresiz, düz '/' rotası ile tüm dosyayı sun
app.use((req, res, next) => {
    // API isteklerini frontend'e yönlendirme! (Bunu da garantiye aldım)
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Sunucu ${PORT} portunda başarıyla ayaklandı!`);
});