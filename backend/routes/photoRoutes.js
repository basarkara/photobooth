const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth'); // Güvenlik duvarımızı çağırdık

// Artık bu adrese gelen herkes önce 'auth' duvarından geçmek zorunda!
router.post('/upload', auth, photoController.uploadPhoto);
router.get('/my-photos', auth, photoController.getPhotos);
router.delete('/delete', auth, photoController.deletePhoto);

module.exports = router;