const multer = require('multer');
const path = require('path');

//create a storage engine
const storage  = multer.diskStorage({

  destination: (req,file,cb) =>{
    cb(null,'uploads/');
  },

  filename: (req,file,cb) =>{
    cb(null,Date.now() + '-' + file.originalname);
  },

});

//allow only images
const fileFilter = (req,file,cb) =>{
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimeType);

  if(extname && mimeType){
    cb(null,true);
  }

  else{
    cb(new Error("Only images are allowed (jpeg,jpg,png,gif)"));
  }

};


//actual multer middleware
const upload = multer({
  storage,
  limits: {fileSize: 5*1024*1024},
  fileFilter,
});

module.exports = upload;


