const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    diseaseDetected: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Image = mongoose.model("image", imageSchema);
module.exports = Image;
