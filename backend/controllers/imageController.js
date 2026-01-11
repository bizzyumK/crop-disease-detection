const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

const getImages = async (req,res)=>{
  try{
    const images = await Image.find({farmer: req.farmer._id});
    res.status(200).json(images);

  }catch(error){
    res.status(500).json({error: err.message});
  }
};

const uploadImage = async (req,res)=>{
  try{
    const file = req.file;

    if(!file){
      return res.status(400).json({error: 'No file Uploaded!'});
    }

    const image = new Image({
      farmer: req.farmer._id,
      imageUrl : `/uploads/${req.file.filename}`,
    });

    await image.save();

    res.status(201).json({message: "Image uploaded successfully! ", image})

  }catch(error){
    res.status(500).json({error:error.message});
  }
};

const deleteImage = async (req,res)=>{
  try{
    
    const image = await Image.findById(req.params.id);

    if(!image){
      return res.status(404).json({message: 'Image not found!'});
    }


    //ensure owner
    if (image.farmer.toString() !== req.farmer._id.toString()){
      return res.status(401).json({message: 'Not authorized!'});
    };
    

    //remove file from uploads folder
    const filePath = path.join(__dirname,'..',image.imageUrl);
    fs.unlink(filePath,(err)=>{
      if(err){
        console.error('Failed to delete image file! ', err);
      }

      else{
        console.log('Image file deleted!', filePath)
      }
    })


    //remove record from MongoDB
    await image.deleteOne();

    res.status(200).json({message:'Image deleted successfully! '});


  }catch(err){
    res.status(500).json({error: err.message})
  }
};

module.exports = {
  getImages,
  uploadImage,
  deleteImage
};
