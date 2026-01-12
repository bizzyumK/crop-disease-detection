const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    farmer:{
      type: mongoose.Schema.Types.ObjectId, //links to Farmer
      ref: "Farmer",
      required: true,    
    },

    imageUrl:{
      type: String,
      required: true,
    },

    diseaseDetected:{
      type:String,
      default:"Pending",
    },
},{timestamps:true});


module.exports = mongoose.model("Image",imageSchema);