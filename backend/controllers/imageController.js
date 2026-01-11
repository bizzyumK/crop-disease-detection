const Image = require('../models/Images.js');
const fs = require('fs');

const getImages = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const images = await Image.find({ farmer: farmerId });
    return res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
// Upload image + Call ML API
const uploadImage = async (req, res) => {
  try {
    const userId = req.user.id;

    const farmerId = req.user.id;
    if (!farmerId) return res.status(401).json({ message: "Farmer Id is required" });

    //Store data in DB 
    const image = await Image.create({
      farmer: farmerId,
      imageUrl: req.file.path,
      diseaseDetected: "pending"
    });

    return res.status(200).json({ message: 'Image uploaded successfully', image });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

}
// Delete image
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    if (!imageId) return res.status(404).json({ message: "Id params not should" });

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    //Delete file from ./uploads
    fs.unlink(image.imageUrl, (err) => {
      if (err) {
        return res.json({ message: "An error occure while deleting file ," + err });
      }
      console.log("Image deleted");
    });

    await image.deleteOne();

    return res.json({ message: "File deleted Sucessfull" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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

module.exports = {
  getImages,
  uploadImage,
  deleteImage,
};