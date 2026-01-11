const Image = require("../models/Images.js");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const getImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const images = await Image.find({ user: userId });
    return res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload image and call ML API
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    if (!userId)
      return res.status(401).json({ message: "User Id is required" });

    // Store data in DB with temporary diseaseDetected
    let image = await Image.create({
      user: userId,
      imageUrl: req.file.path,
      diseaseDetected: "pending",
    });

    // Prepare image for FastAPI
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    // Call FastAPI ML API
    const response = await axios.post("https://subodhdhamala-greenbidu.hf.space/predict/", form, {
      headers: form.getHeaders(),
    });

    const mlResult = response.data;

    // Update image with prediction
    image.diseaseDetected = mlResult.disease || "unknown";
    await image.save();

    return res.status(200).json({
      message: "Image uploaded successfully",
      image,
      mlResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    if (!imageId)
      return res.status(404).json({ message: "Id params is required" });

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete file from ./uploads
    fs.unlink(image.imageUrl, (err) => {
      if (err) {
        return res.json({
          message: "An error occurred while deleting file: " + err,
        });
      }
      console.log("Image deleted");
    });

    await image.deleteOne();

    return res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getImages, uploadImage, deleteImage };
