require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Route dosyasını içe aktar
const photoRoutes = require('./routes/photoRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// Rotaları kullanıma aç
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api', photoRoutes); 

app.get('/api/status', (req, res) => {
    res.json({ message: "PhotoBooth SaaS API tıkır tıkır çalışıyor 🚀" });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/photobooth')
.then(() => console.log('✅ MongoDB veritabanına başarıyla bağlanıldı!'))
.catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

const path = require('path');

// Frontend klasörünü dışarıya aç
app.use(express.static(path.join(__dirname, '../frontend')));

// Herhangi bir tanımlanmayan rotada doğrudan index.html'i göster (Uygulama çökmesin diye)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`🔥 Sunucu http://localhost:${PORT} adresinde ayaklandı!`);
});