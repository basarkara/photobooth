const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Cloudinary Ayarları (.env dosyasından çekiyoruz)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

exports.uploadPhoto = async (req, res) => {
    try {
        // userId'yi sildik, sadece fotoğraf verisini alıyoruz
        const { photoData } = req.body; 

        // 1. Kullanıcıyı token içindeki ID ile bul (req.user.id auth middleware'inden geliyor)
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapın." });
        }

        // 2. Kota Kontrolü (SaaS Mantığı)
        if (user.photoCount >= user.maxPhotos && user.plan === 'free') {
            return res.status(403).json({ 
                success: false,
                error: "Kota doldu", 
                message: "Ücretsiz paket sınırına (5 fotoğraf) ulaştınız. Sınırsız çekim için Premium'a geçin." 
            });
        }

        // 3. FOTOĞRAFI CLOUDINARY'YE YÜKLEME
        const uploadResponse = await cloudinary.uploader.upload(photoData, {
            folder: "photobooth_saas", 
        });

        const imageUrl = uploadResponse.secure_url;

        // 4. Veritabanını Güncelleme 
        user.photos.push(imageUrl);
        user.photoCount += 1;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Fotoğraf başarıyla buluta yüklendi!",
            photoUrl: imageUrl,
            remainingQuota: user.maxPhotos - user.photoCount
        });

    } catch (error) {
        console.error("Fotoğraf yükleme hatası:", error);
        res.status(500).json({ success: false, message: "Sunucu veya Cloudinary hatası oluştu." });
    }
};

// KULLANICININ GEÇMİŞ FOTOĞRAFLARINI VE KOTASINI GETİR
exports.getPhotos = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        
        res.status(200).json({ 
            photos: user.photos, 
            photoCount: user.photoCount,
            limitReached: (user.photoCount >= user.maxPhotos && user.plan === 'free')
        });
    } catch (error) {
        console.error("Fotoğrafları çekerken hata:", error);
        res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};

// FOTOĞRAF SİLME VE KOTAYI GERİ VERME
exports.deletePhoto = async (req, res) => {
    try {
        const { photoUrl } = req.body; // Silinecek fotoğrafın linki
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

        // Fotoğrafı kullanıcının dizisinden çıkar (sil)
        user.photos = user.photos.filter(url => url !== photoUrl);
        
        // Kullanıcının kotasını 1 azalt (Böylece 1 hak geri kazanır!)
        if (user.photoCount > 0) {
            user.photoCount -= 1;
        }

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Fotoğraf başarıyla silindi ve 1 hak kazanıldı!",
            remainingQuota: user.maxPhotos - user.photoCount
        });

    } catch (error) {
        console.error("Fotoğraf silme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};