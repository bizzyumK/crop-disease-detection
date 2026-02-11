const upload = require("../middleware/upload.js");
const express = require("express");
const { protect } = require("../middleware/authMiddleware.js"); 

const router = express.Router();

const { getImages, uploadImage, deleteImage } = require('../controllers/imageController.js');

router.get('/', protect, getImages); 
router.post('/upload', protect, upload.single('image'), uploadImage); 
router.delete('/:id', protect, deleteImage);
module.exports = router;