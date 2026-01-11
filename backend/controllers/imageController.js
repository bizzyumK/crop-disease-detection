const Image = require('../models/Images.js');

const getImages = async (req, res) => {
    res.json({ message: "Hello world" });
}
// Upload image + Call ML API
const uploadImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1️⃣ Store image with pending status
    let image = await Image.create({
      user: userId,
      imageUrl: req.file.path,
      diseaseDetected: "pending",
    });

    // 2️⃣ Prepare image for ML API
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    // 3️⃣ Call FastAPI ML endpoint
    const response = await axios.post(
      "https://subodhdhamala-greenbidu.hf.space/predict/",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const mlResult = response.data;

    // 4️⃣ Update image with prediction
    image.diseaseDetected = mlResult.disease || "unknown";
    await image.save();

    return res.status(200).json({
      message: "Image uploaded successfully",
      image,
      mlResult,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Upload or ML prediction failed",
      error: err.message,
    });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    if (!imageId) {
      return res.status(400).json({ message: "Image ID is required" });
    }

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete physical file
    fs.unlink(image.imageUrl, (err) => {
      if (err) {
        console.error("File deletion error:", err);
      }
    });

    await image.deleteOne();

    return res.status(200).json({ message: "File deleted successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getImages,
  uploadImage,
  deleteImage,
};