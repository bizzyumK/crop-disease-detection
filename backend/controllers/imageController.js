const Image = require('../models/Images.js');
const fs = require('fs');
const path = require('path');

// Get all images for logged-in farmer
const getImages = async (req, res) => {
  try {
    const images = await Image.find({ farmer: req.farmer._id })
      .sort({ createdAt: -1 });

    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Upload image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }

    const image = await Image.create({
      farmer: req.farmer._id,
      imageUrl: `/uploads/${req.file.filename}`,
      diseaseDetected: 'pending'
    });

    return res.status(201).json({
      message: 'Image uploaded successfully!',
      image
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found!' });
    }

    // Check ownership
    if (image.farmer.toString() !== req.farmer._id.toString()) {
      return res.status(401).json({ message: 'Not authorized!' });
    }

    // Build correct file path
    const filePath = path.join(__dirname, '..', image.imageUrl);

    // Delete physical file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('File delete error:', err);
      }
    });

    await image.deleteOne();
    res.status(200).json({message:'Image deleted successfully! '});

    return res.status(200).json({ message: 'Image deleted successfully!' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getImages,
  uploadImage,
  deleteImage,
};
