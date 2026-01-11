const Image = require('../models/Image');

const getImages = async (req,res)=>{
  try{
    const images = await Image.find({farmer: req.farmer._id});
    res.status(200).json(images);
  }catch(error){
    res.status(500).res.json({error: err.message});
  }
};

const uploadImage = async (req,res)=>{
  try{
    const file = req.file;

    if(!file){
      return res.status(400).json({error: 'No file Uploaded!'});
    }

    const image = new Image.create({
      farmer: req.farmer._id,
      imageUrl : `/uploads/$(req.file.filename)`,
    });

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