const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    maxPhotos: { type: Number, default: 5 },
    photoCount: { type: Number, default: 0 },
    photos: [{ type: String }] // Cloudinary linkleri
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);